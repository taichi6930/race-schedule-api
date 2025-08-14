import {
    type heldDayTimes,
    validateHeldDayTimes,
} from '../../utility/data/common/heldDayTimes';
import type { HeldTimes } from '../../utility/data/common/heldTimes';
import { validateHeldTimes } from '../../utility/data/common/heldTimes';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import { createErrorMessage } from '../../utility/error';
import type { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord
 */
export class heldDayRecord implements IRecord<heldDayRecord> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceType - レース種別
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly raceType: RaceType,
        public readonly heldTimes: HeldTimes,
        public readonly heldDayTimes: heldDayTimes,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceType - レース種別
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceType: RaceType,
        heldTimes: number,
        heldDayTimes: number,
        updateDate: Date,
    ): heldDayRecord {
        try {
            return new heldDayRecord(
                validatePlaceId(raceType, id),
                raceType,
                validateHeldTimes(heldTimes),
                validateHeldDayTimes(heldDayTimes),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('JraHeldDayRecord create error', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<heldDayRecord> = {}): heldDayRecord {
        return heldDayRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
            partial.updateDate ?? this.updateDate,
        );
    }
}
