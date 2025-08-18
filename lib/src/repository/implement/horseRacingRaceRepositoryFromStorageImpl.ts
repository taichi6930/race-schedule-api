import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { HorseRacingRaceRecord } from '../../gateway/record/horseRacingRaceRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { HorseRacingPlaceEntity } from '../entity/horseRacingPlaceEntity';
import { HorseRacingRaceEntity } from '../entity/horseRacingRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

@injectable()
export class HorseRacingRaceRepositoryFromStorageImpl
    implements IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
{
    private readonly fileName = CSV_FILE_NAME.RACE_LIST;

    public constructor(
        @inject('S3Gateway')
        private readonly s3Gateway: IS3Gateway,
    ) {}

    
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<HorseRacingPlaceEntity>,
    ): Promise<HorseRacingRaceEntity[]> {
        
        const raceRecordList: HorseRacingRaceRecord[] =
            await this.getRaceRecordListFromS3(searchFilter.raceType);

        
        const raceEntityList: HorseRacingRaceEntity[] = raceRecordList.map(
            (raceRecord) => raceRecord.toEntity(),
        );

        
        const filteredRaceEntityList: HorseRacingRaceEntity[] =
            raceEntityList.filter(
                (raceEntity) =>
                    raceEntity.raceData.dateTime >= searchFilter.startDate &&
                    raceEntity.raceData.dateTime <= searchFilter.finishDate,
            );
        return filteredRaceEntityList;
    }

    
    @Logger
    private async getRaceRecordListFromS3(
        raceType: RaceType,
    ): Promise<HorseRacingRaceRecord[]> {
        
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.fileName,
        );

        
        if (!csv) {
            return [];
        }

        
        const lines = csv.split('\n');

        
        const headers = lines[0].split('\r').join('').split(',');

        
        const indices = {
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            name: headers.indexOf(CSV_HEADER_KEYS.NAME),
            dateTime: headers.indexOf(CSV_HEADER_KEYS.DATE_TIME),
            location: headers.indexOf(CSV_HEADER_KEYS.LOCATION),
            surfaceType: headers.indexOf(CSV_HEADER_KEYS.SURFACE_TYPE),
            distance: headers.indexOf(CSV_HEADER_KEYS.DISTANCE),
            grade: headers.indexOf(CSV_HEADER_KEYS.GRADE),
            number: headers.indexOf(CSV_HEADER_KEYS.NUMBER),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        console.log('データ行を100件ずつ分割');

        
        const chunkSize = 100;
        const chunks: string[][] = [];
        for (let i = 1; i < lines.length; i += chunkSize) {
            chunks.push(lines.slice(i, i + chunkSize));
        }

        
        const results = await Promise.all(
            chunks.map((chunk) =>
                chunk.flatMap((line: string): HorseRacingRaceRecord[] => {
                    try {
                        const columns = line.split('\r').join('').split(',');

                        const updateDate = columns[indices.updateDate]
                            ? new Date(columns[indices.updateDate])
                            : getJSTDate(new Date());

                        return [
                            HorseRacingRaceRecord.create(
                                columns[indices.id],
                                raceType,
                                columns[indices.name],
                                new Date(columns[indices.dateTime]),
                                columns[indices.location],
                                columns[indices.surfaceType],
                                Number.parseInt(columns[indices.distance]),
                                columns[indices.grade],
                                Number.parseInt(columns[indices.number]),
                                updateDate,
                            ),
                        ];
                    } catch (error) {
                        console.error(error);
                        return [];
                    }
                }),
            ),
        );
        
        const mergedResults = results.flat();
        return mergedResults;
    }

    
    @Logger
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: HorseRacingRaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: HorseRacingRaceEntity[];
        failureData: HorseRacingRaceEntity[];
    }> {
        try {
            
            const existFetchRaceRecordList: HorseRacingRaceRecord[] =
                await this.getRaceRecordListFromS3(raceType);

            
            const raceRecordList: HorseRacingRaceRecord[] = raceEntityList.map(
                (raceEntity) => raceEntity.toRaceRecord(),
            );

            
            const raceRecordMap = new Map<string, HorseRacingRaceRecord>(
                existFetchRaceRecordList.map((record) => [record.id, record]),
            );

            for (const raceRecord of raceRecordList) {
                raceRecordMap.set(raceRecord.id, raceRecord);
            }

            
            const updatedRaceRecordList = [...raceRecordMap.values()].sort(
                (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
            );

            
            await this.s3Gateway.uploadDataToS3(
                updatedRaceRecordList,
                `${raceType.toLowerCase()}/`,
                this.fileName,
            );

            return {
                code: 200,
                message: 'Successfully registered race data',
                successData: raceEntityList,
                failureData: [],
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Failed to register race data',
                successData: [],
                failureData: raceEntityList,
            };
        }
    }
}
