import type { AutoraceRaceData } from '../../domain/autoraceRaceData';
import type { BoatraceRaceData } from '../../domain/boatraceRaceData';
import type { JraRaceData } from '../../domain/jraRaceData';
import type { KeirinRaceData } from '../../domain/keirinRaceData';
import type { NarRaceData } from '../../domain/narRaceData';
import type { WorldRaceData } from '../../domain/worldRaceData';
import type { AutoraceGradeType } from '../../utility/data/autorace/autoraceGradeType';
import type { AutoraceRaceCourse } from '../../utility/data/autorace/autoraceRaceCourse';
import type { AutoraceRaceStage } from '../../utility/data/autorace/autoraceRaceStage';
import type { BoatraceGradeType } from '../../utility/data/boatrace/boatraceGradeType';
import type { BoatraceRaceCourse } from '../../utility/data/boatrace/boatraceRaceCourse';
import type { BoatraceRaceStage } from '../../utility/data/boatrace/boatraceRaceStage';
import type { KeirinRaceCourse } from '../../utility/data/common/raceCourse';
import type { JraRaceCourse } from '../../utility/data/common/raceCourse';
import type { JraGradeType } from '../../utility/data/jra/jraGradeType';
import type { KeirinGradeType } from '../../utility/data/keirin/keirinGradeType';
import type { KeirinRaceStage } from '../../utility/data/keirin/keirinRaceStage';
import type { NarGradeType } from '../../utility/data/nar/narGradeType';
import type { NarRaceCourse } from '../../utility/data/nar/narRaceCourse';
import type { WorldGradeType } from '../../utility/data/world/worldGradeType';
import type { WorldRaceCourse } from '../../utility/data/world/worldRaceCourse';

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
                stageList?: KeirinRaceStage[];
            };
            autorace?: {
                gradeList?: AutoraceGradeType[];
                locationList?: AutoraceRaceCourse[];
                stageList?: AutoraceRaceStage[];
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
