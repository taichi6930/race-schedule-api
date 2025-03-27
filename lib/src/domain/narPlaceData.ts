import type { NarRaceCourse } from '../utility/data/nar/narRaceCourse';
import { validateNarRaceCourse } from '../utility/data/nar/narRaceCourse';
import type { NarRaceDateTime } from '../utility/data/nar/narRaceDateTime';
import { validateNarRaceDateTime } from '../utility/data/nar/narRaceDateTime';
import type { IPlaceData } from './iPlaceData';

/**
 * 地方競馬のレース開催場所データ
 */
export class NarPlaceData implements IPlaceData<NarPlaceData> {
    /**
     * 開催日
     * @type {NarRaceDateTime}
     */
    public readonly dateTime: NarRaceDateTime;
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
    private constructor(dateTime: NarRaceDateTime, location: NarRaceCourse) {
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
            validateNarRaceDateTime(dateTime),
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
