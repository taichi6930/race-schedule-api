import type { WorldRaceCourse } from '../utility/data/world/worldRaceCourse';
import { validateWorldRaceCourse } from '../utility/data/world/worldRaceCourse';
import {
    validateWorldRaceDateTime,
    type WorldRaceDateTime,
} from '../utility/data/world/worldRaceDateTime';
import type { IPlaceData } from './iPlaceData';

/**
 * 海外競馬のレース開催場所データ
 */
export class WorldPlaceData implements IPlaceData<WorldPlaceData> {
    /**
     * 開催日
     * @type {WorldRaceDateTime}
     */
    public readonly dateTime: WorldRaceDateTime;
    /**
     * 開催場所
     * @type {WorldRaceCourse}
     */
    public readonly location: WorldRaceCourse;

    /**
     * コンストラクタ
     * @param dateTime
     * @param location
     */
    private constructor(
        dateTime: WorldRaceDateTime,
        location: WorldRaceCourse,
    ) {
        this.dateTime = dateTime;
        this.location = location;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     */
    static create(dateTime: Date, location: string): WorldPlaceData {
        return new WorldPlaceData(
            validateWorldRaceDateTime(dateTime),
            validateWorldRaceCourse(location),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいWorldPlaceDataインスタンス
     */
    copy(partial: Partial<WorldPlaceData> = {}): WorldPlaceData {
        return WorldPlaceData.create(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }
}
