import type { WorldRaceCourse } from '../utility/data/common/raceCourse';
import { validateRaceCourse } from '../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../utility/data/common/raceDateTime';
import { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * 海外競馬のレース開催場所データ
 */
export class WorldPlaceData implements IPlaceData<WorldPlaceData> {
    /**
     * 開催日
     * @type {RaceDateTime}
     */
    public readonly dateTime: RaceDateTime;
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
    private constructor(dateTime: RaceDateTime, location: WorldRaceCourse) {
        this.dateTime = dateTime;
        this.location = location;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     */
    public static create(dateTime: Date, location: string): WorldPlaceData {
        return new WorldPlaceData(
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.WORLD, location),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいWorldPlaceDataインスタンス
     */
    public copy(partial: Partial<WorldPlaceData> = {}): WorldPlaceData {
        return WorldPlaceData.create(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
        );
    }
}
