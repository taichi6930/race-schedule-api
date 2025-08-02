import {
    type AutoraceRaceName,
    validateAutoraceRaceName,
} from '../utility/data/autorace/autoraceRaceName';
import {
    type AutoraceRaceStage,
    validateAutoraceRaceStage,
} from '../utility/data/autorace/autoraceRaceStage';
import {
    type AutoraceGradeType,
    validateGradeType,
} from '../utility/data/common/gradeType';
import {
    type AutoraceRaceCourse,
    validateRaceCourse,
} from '../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../utility/data/common/raceDateTime';
import {
    type RaceNumber,
    validateRaceNumber,
} from '../utility/data/common/raceNumber';
import { RaceType } from '../utility/raceType';
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
     * @type {RaceDateTime}
     */
    public readonly dateTime: RaceDateTime;
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
     * @type {RaceNumber}
     */
    public readonly number: RaceNumber;

    /**
     * コンストラクタ
     * @param name - レース名
     * @param stage - 開催ステージ
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param number - レース番号
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        name: AutoraceRaceName,
        stage: AutoraceRaceStage,
        dateTime: RaceDateTime,
        location: AutoraceRaceCourse,
        grade: AutoraceGradeType,
        number: RaceNumber,
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
    public static create(
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
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.AUTORACE, location),
            validateGradeType(RaceType.AUTORACE, grade),
            validateRaceNumber(number),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<AutoraceRaceData> = {}): AutoraceRaceData {
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
