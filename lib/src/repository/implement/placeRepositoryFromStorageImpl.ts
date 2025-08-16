import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { PlaceRecord } from '../../gateway/record/horseRacingPlaceRecord';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { HorseRacingPlaceEntity } from '../entity/horseRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

@injectable()
export class PlaceRepositoryFromStorageImpl
    implements IPlaceRepository<HorseRacingPlaceEntity>
{
    // S3にアップロードするファイル名
    private readonly fileName = 'placeList.csv';

    public constructor(
        @inject('JraPlaceS3Gateway')
        private readonly placeS3GatewayForJra: IS3Gateway<PlaceRecord>,
        @inject('NarPlaceS3Gateway')
        private readonly placeS3GatewayForNar: IS3Gateway<PlaceRecord>,
        @inject('KeirinPlaceS3Gateway')
        private readonly placeS3GatewayForKeirin: IS3Gateway<PlaceRecord>,
        @inject('AutoracePlaceS3Gateway')
        private readonly placeS3GatewayForAutorace: IS3Gateway<PlaceRecord>,
        @inject('BoatracePlaceS3Gateway')
        private readonly placeS3GatewayForBoatrace: IS3Gateway<PlaceRecord>,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<HorseRacingPlaceEntity[]> {
        // 年ごとの開催データを取得
        const placeRecordList: PlaceRecord[] =
            await this.getPlaceRecordListFromS3(searchFilter.raceType);

        // Entityに変換
        const placeEntityList: HorseRacingPlaceEntity[] = placeRecordList.map(
            (placeRecord) => placeRecord.toEntity(),
        );

        // filterで日付の範囲を指定
        const filteredPlaceEntityList = placeEntityList.filter(
            (placeEntity) =>
                placeEntity.placeData.dateTime >= searchFilter.startDate &&
                placeEntity.placeData.dateTime <= searchFilter.finishDate,
        );

        return filteredPlaceEntityList;
    }

    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: HorseRacingPlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: HorseRacingPlaceEntity[];
        failureData: HorseRacingPlaceEntity[];
    }> {
        try {
            // 既に登録されているデータを取得する
            const existFetchPlaceRecordList: PlaceRecord[] =
                await this.getPlaceRecordListFromS3(raceType);

            // PlaceEntityをPlaceRecordに変換する
            const placeRecordList: PlaceRecord[] = placeEntityList.map(
                (placeEntity) => placeEntity.toRecord(),
            );

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

            await this.uploadDataToS3(
                raceType,
                existFetchPlaceRecordList,
                this.fileName,
            );

            return {
                code: 200,
                message: 'データの保存に成功しました',
                successData: placeEntityList,
                failureData: [],
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal Server Error',
                successData: [],
                failureData: placeEntityList,
            };
        }
    }

    /**
     * 開催場データをS3から取得する
     * @param raceType - レース種別
     */
    @Logger
    private async getPlaceRecordListFromS3(
        raceType: RaceType,
    ): Promise<PlaceRecord[]> {
        // S3からデータを取得する
        const csv = await this.fetchDataFromS3(raceType, this.fileName);

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
            updateDate: headers.indexOf('updateDate'),
        };

        // データ行を解析してPlaceDataのリストを生成
        const placeRecordList: PlaceRecord[] = lines
            .slice(1)
            .flatMap((line: string): PlaceRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return [
                        PlaceRecord.create(
                            columns[indices.id],
                            raceType,
                            new Date(columns[indices.dateTime]),
                            columns[indices.location],
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
    private async fetchDataFromS3(
        raceType: RaceType,
        fileName: string,
    ): Promise<string> {
        switch (raceType) {
            case RaceType.JRA: {
                return this.placeS3GatewayForJra.fetchDataFromS3(
                    undefined,
                    fileName,
                );
            }
            case RaceType.NAR: {
                return this.placeS3GatewayForNar.fetchDataFromS3(
                    undefined,
                    fileName,
                );
            }
            case RaceType.KEIRIN: {
                return this.placeS3GatewayForKeirin.fetchDataFromS3(
                    undefined,
                    fileName,
                );
            }
            case RaceType.BOATRACE: {
                return this.placeS3GatewayForBoatrace.fetchDataFromS3(
                    undefined,
                    fileName,
                );
            }
            case RaceType.AUTORACE: {
                return this.placeS3GatewayForAutorace.fetchDataFromS3(
                    undefined,
                    fileName,
                );
            }
            case RaceType.OVERSEAS: {
                throw new Error('Unsupported race type');
            }
        }
    }

    @Logger
    private async uploadDataToS3(
        raceType: RaceType,
        record: PlaceRecord[],
        fileName: string,
    ): Promise<void> {
        switch (raceType) {
            case RaceType.JRA: {
                await this.placeS3GatewayForJra.uploadDataToS3(
                    record,
                    undefined,
                    fileName,
                );
                break;
            }
            case RaceType.NAR: {
                await this.placeS3GatewayForNar.uploadDataToS3(
                    record,
                    undefined,
                    fileName,
                );
                break;
            }
            case RaceType.KEIRIN: {
                await this.placeS3GatewayForKeirin.uploadDataToS3(
                    record,
                    undefined,
                    fileName,
                );
                break;
            }
            case RaceType.BOATRACE: {
                await this.placeS3GatewayForBoatrace.uploadDataToS3(
                    record,
                    undefined,
                    fileName,
                );
                break;
            }
            case RaceType.AUTORACE: {
                await this.placeS3GatewayForAutorace.uploadDataToS3(
                    record,
                    undefined,
                    fileName,
                );
                break;
            }
            case RaceType.OVERSEAS: {
                throw new Error('Unsupported race type');
            }
        }
    }
}
