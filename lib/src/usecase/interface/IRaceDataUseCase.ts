import type { AutoraceRaceData } from '../../domain/autoraceRaceData';
import type { BoatraceRaceData } from '../../domain/boatraceRaceData';
import type { JraRaceData } from '../../domain/jraRaceData';
import type { KeirinRaceData } from '../../domain/keirinRaceData';
import type { NarRaceData } from '../../domain/narRaceData';
import type { WorldRaceData } from '../../domain/worldRaceData';
import type {
    AutoraceGradeType,
    BoatraceGradeType,
    JraGradeType,
    KeirinGradeType,
    NarGradeType,
    WorldGradeType,
} from '../../utility/data/common/gradeType';
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
                gradeList?: JraGradeType[];
                locationList?: RaceCourse[];
            };
            nar?: {
                gradeList?: NarGradeType[];
                locationList?: RaceCourse[];
            };
            world?: {
                gradeList?: WorldGradeType[];
                locationList?: RaceCourse[];
            };
            keirin?: {
                gradeList?: KeirinGradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
            autorace?: {
                gradeList?: AutoraceGradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
            boatrace?: {
                gradeList?: BoatraceGradeType[];
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
                gradeList?: KeirinGradeType[];
                locationList?: RaceCourse[];
            };
            autorace?: {
                gradeList?: AutoraceGradeType[];
                locationList?: RaceCourse[];
            };
            boatrace?: {
                gradeList?: BoatraceGradeType[];
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
