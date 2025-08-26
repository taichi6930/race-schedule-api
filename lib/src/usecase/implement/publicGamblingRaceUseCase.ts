import { inject, injectable } from 'tsyringe';

import { RaceEntity } from '../../repository/entity/raceEntity';
import { IPlaceService } from '../../service/interface/IPlaceService';
import { IRaceService } from '../../service/interface/IRaceService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import {
    RACE_TYPE_LIST_ALL,
    RACE_TYPE_LIST_WITHOUT_OVERSEAS,
    RaceType,
} from '../../utility/raceType';
import { GradeType } from '../../utility/validateAndType/gradeType';
import { RaceCourse } from '../../utility/validateAndType/raceCourse';
import { RaceStage } from '../../utility/validateAndType/raceStage';
import { IRaceUseCase } from '../interface/IRaceUseCase';

/**
 * 公営競技のレースデータUseCase
 */
@injectable()
export class PublicGamblingRaceUseCase implements IRaceUseCase {
    public constructor(
        @inject('PublicGamblingPlaceService')
        private readonly placeService: IPlaceService,
        @inject('PublicGamblingRaceService')
        private readonly raceDataService: IRaceService,
    ) {}

    /**
     * レース開催データを取得する
     * @param startDate
     * @param finishDate
     * @param raceTypeList - レース種別のリスト
     * @param searchList
     * @param searchList.gradeList
     * @param searchList.locationList
     * @param searchList.stageList
     */
    @Logger
    public async fetchRaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
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
        const placeEntityList = await this.placeService.fetchPlaceEntityList(
            startDate,
            finishDate,
            raceTypeList,
            DataLocation.Storage,
        );

        const raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            raceTypeList,
            DataLocation.Storage,
            placeEntityList,
        );

        // 共通フィルタ関数で簡潔に
        return RACE_TYPE_LIST_ALL.flatMap((raceType) =>
            this.filterRaceEntityList(
                raceEntityList.filter(
                    (raceEntity) => raceEntity.raceData.raceType === raceType,
                ),
                searchList?.[raceType],
            ),
        );
    }

    /**
     * レース開催データを更新する
     * @param startDate
     * @param finishDate
     * @param raceTypeList - レース種別のリスト
     * @param searchList
     * @param searchList.locationList
     * @param searchList.gradeList
     */
    @Logger
    public async updateRaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
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
    ): Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }> {
        // フィルタリング処理
        const placeEntityList = await this.placeService.fetchPlaceEntityList(
            startDate,
            finishDate,
            raceTypeList,
            DataLocation.Storage,
        );

        const filteredPlaceEntityList = RACE_TYPE_LIST_WITHOUT_OVERSEAS.flatMap(
            (raceType) =>
                this.filterPlaceEntityList(
                    placeEntityList.filter(
                        (item) => item.placeData.raceType === raceType,
                    ),
                    searchList?.[raceType],
                ),
        );

        // placeEntityListが空の場合は処理を終了する
        if (
            !raceTypeList.includes(RaceType.OVERSEAS) &&
            filteredPlaceEntityList.length === 0
        ) {
            console.log(
                '指定された条件に合致する開催場所が存在しません。レースデータの更新をスキップします。',
            );
            return {
                code: 404,
                message: '指定された条件に合致する開催場所が存在しません。',
                successDataCount: 0,
                failureDataCount: 0,
            };
        }

        const raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            raceTypeList,
            DataLocation.Web,
            filteredPlaceEntityList,
        );

        return this.raceDataService.updateRaceEntityList(raceEntityList);
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

    private filterRaceEntityList<
        T extends {
            raceData?: { grade?: GradeType; location?: RaceCourse };
            stage?: RaceStage;
        },
    >(
        list: T[],
        filter: {
            gradeList?: GradeType[];
            locationList?: RaceCourse[];
            stageList?: RaceStage[];
        } = {},
    ): T[] {
        let result = this.filterByGrade(list, filter.gradeList);
        result = this.filterByLocation(result, filter.locationList);
        result = this.filterByStage(result, filter.stageList);
        return result;
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
