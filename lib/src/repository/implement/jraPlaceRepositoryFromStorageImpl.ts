import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { HeldDayData } from '../../domain/heldDayData';
import { PlaceData } from '../../domain/placeData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { HeldDayRecord } from '../../gateway/record/heldDayRecord';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

@injectable()
export class JraPlaceRepositoryFromStorageImpl
    implements IPlaceRepository<JraPlaceEntity>
{
    
    private readonly placeFileName = CSV_FILE_NAME.PLACE_LIST;
    private readonly heldDayFileName = CSV_FILE_NAME.HELD_DAY_LIST;

    public constructor(
        @inject('S3Gateway')
        private readonly s3Gateway: IS3Gateway,
    ) {}

    
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<JraPlaceEntity[]> {
        
        const placeRecordList: PlaceRecord[] =
            await this.getPlaceRecordListFromS3(searchFilter.raceType);

        const heldDayRecordList: HeldDayRecord[] =
            await this.getHeldDayRecordListFromS3(searchFilter.raceType);

        
        const recordMap = new Map<
            string,
            {
                placeRecord: PlaceRecord;
                heldDayRecord: HeldDayRecord;
            }
        >();

        
        for (const placeRecord of placeRecordList.filter(
            (_placeRecord) =>
                _placeRecord.dateTime >= searchFilter.startDate &&
                _placeRecord.dateTime <= searchFilter.finishDate,
        )) {
            const heldDayRecordItem = heldDayRecordList.find(
                (record) => record.id === placeRecord.id,
            );
            if (!heldDayRecordItem) {
                
                continue;
            }
            recordMap.set(placeRecord.id, {
                placeRecord,
                heldDayRecord: heldDayRecordItem,
            });
        }

        
        const placeEntityList: JraPlaceEntity[] = [...recordMap.values()].map(
            ({ placeRecord, heldDayRecord: heldDayRecordItem }) => {
                return JraPlaceEntity.create(
                    placeRecord.id,
                    PlaceData.create(
                        searchFilter.raceType,
                        placeRecord.dateTime,
                        placeRecord.location,
                    ),
                    HeldDayData.create(
                        heldDayRecordItem.heldTimes,
                        heldDayRecordItem.heldDayTimes,
                    ),
                    
                    new Date(
                        Math.min(
                            placeRecord.updateDate.getTime(),
                            heldDayRecordItem.updateDate.getTime(),
                        ),
                    ),
                );
            },
        );
        return placeEntityList;
    }

    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: JraPlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: JraPlaceEntity[];
        failureData: JraPlaceEntity[];
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
                this.placeFileName,
            );

            const existFetchHeldDayRecordList: HeldDayRecord[] =
                await this.getHeldDayRecordListFromS3(raceType);

            const heldDayRecordList: HeldDayRecord[] = placeEntityList.map(
                (placeEntity) =>
                    HeldDayRecord.create(
                        placeEntity.id,
                        placeEntity.placeData.raceType,
                        placeEntity.heldDayData.heldTimes,
                        placeEntity.heldDayData.heldDayTimes,
                        placeEntity.updateDate,
                    ),
            );

            
            for (const heldDayRecordItem of heldDayRecordList) {
                
                const index = existFetchHeldDayRecordList.findIndex(
                    (record) => record.id === heldDayRecordItem.id,
                );
                if (index === -1) {
                    existFetchHeldDayRecordList.push(heldDayRecordItem);
                } else {
                    existFetchHeldDayRecordList[index] = heldDayRecordItem;
                }
            }

            
            existFetchHeldDayRecordList.sort(
                (a, b) => b.updateDate.getTime() - a.updateDate.getTime(),
            );

            await this.s3Gateway.uploadDataToS3(
                existFetchHeldDayRecordList,
                `${raceType.toLowerCase()}/`,
                this.heldDayFileName,
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
            this.placeFileName,
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

    
    @Logger
    private async getHeldDayRecordListFromS3(
        raceType: RaceType,
    ): Promise<HeldDayRecord[]> {
        
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.heldDayFileName,
        );

        
        if (!csv) {
            return [];
        }

        
        const lines = csv.split('\n');
        
        const headers = lines[0].split(',');

        
        const indices = {
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            raceType: headers.indexOf(CSV_HEADER_KEYS.RACE_TYPE),
            heldTimes: headers.indexOf(CSV_HEADER_KEYS.HELD_TIMES),
            heldDayTimes: headers.indexOf(CSV_HEADER_KEYS.HELD_DAY_TIMES),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        
        const heldDayRecordList: HeldDayRecord[] = lines
            .slice(1)
            .flatMap((line: string): HeldDayRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    if (columns[indices.raceType] !== raceType) {
                        return [];
                    }

                    return [
                        HeldDayRecord.create(
                            columns[indices.id],
                            raceType,
                            Number.parseInt(columns[indices.heldTimes], 10),
                            Number.parseInt(columns[indices.heldDayTimes], 10),
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error(error);
                    return [];
                }
            });
        return heldDayRecordList;
    }
}
