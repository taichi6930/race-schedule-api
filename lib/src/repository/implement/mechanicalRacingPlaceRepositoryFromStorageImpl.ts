import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { MechanicalRacingPlaceRecord } from '../../gateway/record/mechanicalRacingPlaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * データリポジトリの実装
 */
@injectable()
export class MechanicalRacingPlaceRepositoryFromStorageImpl
    implements IPlaceRepository<MechanicalRacingPlaceEntity>
{
    // S3にアップロードするファイル名
    private readonly fileName = 'placeList.csv';

    public constructor(
        @inject('KeirinPlaceS3Gateway')
        private readonly s3GatewayForKeirin: IS3Gateway<MechanicalRacingPlaceRecord>,
        @inject('AutoracePlaceS3Gateway')
        private readonly s3GatewayForAutorace: IS3Gateway<MechanicalRacingPlaceRecord>,
        @inject('BoatracePlaceS3Gateway')
        private readonly s3GatewayForBoatrace: IS3Gateway<MechanicalRacingPlaceRecord>,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<MechanicalRacingPlaceEntity[]> {
        // ファイル名リストから開催データを取得する
        const placeRecordList: MechanicalRacingPlaceRecord[] =
            await this.getPlaceRecordListFromS3(searchFilter.raceType);

        const placeEntityList: MechanicalRacingPlaceEntity[] =
            placeRecordList.map((placeRecord) => placeRecord.toEntity());

        // 日付の範囲でフィルタリング
        const filteredPlaceEntityList: MechanicalRacingPlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= searchFilter.startDate &&
                    placeEntity.placeData.dateTime <= searchFilter.finishDate,
            );

        return filteredPlaceEntityList;
    }

    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: MechanicalRacingPlaceEntity[],
    ): Promise<void> {
        // 既に登録されているデータを取得する
        const existFetchPlaceRecordList: MechanicalRacingPlaceRecord[] =
            await this.getPlaceRecordListFromS3(raceType);

        // PlaceEntityをPlaceRecordに変換する
        const placeRecordList: MechanicalRacingPlaceRecord[] =
            placeEntityList.map((placeEntity) => placeEntity.toRecord());

        // idが重複しているデータは上書きをし、新規のデータは追加する
        for (const placeRecord of placeRecordList) {
            // 既に登録されているデータがある場合は上書きする
            const index = existFetchPlaceRecordList.findIndex(
                (record) => record.id === placeRecord.id,
            );
            if (index === -1) {
                existFetchPlaceRecordList.push(placeRecord);
            } else {
                existFetchPlaceRecordList[index] = placeRecord;
            }
        }

        // 日付の最新順にソート
        existFetchPlaceRecordList.sort(
            (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
        );

        await this.setS3Gateway(raceType).uploadDataToS3(
            existFetchPlaceRecordList,
            this.fileName,
        );
    }

    /**
     * 開催場データをS3から取得する
     * @param raceType
     */
    @Logger
    private async getPlaceRecordListFromS3(
        raceType: RaceType,
    ): Promise<MechanicalRacingPlaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.setS3Gateway(raceType).fetchDataFromS3(
            this.fileName,
        );

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        // ヘッダーに基づいてインデックスを取得
        const indices = {
            id: headers.indexOf('id'),
            dateTime: headers.indexOf('dateTime'),
            location: headers.indexOf('location'),
            grade: headers.indexOf('grade'),
            updateDate: headers.indexOf('updateDate'),
        };

        const placeRecordList: MechanicalRacingPlaceRecord[] = lines
            .slice(1)
            .flatMap((line: string): MechanicalRacingPlaceRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return [
                        MechanicalRacingPlaceRecord.create(
                            columns[indices.id],
                            raceType,
                            new Date(columns[indices.dateTime]),
                            columns[indices.location],
                            columns[indices.grade],
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error(error);
                    return [];
                }
            });

        return placeRecordList;
    }

    @Logger
    private setS3Gateway(
        raceType: RaceType,
    ): IS3Gateway<MechanicalRacingPlaceRecord> {
        switch (raceType) {
            case RaceType.KEIRIN: {
                return this.s3GatewayForKeirin;
            }
            case RaceType.BOATRACE: {
                return this.s3GatewayForBoatrace;
            }
            case RaceType.AUTORACE: {
                return this.s3GatewayForAutorace;
            }
            case RaceType.JRA:
            case RaceType.NAR:
            case RaceType.WORLD: {
                throw new Error('Unsupported race type');
            }
            default: {
                throw new Error('Unsupported race type');
            }
        }
    }
}
