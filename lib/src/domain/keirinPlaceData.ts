import type { RaceDateTime } from '../utility/data/common/raceDateTime';
import { validateRaceDateTime } from '../utility/data/common/raceDateTime';
import type { KeirinGradeType } from '../utility/data/keirin/keirinGradeType';
import { validateKeirinGradeType } from '../utility/data/keirin/keirinGradeType';
import type { KeirinRaceCourse } from '../utility/data/keirin/keirinRaceCourse';
import { validateKeirinRaceCourse } from '../utility/data/keirin/keirinRaceCourse';
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
     * @type {KeirinRaceCourse}
     */
    public readonly location: KeirinRaceCourse;
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
        location: KeirinRaceCourse,
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
            validateKeirinRaceCourse(location),
            validateKeirinGradeType(grade),
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
