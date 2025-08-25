import type { RaceType } from '../utility/raceType';
import type { RaceCourse } from '../utility/validateAndType/raceCourse';
import { validateRaceCourse } from '../utility/validateAndType/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../utility/validateAndType/raceDateTime';

/**
 * レース開催場所データ
 */
export class PlaceData {
    /**
     * レース種別
     * @type {RaceType}
     */
    public readonly raceType: RaceType;

    /**
     * 開催日時
     * @type {RaceDateTime}
     */
    public readonly dateTime: RaceDateTime;

    /**
     * 開催場所
     * @type {RaceCourse}
     */
    public readonly location: RaceCourse;

    /**
     * コンストラクタ
     * @param raceType - レース種別
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        raceType: RaceType,
        dateTime: RaceDateTime,
        location: RaceCourse,
    ) {
        this.raceType = raceType;
        this.dateTime = dateTime;
        this.location = location;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param raceType - レース種別
     * @param dateTime - 開催日時
     * @param location - 開催場所
     */
    public static create(
        raceType: RaceType,
        dateTime: Date,
        location: string,
    ): PlaceData {
        return new PlaceData(
            raceType,
            validateRaceDateTime(dateTime),
            validateRaceCourse(raceType, location),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<PlaceData> = {}): PlaceData {
        return PlaceData.create(
            partial.raceType ?? this.raceType,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }
}
