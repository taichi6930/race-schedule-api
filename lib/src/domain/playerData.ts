import { validatePlayerNumber } from '../utility/data/common/playerNumber';
import type { RaceType } from '../utility/raceType';

/**
 * 選手情報
 */
export class PlayerData {
    /**
     * コンストラクタ
     * @param raceType - レース種別
     * @param playerNumber - 選手番号
     * @param name - 選手名
     * @param priority - 優先度
     */
    private constructor(
        public readonly raceType: RaceType,
        public readonly playerNumber: number,
        public readonly name: string,
        public readonly priority: number,
    ) {}

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param raceType - レース種別
     * @param playerNumber - 選手番号
     * @param name - 選手名
     * @param priority - 優先度
     */
    public static create(
        raceType: RaceType,
        playerNumber: number,
        name: string,
        priority: number,
    ): PlayerData {
        return new PlayerData(
            raceType,
            validatePlayerNumber(playerNumber),
            name,
            priority,
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいPlayerDataインスタンス
     */
    public copy(partial: Partial<PlayerData> = {}): PlayerData {
        return PlayerData.create(
            partial.raceType ?? this.raceType,
            partial.playerNumber ?? this.playerNumber,
            partial.name ?? this.name,
            partial.priority ?? this.priority,
        );
    }
}
