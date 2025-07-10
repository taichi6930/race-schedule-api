import type { KeirinGradeType } from '../utility/data/keirin/keirinGradeType';
import { validateKeirinGradeType } from '../utility/data/keirin/keirinGradeType';
import type { KeirinRaceCourse } from '../utility/data/keirin/keirinRaceCourse';
import { validateKeirinRaceCourse } from '../utility/data/keirin/keirinRaceCourse';
import type { KeirinRaceDateTime } from '../utility/data/keirin/keirinRaceDateTime';
import { validateKeirinRaceDateTime } from '../utility/data/keirin/keirinRaceDateTime';
import type { IPlaceData } from './iPlaceData';

/**
 * 競輪のレース開催場所データ (Value Object)
 *
 * このクラスは値オブジェクトとして実装されており、
 * 同じデータを持つインスタンスは等価として扱われます。
 * 一度作成されると変更できない不変オブジェクトです。
 */
export class KeirinPlaceData implements IPlaceData<KeirinPlaceData> {
    /**
     * 開催日
     * @type {KeirinRaceDateTime}
     */
    public readonly dateTime: KeirinRaceDateTime;
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
        dateTime: KeirinRaceDateTime,
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
            validateKeirinRaceDateTime(dateTime),
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

    /**
     * 値の等価性を比較する (Value Object の特徴)
     * @param other - 比較対象のKeirinPlaceData
     * @returns 全ての値が等しい場合はtrue
     */
    public equals(other: KeirinPlaceData): boolean {
        if (!(other instanceof KeirinPlaceData)) {
            return false;
        }

        return (
            this.dateTime.getTime() === other.dateTime.getTime() &&
            this.location === other.location &&
            this.grade === other.grade
        );
    }

    /**
     * デバッグ用の文字列表現
     * @returns オブジェクトの文字列表現
     */
    public toString(): string {
        return `KeirinPlaceData(dateTime: ${this.dateTime.toISOString()}, location: ${this.location}, grade: ${this.grade})`;
    }
}
