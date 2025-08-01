import type { RaceDateTime } from '../utility/data/common/raceDateTime';
import { validateRaceDateTime } from '../utility/data/common/raceDateTime';
import type { NarRaceCourse } from '../utility/data/nar/narRaceCourse';
import { validateNarRaceCourse } from '../utility/data/nar/narRaceCourse';
import type { IPlaceData } from './iPlaceData';

/**
 * 地方競馬のレース開催場所データ
 */
export class NarPlaceData implements IPlaceData<NarPlaceData> {
    /**
     * 開催日
     * @type {RaceDateTime}
     */
    public readonly dateTime: RaceDateTime;
    /**
     * 開催場所
     * @type {NarRaceCourse}
     */
    public readonly location: NarRaceCourse;

    /**
     * コンストラクタ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     */
    private constructor(dateTime: RaceDateTime, location: NarRaceCourse) {
        this.dateTime = dateTime;
        this.location = location;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     */
    public static create(dateTime: Date, location: string): NarPlaceData {
        return new NarPlaceData(
            validateRaceDateTime(dateTime),
            validateNarRaceCourse(location),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいNarPlaceDataインスタンス
     */
    public copy(partial: Partial<NarPlaceData> = {}): NarPlaceData {
        return NarPlaceData.create(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }
}
