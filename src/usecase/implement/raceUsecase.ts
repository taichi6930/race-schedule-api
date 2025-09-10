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
    RACE_TYPE_LIST_WITHOUT_OVERSEAS,
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
                locationList?: RaceCourse[];
            };
            [RaceType.NAR]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            [RaceType.OVERSEAS]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            [RaceType.KEIRIN]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
            [RaceType.AUTORACE]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
            [RaceType.BOATRACE]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
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
                            )) &&
                        (!searchFilter ||
                            searchFilter.locationList?.length === 0 ||
                            searchFilter.locationList?.includes(
                                raceEntity.raceData.location,
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
            [RaceType.JRA]?: {
                locationList?: RaceCourse[];
            };
            [RaceType.NAR]?: {
                locationList?: RaceCourse[];
            };
            [RaceType.OVERSEAS]?: {
                locationList?: RaceCourse[];
            };
            [RaceType.KEIRIN]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            [RaceType.AUTORACE]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            [RaceType.BOATRACE]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
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
        console.log('フィルタリング前', placeEntityList.length);
        const filteredPlaceEntityList = RACE_TYPE_LIST_WITHOUT_OVERSEAS.flatMap(
            (raceType) =>
                this.filterPlaceEntityList(
                    placeEntityList.filter(
                        (item) => item.placeData.raceType === raceType,
                    ),
                    searchList?.[raceType],
                ),
        );
        console.log('フィルタリング後', filteredPlaceEntityList.length);
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
            locationList?: RaceCourse[];
        } = {},
    ): T[] {
        let result = this.filterByGrade(list, filter.gradeList);
        result = this.filterByLocation(result, filter.locationList);
        return result;
    }
}
