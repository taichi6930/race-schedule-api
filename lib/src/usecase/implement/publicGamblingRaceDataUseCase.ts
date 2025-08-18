import { inject, injectable } from 'tsyringe';

import { RaceEntity } from '../../repository/entity/raceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { GradeType } from '../../utility/data/common/gradeType';
import { RaceCourse } from '../../utility/data/common/raceCourse';
import { RaceStage } from '../../utility/data/common/raceStage';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 公営競技レース開催データユースケース
 */
@injectable()
export class PublicGamblingRaceDataUseCase implements IRaceDataUseCase {
    public constructor(
        @inject('PublicGamblingPlaceDataService')
        private readonly placeDataService: IPlaceDataService,
        @inject('PublicGamblingRaceDataService')
        private readonly raceDataService: IRaceDataService,
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
    ): Promise<{
        [RaceType.JRA]: RaceEntity[];
        [RaceType.NAR]: RaceEntity[];
        [RaceType.OVERSEAS]: RaceEntity[];
        [RaceType.KEIRIN]: RaceEntity[];
        [RaceType.AUTORACE]: RaceEntity[];
        [RaceType.BOATRACE]: RaceEntity[];
    }> {
        const placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
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
            {
                [RaceType.JRA]: placeEntityList.filter(
                    (placeEntity) =>
                        placeEntity.placeData.raceType === RaceType.JRA,
                ),
                [RaceType.NAR]: placeEntityList.filter(
                    (placeEntity) =>
                        placeEntity.placeData.raceType === RaceType.NAR,
                ),
                [RaceType.OVERSEAS]: placeEntityList.filter(
                    (placeEntity) =>
                        placeEntity.placeData.raceType === RaceType.OVERSEAS,
                ),
                [RaceType.KEIRIN]: placeEntityList.filter(
                    (placeEntity) =>
                        placeEntity.placeData.raceType === RaceType.KEIRIN,
                ),
                [RaceType.AUTORACE]: placeEntityList.filter(
                    (placeEntity) =>
                        placeEntity.placeData.raceType === RaceType.AUTORACE,
                ),
                [RaceType.BOATRACE]: placeEntityList.filter(
                    (placeEntity) =>
                        placeEntity.placeData.raceType === RaceType.BOATRACE,
                ),
            },
        );

        // 共通フィルタ関数で簡潔に
        return {
            [RaceType.JRA]: this.filterRaceEntityList(
                raceEntityList.filter(
                    (raceEntity) =>
                        raceEntity.raceData.raceType === RaceType.JRA,
                ),
                searchList?.[RaceType.JRA],
            ),
            [RaceType.NAR]: this.filterRaceEntityList(
                raceEntityList.filter(
                    (raceEntity) =>
                        raceEntity.raceData.raceType === RaceType.NAR,
                ),
                searchList?.[RaceType.NAR],
            ),
            [RaceType.OVERSEAS]: this.filterRaceEntityList(
                raceEntityList.filter(
                    (raceEntity) =>
                        raceEntity.raceData.raceType === RaceType.OVERSEAS,
                ),
                searchList?.[RaceType.OVERSEAS],
            ),
            [RaceType.KEIRIN]: this.filterRaceEntityList(
                raceEntityList.filter(
                    (raceEntity) =>
                        raceEntity.raceData.raceType === RaceType.KEIRIN,
                ),
                searchList?.[RaceType.KEIRIN],
            ),
            [RaceType.AUTORACE]: this.filterRaceEntityList(
                raceEntityList.filter(
                    (raceEntity) =>
                        raceEntity.raceData.raceType === RaceType.AUTORACE,
                ),
                searchList?.[RaceType.AUTORACE],
            ),
            [RaceType.BOATRACE]: this.filterRaceEntityList(
                raceEntityList.filter(
                    (raceEntity) =>
                        raceEntity.raceData.raceType === RaceType.BOATRACE,
                ),
                searchList?.[RaceType.BOATRACE],
            ),
        };
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
        const placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                raceTypeList,
                DataLocation.Storage,
            );

        const filteredPlaceEntityList = {
            [RaceType.JRA]: this.filterPlaceEntityList(
                placeEntityList.filter(
                    (item) => item.placeData.raceType === RaceType.JRA,
                ),
                searchList?.[RaceType.JRA],
            ),
            [RaceType.NAR]: this.filterPlaceEntityList(
                placeEntityList.filter(
                    (item) => item.placeData.raceType === RaceType.NAR,
                ),
                searchList?.[RaceType.NAR],
            ),
            [RaceType.KEIRIN]: this.filterPlaceEntityList(
                placeEntityList.filter(
                    (item) => item.placeData.raceType === RaceType.KEIRIN,
                ),
                searchList?.[RaceType.KEIRIN],
            ),
            [RaceType.AUTORACE]: this.filterPlaceEntityList(
                placeEntityList.filter(
                    (item) => item.placeData.raceType === RaceType.AUTORACE,
                ),
                searchList?.[RaceType.AUTORACE],
            ),
            [RaceType.BOATRACE]: this.filterPlaceEntityList(
                placeEntityList.filter(
                    (item) => item.placeData.raceType === RaceType.BOATRACE,
                ),
                searchList?.[RaceType.BOATRACE],
            ),
        };

        // placeEntityListが空の場合は処理を終了する
        if (
            !raceTypeList.includes(RaceType.OVERSEAS) &&
            filteredPlaceEntityList[RaceType.JRA].length === 0 &&
            filteredPlaceEntityList[RaceType.NAR].length === 0 &&
            filteredPlaceEntityList[RaceType.KEIRIN].length === 0 &&
            filteredPlaceEntityList[RaceType.AUTORACE].length === 0 &&
            filteredPlaceEntityList[RaceType.BOATRACE].length === 0
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
            {
                [RaceType.JRA]: filteredPlaceEntityList[RaceType.JRA],
                [RaceType.NAR]: filteredPlaceEntityList[RaceType.NAR],
                [RaceType.KEIRIN]: filteredPlaceEntityList[RaceType.KEIRIN],
                [RaceType.AUTORACE]: filteredPlaceEntityList[RaceType.AUTORACE],
                [RaceType.BOATRACE]: filteredPlaceEntityList[RaceType.BOATRACE],
            },
        );

        await this.raceDataService.updateRaceEntityList(raceEntityList);

        return {
            code: 200,
            message: 'レースデータの更新が完了しました。',
            successDataCount: raceEntityList.length,
            failureDataCount: 0,
        };
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
