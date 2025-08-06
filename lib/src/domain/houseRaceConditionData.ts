import type { RaceCourseType } from '../utility/data/common/raceCourseType';
import { validateRaceCourseType } from '../utility/data/common/raceCourseType';
import type { RaceDistance } from '../utility/data/common/raceDistance';
import { validateRaceDistance } from '../utility/data/common/raceDistance';

export class HorseRaceConditionData {
    /**
     * 馬場種別
     * @type {RaceCourseType}
     */
    public readonly surfaceType: RaceCourseType;
    /**
     * 距離
     * @type {RaceDistance}
     */
    public readonly distance: RaceDistance;

    /**
     * コンストラクタ
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @remarks
     * 馬場種別と距離を指定してレース条件データを生成する
     */
    private constructor(surfaceType: RaceCourseType, distance: RaceDistance) {
        this.surfaceType = surfaceType;
        this.distance = distance;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     */
    public static create(
        surfaceType: string,
        distance: number,
    ): HorseRaceConditionData {
        return new HorseRaceConditionData(
            validateRaceCourseType(surfaceType),
            validateRaceDistance(distance),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(
        partial: Partial<HorseRaceConditionData> = {},
    ): HorseRaceConditionData {
        return HorseRaceConditionData.create(
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
        );
    }
}
