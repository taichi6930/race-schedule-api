import 'reflect-metadata';
import '../../utility/format';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { BoatracePlaceRecord } from '../../gateway/record/boatracePlaceRecord';
import {
    BoatraceGradeType,
    BoatraceRaceCourse,
} from '../../utility/data/boatrace';
import { Logger } from '../../utility/logger';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

/**
 * オートレースデータリポジトリの実装
 */
@injectable()
export class BoatracePlaceRepositoryFromStorageImpl
    implements IPlaceRepository<BoatracePlaceEntity>
{
    constructor(
        @inject('BoatracePlaceStorageGateway')
        private readonly s3Gateway: IS3Gateway<BoatracePlaceRecord>,
    ) {}
    /**
     * オートレース開催データを取得する
     *
     * このメソッドで日付の範囲を指定してオートレース開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<BoatracePlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<BoatracePlaceEntity>> {
        const fileNames: string[] = await this.generateFileNames(
            request.startDate,
            request.finishDate,
        );

        // ファイル名リストからオートレース開催データを取得する
        const placeRecordList: BoatracePlaceRecord[] = (
            await Promise.all(
                fileNames.map(async (fileName) =>
                    this.fetchMonthPlaceRecordList(fileName),
                ),
            )
        ).flat();

        // BoatracePlaceRecordをBoatracePlaceEntityに変換
        const placeEntityList: BoatracePlaceEntity[] = placeRecordList
            .map(
                (placeRecord) =>
                    new BoatracePlaceEntity(
                        placeRecord.id,
                        new BoatracePlaceData(
                            placeRecord.dateTime,
                            placeRecord.location,
                            placeRecord.grade,
                        ),
                    ),
            )
            // 日付の範囲でフィルタリング
            .filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= request.startDate &&
                    placeEntity.placeData.dateTime <= request.finishDate,
            );
        return new FetchPlaceListResponse(placeEntityList);
    }

    /**
     * csvのファイル名リストを生成する
     *
     * startDateからfinishDateまでの月ごとのファイル名リストを生成する
     * 月毎のファイル名が欲しいので、複数のファイル名を返す
     *
     * @param startDate
     * @param finishDate
     * @returns
     */
    @Logger
    private async generateFileNames(
        startDate: Date,
        finishDate: Date,
    ): Promise<string[]> {
        const fileNames: string[] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            const fileName = `${format(currentDate, 'yyyyMM')}.csv`;
            fileNames.push(fileName);

            // 次の月の1日を取得
            currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1,
            );
        }
        console.debug(
            `ファイル名リストを生成しました: ${fileNames.join(', ')}`,
        );
        return Promise.resolve(fileNames);
    }

    /**
     * S3からオートレース開催データを取得する
     *
     * ファイル名を利用してS3からオートレース開催データを取得する
     * placeRecordが存在しない場合はundefinedを返すので、filterで除外する
     *
     * @param fileName
     * @returns
     */
    @Logger
    private async fetchMonthPlaceRecordList(
        fileName: string,
    ): Promise<BoatracePlaceRecord[]> {
        console.log(`S3から${fileName}を取得します`);
        const csv = await this.s3Gateway.fetchDataFromS3(fileName);
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        // ヘッダーに基づいてインデックスを取得
        const idIndex = headers.indexOf('id');
        const raceDateIndex = headers.indexOf('dateTime');
        const placeIndex = headers.indexOf('location');
        const gradeIndex = headers.indexOf('grade');

        // データ行を解析してBoatracePlaceRecordのリストを生成
        const placeRecordList: BoatracePlaceRecord[] = lines
            .slice(1)
            .map((line: string) => {
                const columns = line.split(',');

                // 必要なフィールドが存在しない場合はundefinedを返す
                if (
                    !columns[idIndex] ||
                    !columns[raceDateIndex] ||
                    !columns[placeIndex] ||
                    !columns[gradeIndex]
                ) {
                    return undefined;
                }

                return new BoatracePlaceRecord(
                    columns[idIndex],
                    new Date(columns[raceDateIndex]),
                    columns[placeIndex] as BoatraceRaceCourse,
                    columns[gradeIndex] as BoatraceGradeType,
                );
            })
            .filter(
                (placeRecord): placeRecord is BoatracePlaceRecord =>
                    placeRecord !== undefined,
            );

        return placeRecordList;
    }

    @Logger
    async registerPlaceList(
        request: RegisterPlaceListRequest<BoatracePlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        const placeEntityList: BoatracePlaceEntity[] = request.placeDataList;
        // 得られたplaceを月毎に分ける
        const placeRecordDict: Record<string, BoatracePlaceRecord[]> = {};
        placeEntityList.forEach((placeEntity) => {
            const placeRecord = new BoatracePlaceRecord(
                placeEntity.id,
                placeEntity.placeData.dateTime,
                placeEntity.placeData.location,
                placeEntity.placeData.grade,
            );
            const key = `${format(placeRecord.dateTime, 'yyyyMM')}.csv`;
            if (!(key in placeRecordDict)) {
                placeRecordDict[key] = [];
            }
            placeRecordDict[key].push(placeRecord);
        });

        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, placeRecord] of Object.entries(placeRecordDict)) {
            await this.s3Gateway.uploadDataToS3(placeRecord, fileName);
        }

        return new RegisterPlaceListResponse(200);
    }
}