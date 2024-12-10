import type { RaceData } from '../../domain/baseData';
import type { GradeType, RaceCourse, RaceStage } from '../../utility/data/base';

/**
 * レースデータUseCaseのインターフェース
 */
export interface IRaceDataUseCase<
    R extends RaceData,
    G extends GradeType,
    C extends RaceCourse,
    S extends RaceStage,
> {
    /**
     * レースデータを取得する
     * @param startDate
     * @param finishDate
     */
    fetchRaceDataList: (
        startDate: Date,
        finishDate: Date,
        // Optional parameters
        searchList?: { gradeList?: G[]; locationList?: C[]; stageList?: S[] },
    ) => Promise<R[]>;

    /**
     * レースデータのリストを更新する
     * @param startDate
     * @param finishDate
     */
    updateRaceEntityList: (
        startDate: Date,
        finishDate: Date,
        // Optional parameters
        searchList?: { gradeList?: G[]; locationList?: C[] },
    ) => Promise<void>;

    /**
     * レースデータのリストを更新する
     * @param raceDataList
     */
    upsertRaceDataList: (raceDataList: R[]) => Promise<void>;
}
