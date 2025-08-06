import {
    type JraHeldDayTimes,
    validateJraHeldDayTimes,
} from '../utility/data/jra/jraHeldDayTimes';
import {
    type JraHeldTimes,
    validateJraHeldTimes,
} from '../utility/data/jra/jraHeldTimes';
import type { IPlaceData } from './iPlaceData';

/**
 * 中央競馬の開催日データ
 */
export class JraHeldDayData implements IPlaceData<JraHeldDayData> {
    /**
     * 開催回数
     * @type {JraHeldTimes}
     */
    public readonly heldTimes: JraHeldTimes;
    /**
     * 開催日数
     * @type {JraHeldDayTimes}
     */
    public readonly heldDayTimes: JraHeldDayTimes;

    /**
     * コンストラクタ
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        heldTimes: JraHeldTimes,
        heldDayTimes: JraHeldDayTimes,
    ) {
        this.heldTimes = heldTimes;
        this.heldDayTimes = heldDayTimes;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     */
    public static create(
        heldTimes: number,
        heldDayTimes: number,
    ): JraHeldDayData {
        return new JraHeldDayData(
            validateJraHeldTimes(heldTimes),
            validateJraHeldDayTimes(heldDayTimes),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<JraHeldDayData> = {}): JraHeldDayData {
        return JraHeldDayData.create(
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
        );
    }
}
