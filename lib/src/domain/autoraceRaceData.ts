import {
    type AutoraceGradeType,
    validateAutoraceGradeType,
} from '../utility/data/autorace/autoraceGradeType';
import {
    type AutoraceRaceCourse,
    validateAutoraceRaceCourse,
} from '../utility/data/autorace/autoraceRaceCourse';
import {
    type AutoraceRaceDateTime,
    validateAutoraceRaceDateTime,
} from '../utility/data/autorace/autoraceRaceDateTime';
import {
    type AutoraceRaceName,
    validateAutoraceRaceName,
} from '../utility/data/autorace/autoraceRaceName';
import {
    type AutoraceRaceNumber,
    validateAutoraceRaceNumber,
} from '../utility/data/autorace/autoraceRaceNumber';
import {
    type AutoraceRaceStage,
    validateAutoraceRaceStage,
} from '../utility/data/autorace/autoraceRaceStage';
import type { IPlaceData } from './iPlaceData';

/**
 * オートレースのレース開催データ
 */
export class AutoraceRaceData implements IPlaceData<AutoraceRaceData> {
    /**
     * レース名
     * @type {AutoraceRaceName}
     */
    public readonly name: AutoraceRaceName;
    /**
     * 開催ステージ
     * @type {AutoraceRaceStage}
     */
    public readonly stage: AutoraceRaceStage;
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
     * レース番号
     * @type {AutoraceRaceNumber}
     */
    public readonly number: AutoraceRaceNumber;

    /**
     * コンストラクタ
     * @remarks
     * レース開催データを生成する
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     */
    private constructor(
        name: AutoraceRaceName,
        stage: AutoraceRaceStage,
        dateTime: AutoraceRaceDateTime,
        location: AutoraceRaceCourse,
        grade: AutoraceGradeType,
        number: AutoraceRaceNumber,
    ) {
        this.name = name;
        this.stage = stage;
        this.dateTime = dateTime;
        this.location = location;
        this.grade = grade;
        this.number = number;
    }

    /**
     * インスタンス生成メソッド
     * バリデーション済みデータを元にインスタンスを生成する
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     */
    static create(
        name: string,
        stage: string,
        dateTime: Date,
        location: string,
        grade: string,
        number: number,
    ): AutoraceRaceData {
        return new AutoraceRaceData(
            validateAutoraceRaceName(name),
            validateAutoraceRaceStage(stage),
            validateAutoraceRaceDateTime(dateTime),
            validateAutoraceRaceCourse(location),
            validateAutoraceGradeType(grade),
            validateAutoraceRaceNumber(number),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    copy(partial: Partial<AutoraceRaceData> = {}): AutoraceRaceData {
        return AutoraceRaceData.create(
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
