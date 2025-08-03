import '../../utility/format';

import type { AutoraceRaceId } from '../../utility/data/autorace/autoraceRaceId';
import { validateAutoraceRaceId } from '../../utility/data/autorace/autoraceRaceId';
import {
    type AutoracePositionNumber,
    validatePositionNumber,
} from '../../utility/data/common/positionNumber';
import type { AutoraceRacePlayerId } from '../../utility/data/common/racePlayerId';
import { validateRacePlayerId } from '../../utility/data/common/racePlayerId';
import type { PlayerNumber } from '../../utility/data/playerNumber';
import { validatePlayerNumber } from '../../utility/data/playerNumber';
import { createErrorMessage } from '../../utility/error';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * オートレースのレース選手データ
 */
export class AutoraceRacePlayerRecord
    implements IRecord<AutoraceRacePlayerRecord>
{
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @param updateDate - 更新日時
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: AutoraceRacePlayerId,
        public readonly raceId: AutoraceRaceId,
        public readonly positionNumber: AutoracePositionNumber,
        public readonly playerNumber: PlayerNumber,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceId: string,
        positionNumber: number,
        playerNumber: number,
        updateDate: Date,
    ): AutoraceRacePlayerRecord {
        try {
            return new AutoraceRacePlayerRecord(
                validateRacePlayerId(RaceType.AUTORACE, id),
                validateAutoraceRaceId(raceId),
                validatePositionNumber(RaceType.AUTORACE, positionNumber),
                validatePlayerNumber(playerNumber),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage(
                    'Failed to create AutoraceRacePlayerRecord',
                    error,
                ),
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(
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
