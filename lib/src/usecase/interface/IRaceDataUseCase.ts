import type { AutoraceRaceData } from '../../domain/autoraceRaceData';
import type { BoatraceRaceData } from '../../domain/boatraceRaceData';
import type { JraRaceData } from '../../domain/jraRaceData';
import type { KeirinRaceData } from '../../domain/keirinRaceData';
import type { NarRaceData } from '../../domain/narRaceData';
import type { WorldRaceData } from '../../domain/worldRaceData';
import type { GradeType } from '../../utility/data/common/gradeType';
import type { RaceCourse } from '../../utility/data/common/raceCourse';
import type { RaceStage } from '../../utility/data/common/raceStage';

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
    fetchRaceDataList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: string[],
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
        jra: JraRaceData[];
        nar: NarRaceData[];
        world: WorldRaceData[];
        keirin: KeirinRaceData[];
        autorace: AutoraceRaceData[];
        boatrace: BoatraceRaceData[];
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
        raceTypeList: string[],
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

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    upsertRaceDataList: (raceDataList: {
        jra?: JraRaceData[];
        nar?: NarRaceData[];
        world?: WorldRaceData[];
        keirin?: KeirinRaceData[];
        autorace?: AutoraceRaceData[];
        boatrace?: BoatraceRaceData[];
    }) => Promise<void>;
}
