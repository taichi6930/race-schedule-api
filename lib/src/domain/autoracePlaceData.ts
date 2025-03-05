import type { AutoraceGradeType } from '../utility/data/autorace/autoraceGradeType';
import { validateAutoraceGradeType } from '../utility/data/autorace/autoraceGradeType';
import type { AutoraceRaceCourse } from '../utility/data/autorace/autoraceRaceCourse';
import { validateAutoraceRaceCourse } from '../utility/data/autorace/autoraceRaceCourse';
import {
    type AutoraceRaceDateTime,
    validateAutoraceRaceDateTime,
} from '../utility/data/autorace/autoraceRaceDateTime';
import type { IPlaceData } from './iPlaceData';

/**
 * オートレースのレース開催場所データ
 */
export class AutoracePlaceData implements IPlaceData<AutoracePlaceData> {
    /**
     * 開催日時
     * @type {AutoraceRaceDateTime}
     */
    public readonly dateTime: AutoraceRaceDateTime;
    /**
     * 開催場所
     * @type {AutoraceRaceCourse}
     */
    public readonly location: AutoraceRaceCourse;
    /**
     * グレード
     * @type {AutoraceGradeType}
     */
    public readonly grade: AutoraceGradeType;

    /**
     * コンストラクタ
     * @remarks
     * レース開催場所データを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     */
    private constructor(
        dateTime: AutoraceRaceDateTime,
        location: AutoraceRaceCourse,
        grade: AutoraceGradeType,
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
    static create(
        dateTime: Date,
        location: string,
        grade: string,
    ): AutoracePlaceData {
        return new AutoracePlaceData(
            validateAutoraceRaceDateTime(dateTime),
            validateAutoraceRaceCourse(location),
            validateAutoraceGradeType(grade),
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    copy(partial: Partial<AutoracePlaceData> = {}): AutoracePlaceData {
        return AutoracePlaceData.create(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }
}
