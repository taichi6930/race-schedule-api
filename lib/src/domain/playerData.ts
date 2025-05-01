import { validatePlayerNumber } from '../utility/data/playerNumber';

/**
 * 選手情報
 */
export class PlayerData {
    /**
     * コンストラクタ
     * @param playerNumber - 選手番号
     * @param name - 選手名
     * @param priority - 優先度
     */
    private constructor(
        public readonly playerNumber: number,
        public readonly name: string,
        public readonly priority: number,
    ) {}

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param playerNumber - 選手番号
     * @param name - 選手名
     * @param priority - 優先度
     */
    public static create(
        playerNumber: number,
        name: string,
        priority: number,
    ): PlayerData {
        return new PlayerData(
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
            partial.playerNumber ?? this.playerNumber,
            partial.name ?? this.name,
            partial.priority ?? this.priority,
        );
    }
}
