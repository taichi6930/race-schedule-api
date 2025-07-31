import type { IRaceData } from '../../domain/iRaceData';
import type { GradeType, RaceCourse, RaceStage } from '../../utility/data/base';

/**
 * レースデータUseCaseのインターフェース
 */
export interface IOldRaceDataUseCase<
    R extends IRaceData<R>,
    G extends GradeType,
    C extends RaceCourse,
    S extends RaceStage | undefined,
> {
    /**
     * レース開催データを取得する
     * @param startDate
     * @param finishDate
     * @param searchList
     */
    fetchRaceDataList: (
        startDate: Date,
        finishDate: Date,
        // Optional parameters
        searchList?: { gradeList?: G[]; locationList?: C[]; stageList?: S[] },
    ) => Promise<R[]>;

    /**
     * レース開催データを更新する
     * @param startDate
     * @param finishDate
     * @param searchList
     */
    updateRaceEntityList: (
        startDate: Date,
        finishDate: Date,
        // Optional parameters
        searchList?: { gradeList?: G[]; locationList?: C[] },
    ) => Promise<void>;

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    upsertRaceDataList: (raceDataList: R[]) => Promise<void>;
}
