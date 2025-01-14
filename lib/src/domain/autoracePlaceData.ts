import type { AutoraceGradeType } from '../utility/data/autorace/autoraceGradeType';
import { validateAutoraceGradeType } from '../utility/data/autorace/autoraceGradeType';
import type { AutoraceRaceCourse } from '../utility/data/autorace/autoraceRaceCourse';
import { validateAutoraceRaceCourse } from '../utility/data/autorace/autoraceRaceCourse';
import type { AutoraceRaceDate } from '../utility/data/autorace/autoraceRaceDate';
import { validateAutoraceRaceDate } from '../utility/data/autorace/autoraceRaceDate';

/**
 * オートレースのレース開催場所データ
 */
export class AutoracePlaceData {
    // 開催日時
    public readonly dateTime: AutoraceRaceDate;
    // 開催場所
    public readonly location: AutoraceRaceCourse;
    // オートレースのグレード
    public readonly grade: AutoraceGradeType;

    private constructor(
        dateTime: AutoraceRaceDate,
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
     * @param location - 開催場所 (バリデーション対象)
     * @param grade - オートレースのグレード (バリデーション対象)
     */
    static create(
        dateTime: Date,
        location: string,
        grade: string,
    ): AutoracePlaceData {
        return new AutoracePlaceData(
            validateAutoraceRaceDate(dateTime),
            validateAutoraceRaceCourse(location),
            validateAutoraceGradeType(grade),
        );
    }
    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     * @returns 新しいAutoracePlaceDataインスタンス
     */
    copy(partial: Partial<AutoracePlaceData> = {}): AutoracePlaceData {
        return AutoracePlaceData.create(
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
        );
    }
}
