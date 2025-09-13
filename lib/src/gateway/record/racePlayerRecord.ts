import '../../../../src/utility/format';

import { RacePlayerData } from '../../../../src/domain/racePlayerData';
import { createErrorMessage } from '../../../../src/utility/error';
import type { RaceType } from '../../../../src/utility/raceType';
import type { PlayerNumber } from '../../../../src/utility/validateAndType/playerNumber';
import { validatePlayerNumber } from '../../../../src/utility/validateAndType/playerNumber';
import type { PositionNumber } from '../../../../src/utility/validateAndType/positionNumber';
import { validatePositionNumber } from '../../../../src/utility/validateAndType/positionNumber';
import type { RaceId } from '../../../../src/utility/validateAndType/raceId';
import { validateRaceId } from '../../../../src/utility/validateAndType/raceId';
import type { RacePlayerId } from '../../../../src/utility/validateAndType/racePlayerId';
import { validateRacePlayerId } from '../../../../src/utility/validateAndType/racePlayerId';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';

/**
 * レース選手データ
 */
export class RacePlayerRecord {
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
        raceType: RaceType,
        raceId: string,
        positionNumber: number,
        playerNumber: number,
        updateDate: Date,
    ): RacePlayerRecord {
        try {
            return new RacePlayerRecord(
                validateRacePlayerId(raceType, id),
                raceType,
                validateRaceId(raceType, raceId),
                validatePositionNumber(raceType, positionNumber),
                validatePlayerNumber(playerNumber),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to create RacePlayerRecord', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<RacePlayerRecord> = {}): RacePlayerRecord {
        return RacePlayerRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.raceId ?? this.raceId,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * レース選手データをRacePlayerDataに変換する
     */
    public toRacePlayerData(): RacePlayerData {
        return RacePlayerData.create(
            this.raceType,
            this.positionNumber,
            this.playerNumber,
        );
    }
}
