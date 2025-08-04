import type { KeirinGradeType } from '../utility/data/common/gradeType';
import { validateGradeType } from '../utility/data/common/gradeType';
import type { RaceCourse } from '../utility/data/common/raceCourse';
import { validateRaceCourse } from '../utility/data/common/raceCourse';
import type { RaceDateTime } from '../utility/data/common/raceDateTime';
import { validateRaceDateTime } from '../utility/data/common/raceDateTime';
import { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * 競輪のレース開催場所データ
 */
export class KeirinPlaceData implements IPlaceData<KeirinPlaceData> {
    /**
     * 開催日
     * @type {RaceDateTime}
     */
    public readonly dateTime: RaceDateTime;
    /**
     * 開催場所
     * @type {RaceCourse}
     */
    public readonly location: RaceCourse;
    /**
     * グレード
     * @type {KeirinGradeType}
     */
    public readonly grade: KeirinGradeType;

    /**
     * コンストラクタ
     * @param dateTime
     * @param location
     * @param grade
     */
    private constructor(
        dateTime: RaceDateTime,
        location: RaceCourse,
        grade: KeirinGradeType,
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
    ): KeirinPlaceData {
        return new KeirinPlaceData(
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.KEIRIN, location),
            validateGradeType(RaceType.KEIRIN, grade),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいKeirinPlaceDataインスタンス
     */
    public copy(partial: Partial<KeirinPlaceData> = {}): KeirinPlaceData {
        return new KeirinPlaceData(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }
}
