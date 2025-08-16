import { inject, injectable } from 'tsyringe';

import { HorseRacingRaceEntity } from '../../repository/entity/horseRacingRaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { MechanicalRacingRaceEntity } from '../../repository/entity/mechanicalRacingRaceEntity';
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
     * @param searchList.jra
     * @param searchList.jra.gradeList
     * @param searchList.jra.locationList
     * @param searchList.nar
     * @param searchList.nar.gradeList
     * @param searchList.nar.locationList
     * @param searchList.overseas
     * @param searchList.overseas.gradeList
     * @param searchList.overseas.locationList
     * @param searchList.keirin
     * @param searchList.keirin.gradeList
     * @param searchList.keirin.locationList
     * @param searchList.keirin.stageList
     * @param searchList.autorace
     * @param searchList.autorace.gradeList
     * @param searchList.autorace.locationList
     * @param searchList.autorace.stageList
     * @param searchList.boatrace
     * @param searchList.boatrace.gradeList
     * @param searchList.boatrace.locationList
     * @param searchList.boatrace.stageList
     */
    @Logger
    public async fetchRaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        searchList?: {
            jra?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            nar?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            overseas?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            keirin?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
            autorace?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
            boatrace?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
        },
    ): Promise<{
        jra: JraRaceEntity[];
        nar: HorseRacingRaceEntity[];
        overseas: HorseRacingRaceEntity[];
        keirin: MechanicalRacingRaceEntity[];
        autorace: MechanicalRacingRaceEntity[];
        boatrace: MechanicalRacingRaceEntity[];
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
            placeEntityList,
        );

        // 共通フィルタ関数で簡潔に
        return {
            jra: this.filterRaceEntityList(raceEntityList.jra, searchList?.jra),
            nar: this.filterRaceEntityList(raceEntityList.nar, searchList?.nar),
            overseas: this.filterRaceEntityList(
                raceEntityList.overseas,
                searchList?.overseas,
            ),
            keirin: this.filterRaceEntityList(
                raceEntityList.keirin,
                searchList?.keirin,
            ),
            autorace: this.filterRaceEntityList(
                raceEntityList.autorace,
                searchList?.autorace,
            ),
            boatrace: this.filterRaceEntityList(
                raceEntityList.boatrace,
                searchList?.boatrace,
            ),
        };
    }

    /**
     * レース開催データを更新する
     * @param startDate
     * @param finishDate
     * @param raceTypeList - レース種別のリスト
     * @param searchList
     * @param searchList.jra
     * @param searchList.jra.locationList
     * @param searchList.nar
     * @param searchList.nar.locationList
     * @param searchList.overseas
     * @param searchList.overseas.locationList
     * @param searchList.keirin
     * @param searchList.keirin.gradeList
     * @param searchList.keirin.locationList
     * @param searchList.autorace
     * @param searchList.autorace.gradeList
     * @param searchList.autorace.locationList
     * @param searchList.boatrace
     * @param searchList.boatrace.gradeList
     * @param searchList.boatrace.locationList
     */
    @Logger
    public async updateRaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        searchList?: {
            jra?: {
                locationList?: RaceCourse[];
            };
            nar?: {
                locationList?: RaceCourse[];
            };
            overseas?: {
                locationList?: RaceCourse[];
            };
            keirin?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            autorace?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            boatrace?: {
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
            jra: this.filterPlaceEntityList(
                placeEntityList.jra,
                searchList?.jra,
            ),
            nar: this.filterPlaceEntityList(
                placeEntityList.nar,
                searchList?.nar,
            ),
            keirin: this.filterPlaceEntityList(
                placeEntityList.keirin,
                searchList?.keirin,
            ),
            autorace: this.filterPlaceEntityList(
                placeEntityList.autorace,
                searchList?.autorace,
            ),
            boatrace: this.filterPlaceEntityList(
                placeEntityList.boatrace,
                searchList?.boatrace,
            ),
        };

        // placeEntityListが空の場合は処理を終了する
        if (
            !raceTypeList.includes(RaceType.OVERSEAS) &&
            filteredPlaceEntityList.jra.length === 0 &&
            filteredPlaceEntityList.nar.length === 0 &&
            filteredPlaceEntityList.keirin.length === 0 &&
            filteredPlaceEntityList.autorace.length === 0 &&
            filteredPlaceEntityList.boatrace.length === 0
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
                jra: filteredPlaceEntityList.jra,
                nar: filteredPlaceEntityList.nar,
                keirin: filteredPlaceEntityList.keirin,
                autorace: filteredPlaceEntityList.autorace,
                boatrace: filteredPlaceEntityList.boatrace,
            },
        );

        await this.raceDataService.updateRaceEntityList({
            jra: raceEntityList.jra,
            nar: raceEntityList.nar,
            overseas: raceEntityList.overseas,
            keirin: raceEntityList.keirin,
            autorace: raceEntityList.autorace,
            boatrace: raceEntityList.boatrace,
        });

        return {
            code: 200,
            message: 'レースデータの更新が完了しました。',
            successDataCount: Object.values(raceEntityList)
                .map((list) => list.length)
                .reduce((acc, cur) => acc + cur, 0),
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
