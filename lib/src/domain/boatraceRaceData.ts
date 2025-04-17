import {
    type BoatraceGradeType,
    validateBoatraceGradeType,
} from '../utility/data/boatrace/boatraceGradeType';
import {
    type BoatraceRaceCourse,
    validateBoatraceRaceCourse,
} from '../utility/data/boatrace/boatraceRaceCourse';
import {
    type BoatraceRaceDateTime,
    validateBoatraceRaceDateTime,
} from '../utility/data/boatrace/boatraceRaceDateTime';
import {
    type BoatraceRaceName,
    validateBoatraceRaceName,
} from '../utility/data/boatrace/boatraceRaceName';
import {
    type BoatraceRaceNumber,
    validateBoatraceRaceNumber,
} from '../utility/data/boatrace/boatraceRaceNumber';
import {
    type BoatraceRaceStage,
    validateBoatraceRaceStage,
} from '../utility/data/boatrace/boatraceRaceStage';
import type { IPlaceData } from './iPlaceData';

/**
 * ボートレースのレース開催データ
 */
export class BoatraceRaceData implements IPlaceData<BoatraceRaceData> {
    /**
     * レース名
     * @type {BoatraceRaceName}
     */
    public readonly name: BoatraceRaceName;
    /**
     * 開催ステージ
     * @type {BoatraceRaceStage}
     */
    public readonly stage: BoatraceRaceStage;
    /**
     * 開催日時
     * @type {BoatraceRaceDateTime}
     */
    public readonly dateTime: BoatraceRaceDateTime;
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
     * レース番号
     * @type {BoatraceRaceNumber}
     */
    public readonly number: BoatraceRaceNumber;

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
        name: BoatraceRaceName,
        stage: BoatraceRaceStage,
        dateTime: BoatraceRaceDateTime,
        location: BoatraceRaceCourse,
        grade: BoatraceGradeType,
        number: BoatraceRaceNumber,
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
    ): BoatraceRaceData {
        return new BoatraceRaceData(
            validateBoatraceRaceName(name),
            validateBoatraceRaceStage(stage),
            validateBoatraceRaceDateTime(dateTime),
            validateBoatraceRaceCourse(location),
            validateBoatraceGradeType(grade),
            validateBoatraceRaceNumber(number),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<BoatraceRaceData> = {}): BoatraceRaceData {
        return BoatraceRaceData.create(
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
