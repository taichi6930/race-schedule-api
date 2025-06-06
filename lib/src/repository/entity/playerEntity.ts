import type { PlayerData } from '../../domain/playerData';

/**
 * playerIdを作成する
 * @param raceType - 選手の競技タイプ
 * @param playerNumber - 選手番号
 */
export const generatePlayerId = (
    raceType: string,
    playerNumber: number,
): string => {
    return `${raceType}${playerNumber.toString()}`;
};

/**
 * Repository層のEntity 選手データ
 */
export class PlayerEntity {
    /**
     * コンストラクタ
     * @param id - ID
     * @param playerData - 選手データ
     * @remarks
     * 選手データを生成する
     */
    private constructor(
        public readonly id: string,
        public readonly playerData: PlayerData,
    ) {}

    /**
     * インスタンス生成メソッド（Idなし）
     * @param playerData - 選手データ
     * @remarks
     * 選手データを生成する
     */
    public static createWithoutId(playerData: PlayerData): PlayerEntity {
        return new PlayerEntity(
            generatePlayerId(playerData.raceType, playerData.playerNumber),
            playerData,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<PlayerEntity> = {}): PlayerEntity {
        return new PlayerEntity(
            partial.id ?? this.id,
            partial.playerData ?? this.playerData,
        );
    }
}
