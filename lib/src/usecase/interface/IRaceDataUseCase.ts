import type { AutoraceRaceData } from '../../domain/autoraceRaceData';
import type { BoatraceRaceData } from '../../domain/boatraceRaceData';
import type { JraRaceData } from '../../domain/jraRaceData';
import type { KeirinRaceData } from '../../domain/keirinRaceData';
import type { NarRaceData } from '../../domain/narRaceData';
import type { WorldRaceData } from '../../domain/worldRaceData';
import type { BoatraceRaceStage } from '../../utility/data/boatrace/boatraceRaceStage';
import type {
    AutoraceGradeType,
    BoatraceGradeType,
    JraGradeType,
    KeirinGradeType,
    NarGradeType,
    WorldGradeType,
} from '../../utility/data/common/gradeType';
import type {
    AutoraceRaceCourse,
    BoatraceRaceCourse,
    JraRaceCourse,
    KeirinRaceCourse,
    NarRaceCourse,
    WorldRaceCourse,
} from '../../utility/data/common/raceCourse';
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
                gradeList?: JraGradeType[];
                locationList?: JraRaceCourse[];
            };
            nar?: {
                gradeList?: NarGradeType[];
                locationList?: NarRaceCourse[];
            };
            world?: {
                gradeList?: WorldGradeType[];
                locationList?: WorldRaceCourse[];
            };
            keirin?: {
                gradeList?: KeirinGradeType[];
                locationList?: KeirinRaceCourse[];
                stageList?: RaceStage[];
            };
            autorace?: {
                gradeList?: AutoraceGradeType[];
                locationList?: AutoraceRaceCourse[];
                stageList?: RaceStage[];
            };
            boatrace?: {
                gradeList?: BoatraceGradeType[];
                locationList?: BoatraceRaceCourse[];
                stageList?: BoatraceRaceStage[];
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
                locationList?: JraRaceCourse[];
            };
            nar?: {
                locationList?: NarRaceCourse[];
            };
            world?: {
                locationList?: WorldRaceCourse[];
            };
            keirin?: {
                gradeList?: KeirinGradeType[];
                locationList?: KeirinRaceCourse[];
            };
            autorace?: {
                gradeList?: AutoraceGradeType[];
                locationList?: AutoraceRaceCourse[];
            };
            boatrace?: {
                gradeList?: BoatraceGradeType[];
                locationList?: BoatraceRaceCourse[];
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
