import '../../utility/format';

import type { PositionNumber } from '../../utility/data/common/positionNumber';
import { validatePositionNumber } from '../../utility/data/common/positionNumber';
import type { RaceId } from '../../utility/data/common/raceId';
import { validateRaceId } from '../../utility/data/common/raceId';
import type { RacePlayerId } from '../../utility/data/common/racePlayerId';
import { validateRacePlayerId } from '../../utility/data/common/racePlayerId';
import type { PlayerNumber } from '../../utility/data/playerNumber';
import { validatePlayerNumber } from '../../utility/data/playerNumber';
import { createErrorMessage } from '../../utility/error';
import type { RaceType } from '../../utility/raceType';
import { isRaceType } from '../../utility/raceType';
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
     * @param raceType - レース種別
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @param updateDate - 更新日時
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: RacePlayerId,
        public readonly raceType: RaceType,
        public readonly raceId: RaceId,
        public readonly positionNumber: PositionNumber,
        public readonly playerNumber: PlayerNumber,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceType - レース種別
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceType: string,
        raceId: string,
        positionNumber: number,
        playerNumber: number,
        updateDate: Date,
    ): AutoraceRacePlayerRecord {
        if (!isRaceType(raceType)) {
            throw new Error(`Invalid raceType: ${raceType}`);
        }
        try {
            return new AutoraceRacePlayerRecord(
                validateRacePlayerId(raceType, id),
                raceType,
                validateRaceId(raceType, raceId),
                validatePositionNumber(raceType, positionNumber),
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
            partial.raceType ?? this.raceType,
            partial.raceId ?? this.raceId,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
            partial.updateDate ?? this.updateDate,
        );
    }
}
