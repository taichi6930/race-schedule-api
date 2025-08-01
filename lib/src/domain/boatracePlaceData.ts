import type { BoatraceGradeType } from '../utility/data/boatrace/boatraceGradeType';
import { validateBoatraceGradeType } from '../utility/data/boatrace/boatraceGradeType';
import type { BoatraceRaceCourse } from '../utility/data/common/raceCourse';
import { validateRaceCourse } from '../utility/data/common/raceCourse';
import type { RaceDateTime } from '../utility/data/common/raceDateTime';
import { validateRaceDateTime } from '../utility/data/common/raceDateTime';
import { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * ボートレースのレース開催場所データ
 */
export class BoatracePlaceData implements IPlaceData<BoatracePlaceData> {
    /**
     * 開催日時
     * @type {RaceDateTime}
     */
    public readonly dateTime: RaceDateTime;
    /**
     * 開催場所
     * @type {BoatraceRaceCourse}
     */
    public readonly location: BoatraceRaceCourse;
    /**
     * グレード
     * @type {BoatraceGradeType}
     */
    public readonly grade: BoatraceGradeType;

    /**
     * コンストラクタ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        dateTime: RaceDateTime,
        location: BoatraceRaceCourse,
        grade: BoatraceGradeType,
    ) {
        this.dateTime = dateTime;
        this.location = location;
        this.grade = grade;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     */
    public static create(
        dateTime: Date,
        location: string,
        grade: string,
    ): BoatracePlaceData {
        return new BoatracePlaceData(
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.BOATRACE, location),
            validateBoatraceGradeType(grade),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<BoatracePlaceData> = {}): BoatracePlaceData {
        return new BoatracePlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }
}
