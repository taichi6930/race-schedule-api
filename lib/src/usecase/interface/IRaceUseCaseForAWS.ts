import type { RaceEntity } from '../../../../src/repository/entity/raceEntity';
import type { RaceType } from '../../../../src/utility/raceType';
import type { GradeType } from '../../../../src/utility/validateAndType/gradeType';
import type { RaceCourse } from '../../../../src/utility/validateAndType/raceCourse';
import type { RaceStage } from '../../../../src/utility/validateAndType/raceStage';

/**
 * レースデータUseCaseのインターフェース
 */
export interface IRaceUseCaseForAWS {
    /**
     * 指定期間・種別のレースデータを取得
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（含む）
     * @param raceTypeList - レース種別リスト
     * @param searchList - 検索用フィルタ（省略可）
     */
    fetchRaceEntityList: (
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        // Optional parameters
        searchList?: {
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
