import {
    type BoatraceGradeType,
    validateGradeType,
} from '../utility/data/common/gradeType';
import {
    type BoatraceRaceCourse,
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
import {
    type RaceStage,
    validateRaceStage,
} from '../utility/data/common/raceStage';
import { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * オートレースのレース開催データ
 */
export class BoatraceRaceData implements IPlaceData<BoatraceRaceData> {
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
        location: BoatraceRaceCourse,
        grade: BoatraceGradeType,
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
    ): BoatraceRaceData {
        return new BoatraceRaceData(
            validateRaceName(name),
            validateRaceStage(RaceType.BOATRACE, stage),
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.BOATRACE, location),
            validateGradeType(RaceType.BOATRACE, grade),
            validateRaceNumber(number),
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
