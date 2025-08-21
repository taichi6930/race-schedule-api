import {
    type heldDayTimes as HeldDayTimes,
    validateHeldDayTimes,
} from '../utility/data/common/heldDayTimes';
import {
    type HeldTimes,
    validateHeldTimes,
} from '../utility/data/common/heldTimes';

/**
 * 競馬の開催日データ
 */
export class HeldDayData {
    /**
     * 開催回数
     * @type {HeldTimes}
     */
    public readonly heldTimes: HeldTimes;

    /**
     * 開催日数
     * @type {HeldDayTimes}
     */
    public readonly heldDayTimes: HeldDayTimes;

    /**
     * コンストラクタ
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @remarks
     * レース開催データを生成する
     */
    private constructor(heldTimes: HeldTimes, heldDayTimes: HeldDayTimes) {
        this.heldTimes = heldTimes;
        this.heldDayTimes = heldDayTimes;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     */
    public static create(heldTimes: number, heldDayTimes: number): HeldDayData {
        return new HeldDayData(
            validateHeldTimes(heldTimes),
            validateHeldDayTimes(heldDayTimes),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<HeldDayData> = {}): HeldDayData {
        return HeldDayData.create(
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
        );
    }
}
