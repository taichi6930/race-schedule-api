import type { RaceCourse } from '../../lib/src/utility/validateAndType/raceCourse';
import { validateRaceCourse } from '../../lib/src/utility/validateAndType/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../../lib/src/utility/validateAndType/raceDateTime';
import type { RaceType } from '../utility/raceType';

/**
 * 開催場所データ
 */
export class PlaceData {
    /**
     * コンストラクタ
     * @param raceType - レース種別
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @remarks
     * 開催場所データを生成する
     */
    private constructor(
        public readonly raceType: RaceType,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
    ) {}

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
        try {
            return new PlaceData(
                raceType,
                validateRaceDateTime(dateTime),
                validateRaceCourse(raceType, location),
            );
        } catch {
            throw new Error(`Failed to create PlaceData:
                raceType: ${JSON.stringify(raceType)},
                dateTime: ${JSON.stringify(dateTime)},
                location: ${JSON.stringify(location)}`);
        }
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
