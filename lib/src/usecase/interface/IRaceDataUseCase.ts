import type { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import type { MechanicalRacingRaceEntity } from '../../repository/entity/mechanicalRacingRaceEntity';
import type { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import type { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import type { GradeType } from '../../utility/data/common/gradeType';
import type { RaceCourse } from '../../utility/data/common/raceCourse';
import type { RaceStage } from '../../utility/data/common/raceStage';
import type { RaceType } from '../../utility/raceType';

/**
 * レースデータUseCaseのインターフェース
 */
export interface IRaceDataUseCase {
    /**
     * レース開催データを取得する
     * @param startDate
     * @param finishDate
     * @param searchList
     */
    fetchRaceEntityList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        // Optional parameters
        searchList?: {
            jra?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            nar?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            world?: {
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
    ) => Promise<{
        jra: JraRaceEntity[];
        nar: NarRaceEntity[];
        world: WorldRaceEntity[];
        keirin: MechanicalRacingRaceEntity[];
        autorace: MechanicalRacingRaceEntity[];
        boatrace: MechanicalRacingRaceEntity[];
    }>;

    /**
     * レース開催データを更新する
     * @param startDate
     * @param finishDate
     * @param searchList
     */
    updateRaceEntityList: (
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
            world?: {
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
    ) => Promise<void>;

    // /**
    //  * レース開催データを更新する
    //  * @param raceDataList
    //  */
    // upsertRaceDataList: (raceDataList: {
    //     jra?: RaceData[];
    //     nar?: RaceData[];
    //     world?: RaceData[];
    //     keirin?: MechanicalRacingRaceData[];
    //     autorace?: MechanicalRacingRaceData[];
    //     boatrace?: MechanicalRacingRaceData[];
    // }) => Promise<void>;
}
