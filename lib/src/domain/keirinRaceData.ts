import type { KeirinGradeType } from '../utility/data/common/gradeType';
import { validateGradeType } from '../utility/data/common/gradeType';
import {
    type KeirinRaceCourse,
    validateRaceCourse,
} from '../utility/data/common/raceCourse';
import type { RaceDateTime } from '../utility/data/common/raceDateTime';
import { validateRaceDateTime } from '../utility/data/common/raceDateTime';
import {
    type RaceName,
    validateRaceName,
} from '../utility/data/common/raceName';
import {
    type RaceNumber,
    validateRaceNumber,
} from '../utility/data/common/raceNumber';
import {
    type KeirinRaceStage,
    validateKeirinRaceStage,
} from '../utility/data/common/raceStage';
import { RaceType } from '../utility/raceType';
import type { IPlaceData } from './iPlaceData';

/**
 * 競輪のレース開催データ
 */
export class KeirinRaceData implements IPlaceData<KeirinRaceData> {
    /**
     * レース名
     * @type {RaceName}
     */
    public readonly name: RaceName;
    /**
     * 開催ステージ
     * @type {KeirinRaceStage}
     */
    public readonly stage: KeirinRaceStage;
    /**
     * 開催日時
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
        stage: KeirinRaceStage,
        dateTime: RaceDateTime,
        location: KeirinRaceCourse,
        grade: KeirinGradeType,
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
    ): KeirinRaceData {
        return new KeirinRaceData(
            validateRaceName(name),
            validateKeirinRaceStage(stage),
            validateRaceDateTime(dateTime),
            validateRaceCourse(RaceType.KEIRIN, location),
            validateGradeType(RaceType.KEIRIN, grade),
            validateRaceNumber(number),
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<KeirinRaceData> = {}): KeirinRaceData {
        return KeirinRaceData.create(
            partial.name ?? this.name,
            partial.stage ?? this.stage,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
        );
    }
}
