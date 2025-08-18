import { inject, injectable } from 'tsyringe';

import { HorseRacingPlaceEntity } from '../../repository/entity/horseRacingPlaceEntity';
import { HorseRacingRaceEntity } from '../../repository/entity/horseRacingRaceEntity';
import { IPlaceEntity } from '../../repository/entity/iPlaceEntity';
import { IRaceEntity } from '../../repository/entity/iRaceEntity';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { MechanicalRacingPlaceEntity } from '../../repository/entity/mechanicalRacingPlaceEntity';
import { MechanicalRacingRaceEntity } from '../../repository/entity/mechanicalRacingRaceEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/searchRaceFilterEntity';
import { IRaceRepository } from '../../repository/interface/IRaceRepository';
import { DataLocation, DataLocationType } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IRaceDataService } from '../interface/IRaceDataService';


@injectable()
export class PublicGamblingRaceDataService implements IRaceDataService {
    public constructor(
        @inject('JraRaceRepositoryFromStorage')
        protected jraRaceRepositoryFromStorage: IRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
        >,
        @inject('JraRaceRepositoryFromHtml')
        protected jraRaceRepositoryFromHtml: IRaceRepository<
            JraRaceEntity,
            JraPlaceEntity
        >,
        @inject('NarRaceRepositoryFromHtml')
        protected narRaceRepositoryFromHtml: IRaceRepository<
            HorseRacingRaceEntity,
            HorseRacingPlaceEntity
        >,
        @inject('HorseRacingRaceRepositoryFromStorage')
        protected readonly horseRacingRaceRepositoryFromStorage: IRaceRepository<
            HorseRacingRaceEntity,
            HorseRacingPlaceEntity
        >,
        @inject('OverseasRaceRepositoryFromHtml')
        protected readonly overseasRaceRepositoryFromHtml: IRaceRepository<
            HorseRacingRaceEntity,
            HorseRacingPlaceEntity
        >,
        @inject('KeirinRaceRepositoryFromHtml')
        protected keirinRaceRepositoryFromHtml: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
        >,
        @inject('AutoraceRaceRepositoryFromHtml')
        protected autoraceRaceRepositoryFromHtml: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
        >,
        @inject('BoatraceRaceRepositoryFromHtml')
        protected boatraceRaceRepositoryFromHtml: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
        >,
        @inject('MechanicalRacingRaceRepositoryFromStorage')
        protected mechanicalRacingRaceRepositoryFromStorage: IRaceRepository<
            MechanicalRacingRaceEntity,
            MechanicalRacingPlaceEntity
        >,
    ) {}

    
    @Logger
    public async fetchRaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        type: DataLocationType,
        placeEntityList?: {
            [RaceType.JRA]?: JraPlaceEntity[];
            [RaceType.NAR]?: HorseRacingPlaceEntity[];
            [RaceType.OVERSEAS]?: HorseRacingPlaceEntity[];
            [RaceType.KEIRIN]?: MechanicalRacingPlaceEntity[];
            [RaceType.AUTORACE]?: MechanicalRacingPlaceEntity[];
            [RaceType.BOATRACE]?: MechanicalRacingPlaceEntity[];
        },
    ): Promise<{
        [RaceType.JRA]: JraRaceEntity[];
        [RaceType.NAR]: HorseRacingRaceEntity[];
        [RaceType.OVERSEAS]: HorseRacingRaceEntity[];
        [RaceType.KEIRIN]: MechanicalRacingRaceEntity[];
        [RaceType.AUTORACE]: MechanicalRacingRaceEntity[];
        [RaceType.BOATRACE]: MechanicalRacingRaceEntity[];
    }> {
        const result: {
            [RaceType.JRA]: JraRaceEntity[];
            [RaceType.NAR]: HorseRacingRaceEntity[];
            [RaceType.OVERSEAS]: HorseRacingRaceEntity[];
            [RaceType.KEIRIN]: MechanicalRacingRaceEntity[];
            [RaceType.AUTORACE]: MechanicalRacingRaceEntity[];
            [RaceType.BOATRACE]: MechanicalRacingRaceEntity[];
        } = {
            [RaceType.JRA]: [],
            [RaceType.NAR]: [],
            [RaceType.OVERSEAS]: [],
            [RaceType.KEIRIN]: [],
            [RaceType.AUTORACE]: [],
            [RaceType.BOATRACE]: [],
        };

        try {
            
            if (
                raceTypeList.includes(RaceType.JRA) ||
                placeEntityList?.[RaceType.JRA] !== undefined
            ) {
                const searchFilter = new SearchRaceFilterEntity<JraPlaceEntity>(
                    startDate,
                    finishDate,
                    RaceType.JRA,
                    placeEntityList?.[RaceType.JRA],
                );
                const repo =
                    type === DataLocation.Storage
                        ? this.jraRaceRepositoryFromStorage
                        : this.jraRaceRepositoryFromHtml;
                const jraRaceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result[RaceType.JRA].push(...jraRaceEntityList);
            }
            
            if (
                raceTypeList.includes(RaceType.NAR) ||
                placeEntityList?.[RaceType.NAR] !== undefined
            ) {
                const searchFilter =
                    new SearchRaceFilterEntity<HorseRacingPlaceEntity>(
                        startDate,
                        finishDate,
                        RaceType.NAR,
                        placeEntityList?.[RaceType.NAR]?.filter(
                            (place) =>
                                place.placeData.raceType === RaceType.NAR,
                        ),
                    );
                const repo =
                    type === DataLocation.Storage
                        ? this.horseRacingRaceRepositoryFromStorage
                        : this.narRaceRepositoryFromHtml;
                const narRaceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result[RaceType.NAR].push(...narRaceEntityList);
            }
            
            if (raceTypeList.includes(RaceType.OVERSEAS)) {
                const searchFilter =
                    new SearchRaceFilterEntity<HorseRacingPlaceEntity>(
                        startDate,
                        finishDate,
                        RaceType.OVERSEAS,
                    );
                const repo =
                    type === DataLocation.Storage
                        ? this.horseRacingRaceRepositoryFromStorage
                        : this.overseasRaceRepositoryFromHtml;
                const overseasRaceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result[RaceType.OVERSEAS].push(...overseasRaceEntityList);
            }
            
            if (
                raceTypeList.includes(RaceType.KEIRIN) ||
                placeEntityList?.[RaceType.KEIRIN] !== undefined
            ) {
                const searchFilter =
                    new SearchRaceFilterEntity<MechanicalRacingPlaceEntity>(
                        startDate,
                        finishDate,
                        RaceType.KEIRIN,
                        placeEntityList?.[RaceType.KEIRIN]?.filter(
                            (place) =>
                                place.placeData.raceType === RaceType.KEIRIN,
                        ),
                    );
                const repo =
                    type === DataLocation.Storage
                        ? this.mechanicalRacingRaceRepositoryFromStorage
                        : this.keirinRaceRepositoryFromHtml;
                const keirinRaceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result[RaceType.KEIRIN].push(...keirinRaceEntityList);
            }
            
            if (
                raceTypeList.includes(RaceType.AUTORACE) ||
                placeEntityList?.[RaceType.AUTORACE] !== undefined
            ) {
                const searchFilter =
                    new SearchRaceFilterEntity<MechanicalRacingPlaceEntity>(
                        startDate,
                        finishDate,
                        RaceType.AUTORACE,
                        placeEntityList?.[RaceType.AUTORACE]?.filter(
                            (place) =>
                                place.placeData.raceType === RaceType.AUTORACE,
                        ),
                    );
                const repo =
                    type === DataLocation.Storage
                        ? this.mechanicalRacingRaceRepositoryFromStorage
                        : this.autoraceRaceRepositoryFromHtml;
                const autoraceRaceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result[RaceType.AUTORACE].push(...autoraceRaceEntityList);
            }
            
            if (
                raceTypeList.includes(RaceType.BOATRACE) ||
                placeEntityList?.[RaceType.BOATRACE] !== undefined
            ) {
                const searchFilter =
                    new SearchRaceFilterEntity<MechanicalRacingPlaceEntity>(
                        startDate,
                        finishDate,
                        RaceType.BOATRACE,
                        placeEntityList?.[RaceType.BOATRACE]?.filter(
                            (place) =>
                                place.placeData.raceType === RaceType.BOATRACE,
                        ),
                    );
                const repo =
                    type === DataLocation.Storage
                        ? this.mechanicalRacingRaceRepositoryFromStorage
                        : this.boatraceRaceRepositoryFromHtml;
                const boatraceRaceEntityList = await this.fetchRaceEntities(
                    repo,
                    searchFilter,
                );
                result[RaceType.BOATRACE].push(...boatraceRaceEntityList);
            }

            return result;
        } catch (error) {
            console.error('開催場データの取得に失敗しました', error);
            return result;
        }
    }

    
    @Logger
    public async updateRaceEntityList(raceEntityList: {
        [RaceType.JRA]?: JraRaceEntity[];
        [RaceType.NAR]?: HorseRacingRaceEntity[];
        [RaceType.OVERSEAS]?: HorseRacingRaceEntity[];
        [RaceType.KEIRIN]?: MechanicalRacingRaceEntity[];
        [RaceType.AUTORACE]?: MechanicalRacingRaceEntity[];
        [RaceType.BOATRACE]?: MechanicalRacingRaceEntity[];
    }): Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }> {
        try {
            const response = await Promise.all([
                this.saveRaceEntities(
                    this.jraRaceRepositoryFromStorage,
                    RaceType.JRA,
                    raceEntityList[RaceType.JRA],
                ),
                this.saveRaceEntities(
                    this.horseRacingRaceRepositoryFromStorage,
                    RaceType.NAR,
                    raceEntityList[RaceType.NAR],
                ),
                this.saveRaceEntities(
                    this.horseRacingRaceRepositoryFromStorage,
                    RaceType.OVERSEAS,
                    raceEntityList[RaceType.OVERSEAS],
                ),
                this.saveRaceEntities(
                    this.mechanicalRacingRaceRepositoryFromStorage,
                    RaceType.KEIRIN,
                    raceEntityList[RaceType.KEIRIN],
                ),
                this.saveRaceEntities(
                    this.mechanicalRacingRaceRepositoryFromStorage,
                    RaceType.AUTORACE,
                    raceEntityList[RaceType.AUTORACE],
                ),
                this.saveRaceEntities(
                    this.mechanicalRacingRaceRepositoryFromStorage,
                    RaceType.BOATRACE,
                    raceEntityList[RaceType.BOATRACE],
                ),
            ]);
            return {
                
                code: response.every((res) => res.code === 200) ? 200 : 500,
                
                message: [...new Set(response.map((res) => res.message))].join(
                    ', ',
                ),
                successDataCount: response.reduce(
                    (acc, res) => acc + res.successDataCount,
                    0,
                ),
                failureDataCount: response.reduce(
                    (acc, res) => acc + res.failureDataCount,
                    0,
                ),
            };
        } catch (error) {
            console.error('開催場データの保存/更新に失敗しました', error);
            throw error;
        }
    }

    
    private async saveRaceEntities<
        TRace extends IRaceEntity<TRace>,
        TPlace extends IPlaceEntity<TPlace>,
    >(
        repo: IRaceRepository<TRace, TPlace>,
        raceType: RaceType,
        entities?: TRace[],
    ): Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }> {
        if (entities !== undefined && entities.length > 0) {
            const response = await repo.registerRaceEntityList(
                raceType,
                entities,
            );
            return {
                code: response.code,
                message: response.message,
                successDataCount: response.successData.length,
                failureDataCount: response.failureData.length,
            };
        }
        return {
            code: 200,
            message: 'No entities to save',
            successDataCount: 0,
            failureDataCount: 0,
        };
    }

    
    private async fetchRaceEntities<
        TPlace extends IPlaceEntity<TPlace>,
        TRace extends IRaceEntity<TRace>,
    >(
        repo: IRaceRepository<TRace, TPlace>,
        searchFilter: SearchRaceFilterEntity<TPlace>,
    ): Promise<TRace[]> {
        return repo.fetchRaceEntityList(searchFilter);
    }
}
