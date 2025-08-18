import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../domain/placeData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { PlaceGradeRecord } from '../../gateway/record/placeGradeRecord';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';


@injectable()
export class MechanicalRacingPlaceRepositoryFromStorageImpl
    implements IPlaceRepository<MechanicalRacingPlaceEntity>
{
    
    private readonly placeFileName = CSV_FILE_NAME.PLACE_LIST;
    private readonly placeGradeFileName = CSV_FILE_NAME.GRADE_LIST;

    public constructor(
        @inject('S3Gateway')
        private readonly s3Gateway: IS3Gateway,
    ) {}

    
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<MechanicalRacingPlaceEntity[]> {
        
        const placeRecordList: PlaceRecord[] =
            await this.getPlaceRecordListFromS3(searchFilter.raceType);

        const placeGradeRecordList: PlaceGradeRecord[] =
            await this.getPlaceGradeRecordListFromS3(searchFilter.raceType);

        
        const recordMap = new Map<
            string,
            {
                placeRecord: PlaceRecord;
                placeGradeRecord: PlaceGradeRecord;
            }
        >();

        
        for (const placeRecord of placeRecordList.filter(
            (_placeRecord) =>
                _placeRecord.dateTime >= searchFilter.startDate &&
                _placeRecord.dateTime <= searchFilter.finishDate,
        )) {
            const placeGradeRecordItem = placeGradeRecordList.find(
                (record) => record.id === placeRecord.id,
            );
            if (!placeGradeRecordItem) {
                
                continue;
            }
            recordMap.set(placeRecord.id, {
                placeRecord,
                placeGradeRecord: placeGradeRecordItem,
            });
        }

        
        const placeEntityList: MechanicalRacingPlaceEntity[] = [
            ...recordMap.values(),
        ].map(({ placeRecord, placeGradeRecord }) => {
            return MechanicalRacingPlaceEntity.create(
                placeRecord.id,
                PlaceData.create(
                    searchFilter.raceType,
                    placeRecord.dateTime,
                    placeRecord.location,
                ),
                placeGradeRecord.grade,
                
                new Date(
                    Math.min(
                        placeRecord.updateDate.getTime(),
                        placeGradeRecord.updateDate.getTime(),
                    ),
                ),
            );
        });
        return placeEntityList;
    }

    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: MechanicalRacingPlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: MechanicalRacingPlaceEntity[];
        failureData: MechanicalRacingPlaceEntity[];
    }> {
        try {
            
            const existFetchPlaceRecordList: PlaceRecord[] =
                await this.getPlaceRecordListFromS3(raceType);

            
            const placeRecordList: PlaceRecord[] = placeEntityList.map(
                (placeEntity) =>
                    PlaceRecord.create(
                        placeEntity.id,
                        placeEntity.placeData.raceType,
                        placeEntity.placeData.dateTime,
                        placeEntity.placeData.location,
                        placeEntity.updateDate,
                    ),
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

            
            const existFetchPlaceGradeRecordList: PlaceGradeRecord[] =
                await this.getPlaceGradeRecordListFromS3(raceType);

            
            const placeGradeRecordList: PlaceGradeRecord[] =
                placeEntityList.map((placeEntity) =>
                    PlaceGradeRecord.create(
                        placeEntity.id,
                        placeEntity.placeData.raceType,
                        placeEntity.grade,
                        placeEntity.updateDate,
                    ),
                );

            
            for (const placeGradeRecord of placeGradeRecordList) {
                
                const index = existFetchPlaceGradeRecordList.findIndex(
                    (record) => record.id === placeGradeRecord.id,
                );
                if (index === -1) {
                    existFetchPlaceGradeRecordList.push(placeGradeRecord);
                } else {
                    existFetchPlaceGradeRecordList[index] = placeGradeRecord;
                }
            }

            
            existFetchPlaceGradeRecordList.sort(
                (a, b) => b.updateDate.getTime() - a.updateDate.getTime(),
            );

            await this.s3Gateway.uploadDataToS3(
                existFetchPlaceGradeRecordList,
                `${raceType.toLowerCase()}/`,
                this.placeGradeFileName,
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
    private async getPlaceGradeRecordListFromS3(
        raceType: RaceType,
    ): Promise<PlaceGradeRecord[]> {
        
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.placeGradeFileName,
        );

        
        if (!csv) {
            return [];
        }

        
        const lines = csv.split('\n');
        console.log('lines:', lines);
        
        const headers = lines[0].split(',');

        
        const indices = {
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            raceType: headers.indexOf(CSV_HEADER_KEYS.RACE_TYPE),
            grade: headers.indexOf(CSV_HEADER_KEYS.GRADE),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        
        const placeGradeRecordList: PlaceGradeRecord[] = lines
            .slice(1)
            .flatMap((line: string): PlaceGradeRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    if (columns[indices.raceType] !== raceType) {
                        return [];
                    }

                    return [
                        PlaceGradeRecord.create(
                            columns[indices.id],
                            raceType,
                            columns[indices.grade],
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error(error);
                    return [];
                }
            });
        return placeGradeRecordList;
    }
}
