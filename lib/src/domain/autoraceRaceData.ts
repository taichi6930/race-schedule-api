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
    type RaceName,
    validateRaceName,
} from '../utility/data/common/raceName';
import {
    type RaceNumber,
    validateRaceNumber,
} from '../utility/data/common/raceNumber';
import type { RaceStage } from '../utility/data/common/raceStage';
import { validateAutoraceRaceStage } from '../utility/data/common/raceStage';
import { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * オートレースのレース開催データ
 */
export class AutoraceRaceData implements IPlaceData<AutoraceRaceData> {
    /**
     * レース名
     * @type {RaceName}
     */
    public readonly name: RaceName;
    /**
     * 開催ステージ
     * @type {RaceStage}
     */
    public readonly stage: RaceStage;
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
        name: RaceName,
        stage: RaceStage,
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
            validateRaceName(name),
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
