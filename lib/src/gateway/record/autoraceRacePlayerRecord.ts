import '../../utility/format';

import {
    type AutoracePlayerNumber,
    validateAutoracePlayerNumber,
} from '../../utility/data/autorace/autoracePlayerNumber';
import {
    type AutoracePositionNumber,
    validateAutoracePositionNumber,
} from '../../utility/data/autorace/autoracePositionNumber';
import type { AutoraceRaceId } from '../../utility/data/autorace/autoraceRaceId';
import { validateAutoraceRaceId } from '../../utility/data/autorace/autoraceRaceId';
import type { AutoraceRacePlayerId } from '../../utility/data/autorace/autoraceRacePlayerId';
import { validateAutoraceRacePlayerId } from '../../utility/data/autorace/autoraceRacePlayerId';

/**
 * オートレースのレース選手データ
 */
export class AutoraceRacePlayerRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催データを生成する
     * @param id - ID
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @param updateDate - 更新日時
     *
     *
     */
    private constructor(
        public readonly id: AutoraceRacePlayerId,
        public readonly raceId: AutoraceRaceId,
        public readonly positionNumber: AutoracePositionNumber,
        public readonly playerNumber: AutoracePlayerNumber,
        public readonly updateDate: Date,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @param updateDate - 更新日時
     */
    static create(
        id: string,
        raceId: string,
        positionNumber: number,
        playerNumber: number,
        updateDate: Date,
    ): AutoraceRacePlayerRecord {
        try {
            return new AutoraceRacePlayerRecord(
                validateAutoraceRacePlayerId(id),
                validateAutoraceRaceId(raceId),
                validateAutoracePositionNumber(positionNumber),
                validateAutoracePlayerNumber(playerNumber),
                updateDate,
            );
        } catch (error) {
            throw new Error(
                `Failed to create AutoraceRacePlayerRecord: ${(error as Error).message}`,
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(
        partial: Partial<AutoraceRacePlayerRecord> = {},
    ): AutoraceRacePlayerRecord {
        return AutoraceRacePlayerRecord.create(
            partial.id ?? this.id,
            partial.raceId ?? this.raceId,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
            partial.updateDate ?? this.updateDate,
        );
    }
}
