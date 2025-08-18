import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
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
    
    private readonly fileName: string = CSV_FILE_NAME.PLACE_LIST;

    public constructor(
        @inject('S3Gateway')
        private readonly s3Gateway: IS3Gateway,
    ) {}

    
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<HorseRacingPlaceEntity[]> {
        
        const placeRecordList: PlaceRecord[] =
            await this.getPlaceRecordListFromS3(searchFilter.raceType);

        
        const placeEntityList: HorseRacingPlaceEntity[] = placeRecordList.map(
            (placeRecord) => placeRecord.toEntity(),
        );

        
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
            
            const existFetchPlaceRecordList: PlaceRecord[] =
                await this.getPlaceRecordListFromS3(raceType);

            
            const placeRecordList: PlaceRecord[] = placeEntityList.map(
                (placeEntity) => placeEntity.toRecord(),
            );

            
            for (const placeRecord of placeRecordList) {
                
                const index = existFetchPlaceRecordList.findIndex(
                    (record) => record.id === placeRecord.id,
                );
                if (index === -1) {
                    existFetchPlaceRecordList.push(placeRecord);
                } else {
                    existFetchPlaceRecordList[index] = placeRecord;
                }
            }

            
            existFetchPlaceRecordList.sort(
                (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
            );

            await this.s3Gateway.uploadDataToS3(
                existFetchPlaceRecordList,
                `${raceType.toLowerCase()}/`,
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

    
    @Logger
    private async getPlaceRecordListFromS3(
        raceType: RaceType,
    ): Promise<PlaceRecord[]> {
        
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.fileName,
        );

        
        if (!csv) {
            return [];
        }

        
        const lines = csv.split('\n');

        
        const headers = lines[0].split(',');

        
        const indices = {
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            dateTime: headers.indexOf(CSV_HEADER_KEYS.DATE_TIME),
            location: headers.indexOf(CSV_HEADER_KEYS.LOCATION),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        
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
}
