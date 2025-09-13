import { RaceType } from '../../../src/utility/raceType';
import { validatePlayerNumber } from '../../../src/utility/validateAndType/playerNumber';

/**
 * 選手情報
 */
export class PlayerDataForAWS {
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
    ): PlayerDataForAWS {
        try {
            if (
                raceType !== RaceType.KEIRIN &&
                raceType !== RaceType.AUTORACE &&
                raceType !== RaceType.BOATRACE
            ) {
                throw new Error(
                    `PlayerDataはKEIRIN, AUTORACE, BOATRACEのみ対応`,
                );
            }

            return new PlayerDataForAWS(
                raceType,
                validatePlayerNumber(playerNumber),
                name,
                priority,
            );
        } catch (error) {
            console.error(error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            throw new Error(`PlayerDataの生成に失敗しました: ${errorMessage}`);
        }
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいPlayerDataインスタンス
     */
    public copy(partial: Partial<PlayerDataForAWS> = {}): PlayerDataForAWS {
        return PlayerDataForAWS.create(
            partial.raceType ?? this.raceType,
            partial.playerNumber ?? this.playerNumber,
            partial.name ?? this.name,
            partial.priority ?? this.priority,
        );
    }
}
