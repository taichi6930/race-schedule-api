import {
    type HeldDayTimes,
    validateHeldDayTimes,
} from '../utility/validateAndType/heldDayTimes';
import {
    type HeldTimes,
    validateHeldTimes,
} from '../utility/validateAndType/heldTimes';

/**
 * 競馬の開催日データ
 */
export class HeldDayData {
    /**
     * コンストラクタ
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly heldTimes: HeldTimes,
        public readonly heldDayTimes: HeldDayTimes,
    ) {}

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
