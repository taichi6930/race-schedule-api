import {
    type KeirinPositionNumber,
    validateKeirinPositionNumber,
} from '../utility/data/keirin/keirinPositionNumber';
import {
    type PlayerNumber,
    validatePlayerNumber,
} from '../utility/data/playerNumber';

/**
 * 競輪のレースの選手データ (Value Object)
 *
 * このクラスは値オブジェクトとして実装されており、
 * 同じデータを持つインスタンスは等価として扱われます。
 * 一度作成されると変更できない不変オブジェクトです。
 */
export class KeirinRacePlayerData {
    /**
     * 枠番
     * @type {KeirinPositionNumber}
     */
    public readonly positionNumber: KeirinPositionNumber;
    /**
     * 選手番号
     * @type {PlayerNumber}
     */
    public readonly playerNumber: PlayerNumber;

    /**
     * コンストラクタ
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @remarks
     * レースの選手データを生成する
     */
    private constructor(
        positionNumber: KeirinPositionNumber,
        playerNumber: PlayerNumber,
    ) {
        this.positionNumber = positionNumber;
        this.playerNumber = playerNumber;
    }

    /**
     * インスタンス生成メソッド
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     */
    public static create(
        positionNumber: number,
        playerNumber: number,
    ): KeirinRacePlayerData {
        return new KeirinRacePlayerData(
            validateKeirinPositionNumber(positionNumber),
            validatePlayerNumber(playerNumber),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいKeirinRacePlayerDataインスタンス
     */
    public copy(
        partial: Partial<KeirinRacePlayerData> = {},
    ): KeirinRacePlayerData {
        return new KeirinRacePlayerData(
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }

    /**
     * 値の等価性を比較する (Value Object の特徴)
     * @param other - 比較対象のKeirinRacePlayerData
     * @returns 全ての値が等しい場合はtrue
     */
    public equals(other: KeirinRacePlayerData): boolean {
        if (!(other instanceof KeirinRacePlayerData)) {
            return false;
        }

        return (
            this.positionNumber === other.positionNumber &&
            this.playerNumber === other.playerNumber
        );
    }

    /**
     * デバッグ用の文字列表現
     * @returns オブジェクトの文字列表現
     */
    public toString(): string {
        return `KeirinRacePlayerData(positionNumber: ${this.positionNumber}, playerNumber: ${this.playerNumber})`;
    }
}
