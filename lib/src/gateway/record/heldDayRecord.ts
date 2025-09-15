import { HeldDayData } from '../../../../src/domain/heldDayData';
import type { RaceType } from '../../../../src/utility/raceType';
import {
    type HeldDayTimes,
    validateHeldDayTimes,
} from '../../../../src/utility/validateAndType/heldDayTimes';
import type { HeldTimes } from '../../../../src/utility/validateAndType/heldTimes';
import { validateHeldTimes } from '../../../../src/utility/validateAndType/heldTimes';
import type { PublicGamblingId } from '../../../../src/utility/validateAndType/idUtility';
import {
    IdType,
    validateId,
} from '../../../../src/utility/validateAndType/idUtility';
import { createErrorMessage } from '../../utility/error';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';

/**
 * Repository層のRecord
 */
export class HeldDayRecord {
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
        public readonly id: PublicGamblingId,
        public readonly raceType: RaceType,
        public readonly heldTimes: HeldTimes,
        public readonly heldDayTimes: HeldDayTimes,
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
    ): HeldDayRecord {
        try {
            return new HeldDayRecord(
                validateId(IdType.PLACE, raceType, id),
                raceType,
                validateHeldTimes(heldTimes),
                validateHeldDayTimes(heldDayTimes),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('HeldDayRecord create error', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<HeldDayRecord> = {}): HeldDayRecord {
        return HeldDayRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     *  HeldDayDataに変換する
     */
    public toHeldDayData(): HeldDayData {
        return HeldDayData.create(this.heldTimes, this.heldDayTimes);
    }
}
