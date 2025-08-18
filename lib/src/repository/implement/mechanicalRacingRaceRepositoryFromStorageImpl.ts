import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { RaceData } from '../../domain/raceData';
import { RacePlayerData } from '../../domain/racePlayerData';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { MechanicalRacingRaceRecord } from '../../gateway/record/mechanicalRacingRaceRecord';
import { RacePlayerRecord } from '../../gateway/record/racePlayerRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { MechanicalRacingRaceEntity } from '../entity/mechanicalRacingRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';


@injectable()
export class MechanicalRacingRaceRepositoryFromStorageImpl
    implements
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
{
    private readonly raceListFileName = CSV_FILE_NAME.RACE_LIST;
    private readonly racePlayerListFileName = CSV_FILE_NAME.RACE_PLAYER_LIST;

    public constructor(
        @inject('S3Gateway')
        private readonly s3Gateway: IS3Gateway,
    ) {}

    
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<MechanicalRacingPlaceEntity>,
    ): Promise<MechanicalRacingRaceEntity[]> {
        
        const racePlayerRecordList: RacePlayerRecord[] =
            await this.getRacePlayerRecordListFromS3(searchFilter.raceType);

        
        const raceRaceRecordList: MechanicalRacingRaceRecord[] =
            await this.getRaceRecordListFromS3(
                searchFilter.raceType,
                searchFilter.startDate,
            );

        
        const raceEntityList: MechanicalRacingRaceEntity[] =
            raceRaceRecordList.map((raceRecord) => {
                
                const filteredRacePlayerRecordList: RacePlayerRecord[] =
                    racePlayerRecordList.filter((racePlayerRecord) => {
                        return racePlayerRecord.raceId === raceRecord.id;
                    });
                
                const racePlayerDataList: RacePlayerData[] =
                    filteredRacePlayerRecordList.map((racePlayerRecord) => {
                        return RacePlayerData.create(
                            searchFilter.raceType,
                            racePlayerRecord.positionNumber,
                            racePlayerRecord.playerNumber,
                        );
                    });
                
                const raceData = RaceData.create(
                    searchFilter.raceType,
                    raceRecord.name,
                    raceRecord.dateTime,
                    raceRecord.location,
                    raceRecord.grade,
                    raceRecord.number,
                );
                return MechanicalRacingRaceEntity.create(
                    raceRecord.id,
                    raceData,
                    raceRecord.stage,
                    racePlayerDataList,
                    raceRecord.updateDate,
                );
            });
        
        const filteredRaceEntityList: MechanicalRacingRaceEntity[] =
            raceEntityList.filter(
                (raceEntity) =>
                    raceEntity.raceData.dateTime >= searchFilter.startDate &&
                    raceEntity.raceData.dateTime <= searchFilter.finishDate,
            );

        return filteredRaceEntityList;
    }

    
    @Logger
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: MechanicalRacingRaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: MechanicalRacingRaceEntity[];
        failureData: MechanicalRacingRaceEntity[];
    }> {
        try {
            
            const existFetchRaceRecordList: MechanicalRacingRaceRecord[] =
                await this.getRaceRecordListFromS3(raceType);

            const existFetchRacePlayerRecordList: RacePlayerRecord[] =
                await this.getRacePlayerRecordListFromS3(raceType);

            
            const raceRecordList: MechanicalRacingRaceRecord[] =
                raceEntityList.map((raceEntity) => raceEntity.toRaceRecord());

            
            const racePlayerRecordList = raceEntityList.flatMap((raceEntity) =>
                raceEntity.toPlayerRecordList(),
            );

            
            for (const raceRecord of raceRecordList) {
                
                const index = existFetchRaceRecordList.findIndex(
                    (record) => record.id === raceRecord.id,
                );
                if (index === -1) {
                    existFetchRaceRecordList.push(raceRecord);
                } else {
                    existFetchRaceRecordList[index] = raceRecord;
                }
            }

            
            for (const racePlayerRecord of racePlayerRecordList) {
                
                const index = existFetchRacePlayerRecordList.findIndex(
                    (record) => record.id === racePlayerRecord.id,
                );
                if (index === -1) {
                    existFetchRacePlayerRecordList.push(racePlayerRecord);
                } else {
                    existFetchRacePlayerRecordList[index] = racePlayerRecord;
                }
            }

            
            existFetchRaceRecordList.sort(
                (a, b) => b.dateTime.getTime() - a.dateTime.getTime(),
            );

            
            await this.s3Gateway.uploadDataToS3(
                existFetchRaceRecordList,
                `${raceType.toLowerCase()}/`,
                this.raceListFileName,
            );
            await this.s3Gateway.uploadDataToS3(
                existFetchRacePlayerRecordList,
                `${raceType.toLowerCase()}/`,
                this.racePlayerListFileName,
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

    
    @Logger
    private async getRaceRecordListFromS3(
        raceType: RaceType,
        borderDate?: Date,
    ): Promise<MechanicalRacingRaceRecord[]> {
        
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.raceListFileName,
        );
        
        if (!csv) {
            return [];
        }

        
        const lines = csv.split('\n');

        
        const headers = lines[0].split(',');

        
        const indices = {
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            name: headers.indexOf(CSV_HEADER_KEYS.NAME),
            stage: headers.indexOf(CSV_HEADER_KEYS.STAGE),
            dateTime: headers.indexOf(CSV_HEADER_KEYS.DATE_TIME),
            location: headers.indexOf(CSV_HEADER_KEYS.LOCATION),
            grade: headers.indexOf(CSV_HEADER_KEYS.GRADE),
            number: headers.indexOf(CSV_HEADER_KEYS.NUMBER),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        
        const result: MechanicalRacingRaceRecord[] = [];
        for (const line of lines.slice(1)) {
            try {
                const columns = line.split(',');
                const dateTime = new Date(columns[indices.dateTime]);
                if (borderDate && borderDate > dateTime) {
                    console.log(
                        'borderDateより前のデータはスキップします',
                        dateTime,
                    );
                    break;
                }
                const updateDate = columns[indices.updateDate]
                    ? new Date(columns[indices.updateDate])
                    : getJSTDate(new Date());

                result.push(
                    MechanicalRacingRaceRecord.create(
                        columns[indices.id],
                        raceType,
                        columns[indices.name],
                        columns[indices.stage],
                        dateTime,
                        columns[indices.location],
                        columns[indices.grade],
                        Number.parseInt(columns[indices.number]),
                        updateDate,
                    ),
                );
            } catch (error) {
                console.error('RaceRecord create error', error);
                
            }
        }
        return result;
    }

    
    @Logger
    private async getRacePlayerRecordListFromS3(
        raceType: RaceType,
    ): Promise<RacePlayerRecord[]> {
        
        const csv = await this.s3Gateway.fetchDataFromS3(
            `${raceType.toLowerCase()}/`,
            this.racePlayerListFileName,
        );

        
        if (!csv) {
            return [];
        }

        
        const lines = csv.split('\n');

        
        const headers = lines[0].split(',');

        const indices = {
            id: headers.indexOf(CSV_HEADER_KEYS.ID),
            raceId: headers.indexOf(CSV_HEADER_KEYS.RACE_ID),
            positionNumber: headers.indexOf(CSV_HEADER_KEYS.POSITION_NUMBER),
            playerNumber: headers.indexOf(CSV_HEADER_KEYS.PLAYER_NUMBER),
            updateDate: headers.indexOf(CSV_HEADER_KEYS.UPDATE_DATE),
        };

        
        const keirinRacePlayerRecordList: RacePlayerRecord[] = lines
            .slice(1)
            .flatMap((line: string): RacePlayerRecord[] => {
                try {
                    const columns = line.split(',');

                    const updateDate = columns[indices.updateDate]
                        ? new Date(columns[indices.updateDate])
                        : getJSTDate(new Date());

                    return [
                        RacePlayerRecord.create(
                            columns[indices.id],
                            raceType,
                            columns[indices.raceId],
                            Number.parseInt(columns[indices.positionNumber]),
                            Number.parseInt(columns[indices.playerNumber]),
                            updateDate,
                        ),
                    ];
                } catch (error) {
                    console.error('RacePlayerRecord create error', error);
                    return [];
                }
            });
        return keirinRacePlayerRecordList;
    }
}
