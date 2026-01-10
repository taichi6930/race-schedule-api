import type { RaceDistance } from '../../packages/shared/src/types/raceDistance';
import { validateRaceDistance } from '../../packages/shared/src/types/raceDistance';
import type { RaceSurfaceType } from '../../packages/shared/src/types/surfaceType';
import { validateRaceSurfaceType } from '../../packages/shared/src/types/surfaceType';

export class HorseRaceConditionData {
    /**
     * コンストラクタ
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @remarks
     * 馬場種別と距離を指定してレース条件データを生成する
     */
    private constructor(
        public readonly surfaceType: RaceSurfaceType,
        public readonly distance: RaceDistance,
    ) {}

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
