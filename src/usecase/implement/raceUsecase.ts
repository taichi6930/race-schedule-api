import { inject, injectable } from 'tsyringe';

import { DataLocation } from '../../../lib/src/utility/dataType';
import { GradeType } from '../../../lib/src/utility/validateAndType/gradeType';
import { RaceCourse } from '../../../lib/src/utility/validateAndType/raceCourse';
import { RaceStage } from '../../../lib/src/utility/validateAndType/raceStage';
import { SearchPlaceFilterEntity } from '../../repository/entity/filter/searchPlaceFilterEntity';
import { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import { RaceEntity } from '../../repository/entity/raceEntity';
import { IPlaceService } from '../../service/interface/IPlaceService';
import { IRaceService } from '../../service/interface/IRaceService';
import { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import {
    RACE_TYPE_LIST_ALL,
    RACE_TYPE_LIST_HORSE_RACING,
    RACE_TYPE_LIST_MECHANICAL_RACING,
    RaceType,
} from '../../utility/raceType';
import { IRaceUseCase } from '../interface/IRaceUsecase';

@injectable()
export class RaceUseCase implements IRaceUseCase {
    public constructor(
        @inject('PlaceService')
        private readonly placeService: IPlaceService,
        @inject('RaceService')
        private readonly raceService: IRaceService,
    ) {}

    @Logger
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        searchList?: {
            [RaceType.JRA]?: {
                gradeList?: GradeType[];
            };
            [RaceType.NAR]?: {
                gradeList?: GradeType[];
            };
            [RaceType.OVERSEAS]?: {
                gradeList?: GradeType[];
            };
            [RaceType.KEIRIN]?: {
                gradeList?: GradeType[];
                stageList?: RaceStage[];
            };
            [RaceType.AUTORACE]?: {
                gradeList?: GradeType[];
                stageList?: RaceStage[];
            };
            [RaceType.BOATRACE]?: {
                gradeList?: GradeType[];
                stageList?: RaceStage[];
            };
        },
    ): Promise<RaceEntity[]> {
        const raceEntityList = await this.raceService.fetchRaceEntityList(
            commonParameter,
            searchRaceFilter,
            DataLocation.Storage,
        );
        // 共通フィルタ関数で簡潔に
        const filteredRaceEntityList = RACE_TYPE_LIST_ALL.flatMap(
            (raceType) => {
                return raceEntityList.filter((raceEntity) => {
                    const searchFilter = searchList?.[raceType];
                    // const hasStageSupport =
                    //     raceType === RaceType.KEIRIN ||
                    //     raceType === RaceType.AUTORACE ||
                    //     raceType === RaceType.BOATRACE;

                    return (
                        raceEntity.raceData.raceType === raceType &&
                        (!searchFilter ||
                            searchFilter.gradeList?.length === 0 ||
                            searchFilter.gradeList?.includes(
                                raceEntity.raceData.grade,
                            ))
                        //    &&(!hasStageSupport ||
                        //         !searchFilter ||
                        //         !('stageList' in searchFilter) ||
                        //         searchFilter.stageList?.length === 0 ||
                        //         raceEntity.stage === undefined ||
                        //         searchFilter.stageList?.includes(raceEntity.stage))
                    );
                });
            },
        );
        return filteredRaceEntityList;
    }

    @Logger
    public async upsertRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        searchList?: {
            [RaceType.KEIRIN]?: {
                gradeList?: GradeType[];
            };
            [RaceType.AUTORACE]?: {
                gradeList?: GradeType[];
            };
            [RaceType.BOATRACE]?: {
                gradeList?: GradeType[];
            };
        },
    ): Promise<void> {
        // フィルタリング処理
        const placeEntityList = await this.placeService.fetchPlaceEntityList(
            commonParameter,
            new SearchPlaceFilterEntity(
                searchRaceFilter.startDate,
                searchRaceFilter.finishDate,
                searchRaceFilter.raceTypeList,
                [],
            ),
            DataLocation.Storage,
        );
        const filteredPlaceEntityList = [
            ...RACE_TYPE_LIST_HORSE_RACING.flatMap((raceType) =>
                placeEntityList.filter(
                    (item) => item.placeData.raceType === raceType,
                ),
            ),
            ...RACE_TYPE_LIST_MECHANICAL_RACING.flatMap((raceType) =>
                this.filterPlaceEntityList(
                    placeEntityList.filter(
                        (item) => item.placeData.raceType === raceType,
                    ),
                    searchList?.[raceType],
                ),
            ),
        ];
        const entityList: RaceEntity[] =
            await this.raceService.fetchRaceEntityList(
                commonParameter,
                searchRaceFilter,
                DataLocation.Web,
                filteredPlaceEntityList,
            );
        return this.raceService.upsertRaceEntityList(
            commonParameter,
            entityList,
        );
    }

    // 共通フィルタ関数
    private filterByGrade<
        T extends { raceData?: { grade?: GradeType }; grade?: GradeType },
    >(list: T[], gradeList?: GradeType[]): T[] {
        if (!gradeList) return list;
        return list.filter((item) => {
            const grade = item.raceData?.grade ?? item.grade;
            return grade !== undefined && gradeList.includes(grade);
        });
    }

    private filterByLocation<
        T extends {
            raceData?: { location?: RaceCourse };
            placeData?: { location?: RaceCourse };
        },
    >(list: T[], locationList?: RaceCourse[]): T[] {
        if (!locationList) return list;
        return list.filter((item) => {
            const location =
                item.raceData?.location ?? item.placeData?.location;
            return location !== undefined && locationList.includes(location);
        });
    }

    private filterByStage<T extends { stage?: RaceStage }>(
        list: T[],
        stageList?: RaceStage[],
    ): T[] {
        if (!stageList) return list;
        return list.filter(
            (item) =>
                item.stage !== undefined && stageList.includes(item.stage),
        );
    }

    private filterPlaceEntityList<
        T extends { grade?: GradeType; placeData?: { location?: RaceCourse } },
    >(
        list: T[],
        filter: {
            gradeList?: GradeType[];
        } = {},
    ): T[] {
        const result = this.filterByGrade(list, filter.gradeList);
        return result;
    }
}
