import 'reflect-metadata';
import '../../utility/format';

import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import {
    KeirinGradeType,
    KeirinRaceCourse,
} from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

/**
 * 競輪場データリポジトリの実装
 */
@injectable()
export class KeirinPlaceRepositoryFromStorageImpl
    implements IPlaceRepository<KeirinPlaceEntity>
{
    constructor(
        @inject('KeirinPlaceS3Gateway')
        private readonly s3Gateway: IS3Gateway<KeirinPlaceEntity>,
    ) {}
    /**
     * 競輪場開催データを取得する
     *
     * このメソッドで日付の範囲を指定して競輪場開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<KeirinPlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<KeirinPlaceEntity>> {
        const fileNames: string[] = await this.generateFileNames(
            request.startDate,
            request.finishDate,
        );
        console.log(fileNames);
        const promises = fileNames.map(async (fileName) =>
            this.fetchMonthPlaceEntityList(fileName).then(
                (childPlaceEntityList) =>
                    childPlaceEntityList.filter(
                        (placeEntity) =>
                            placeEntity.placeData.dateTime >=
                                request.startDate &&
                            placeEntity.placeData.dateTime <=
                                request.finishDate,
                    ),
            ),
        );
        const placeEntityLists = await Promise.all(promises);
        const placeEntityList = placeEntityLists.flat();
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
            const year = currentDate.getFullYear();
            const month = currentDate.getXDigitMonth(2);
            const fileName = `${year}${month}.csv`;
            fileNames.push(fileName);

            // 次の月の1日を取得
            currentDate = new Date(year, currentDate.getMonth() + 1, 1);
        }
        console.debug(
            `ファイル名リストを生成しました: ${fileNames.join(', ')}`,
        );
        return Promise.resolve(fileNames);
    }

    /**
     * S3から競輪場開催データを取得する
     *
     * ファイル名を利用してS3から競輪場開催データを取得する
     * placeEntityが存在しない場合はundefinedを返すので、filterで除外する
     *
     * @param fileName
     * @returns
     */
    @Logger
    private async fetchMonthPlaceEntityList(
        fileName: string,
    ): Promise<KeirinPlaceEntity[]> {
        console.log(`S3から${fileName}を取得します`);
        const csv = await this.s3Gateway.fetchDataFromS3(fileName);
        const placeEntityList: KeirinPlaceEntity[] = csv
            .split('\n')
            .map((line: string) => {
                const [id, raceDate, place, grade] = line.split(',');
                return new KeirinPlaceEntity(
                    id,
                    new KeirinPlaceData(
                        new Date(raceDate),
                        place as KeirinRaceCourse,
                        grade as KeirinGradeType,
                    ),
                );
            })
            .filter((placeEntity) => placeEntity !== undefined);
        return placeEntityList;
    }

    @Logger
    async registerPlaceList(
        request: RegisterPlaceListRequest<KeirinPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        const placeEntityList: KeirinPlaceEntity[] = request.placeDataList;
        // 得られたplaceを月毎に分ける
        const placeDataDict: Record<string, KeirinPlaceEntity[]> = {};
        placeEntityList.forEach((placeEntity) => {
            const key = `${format(placeEntity.placeData.dateTime, 'yyyyMM')}.csv`;
            if (!placeDataDict[key]) {
                placeDataDict[key] = [];
            }
            placeDataDict[key].push(placeEntity);
        });

        // 月毎に分けられたplaceをS3にアップロードする
        for (const [fileName, placeData] of Object.entries(placeDataDict)) {
            await this.s3Gateway.uploadDataToS3(placeData, fileName);
        }

        return new RegisterPlaceListResponse(200);
    }
}
