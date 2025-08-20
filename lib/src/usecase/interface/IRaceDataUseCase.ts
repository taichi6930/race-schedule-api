import type { RaceEntity } from '../../repository/entity/raceEntity';
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
    ) => Promise<RaceEntity[]>;

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
    ) => Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }>;
}
