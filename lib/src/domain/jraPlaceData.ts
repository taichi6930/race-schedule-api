import {
    type JraHeldDayTimes,
    validateJraHeldDayTimes,
} from '../utility/data/jra/jraHeldDayTimes';
import {
    type JraHeldTimes,
    validateJraHeldTimes,
} from '../utility/data/jra/jraHeldTimes';
import type { JraRaceCourse } from '../utility/data/jra/jraRaceCourse';
import { validateJraRaceCourse } from '../utility/data/jra/jraRaceCourse';
import {
    type JraRaceDateTime,
    validateJraRaceDateTime,
} from '../utility/data/jra/jraRaceDateTime';
import type { IPlaceData } from './iPlaceData';

/**
 * 中央競馬のレース開催場所データ
 */
export class JraPlaceData implements IPlaceData<JraPlaceData> {
    /**
     * 開催日時
     * @type {JraRaceDateTime}
     */
    public readonly dateTime: JraRaceDateTime;
    /**
     * 開催場所
     * @type {JraRaceCourse}
     */
    public readonly location: JraRaceCourse;
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
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     */
    private constructor(
        dateTime: JraRaceDateTime,
        location: JraRaceCourse,
        heldTimes: JraHeldTimes,
        heldDayTimes: JraHeldDayTimes,
    ) {
        this.dateTime = dateTime;
        this.location = location;
        this.heldTimes = heldTimes;
        this.heldDayTimes = heldDayTimes;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     */
    public static create(
        dateTime: Date,
        location: string,
        heldTimes: number,
        heldDayTimes: number,
    ): JraPlaceData {
        return new JraPlaceData(
            validateJraRaceDateTime(dateTime),
            validateJraRaceCourse(location),
            validateJraHeldTimes(heldTimes),
            validateJraHeldDayTimes(heldDayTimes),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいJraPlaceDataインスタンス
     */
    public copy(partial: Partial<JraPlaceData> = {}): JraPlaceData {
        return JraPlaceData.create(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
        );
    }
}
