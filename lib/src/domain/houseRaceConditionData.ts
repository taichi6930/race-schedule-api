import type { RaceDistance } from '../utility/data/validateAndType/raceDistance';
import { validateRaceDistance } from '../utility/data/validateAndType/raceDistance';
import type { RaceSurfaceType } from '../utility/data/validateAndType/raceSurfaceType';
import { validateRaceSurfaceType } from '../utility/data/validateAndType/raceSurfaceType';

export class HorseRaceConditionData {
    /**
     * 馬場種別
     * @type {RaceSurfaceType}
     */
    public readonly surfaceType: RaceSurfaceType;

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
    private constructor(surfaceType: RaceSurfaceType, distance: RaceDistance) {
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
            validateRaceSurfaceType(surfaceType),
            validateRaceDistance(distance),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
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
