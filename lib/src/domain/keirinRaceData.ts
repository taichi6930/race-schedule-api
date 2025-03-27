import {
    type KeirinGradeType,
    validateKeirinGradeType,
} from '../utility/data/keirin/keirinGradeType';
import {
    type KeirinRaceCourse,
    validateKeirinRaceCourse,
} from '../utility/data/keirin/keirinRaceCourse';
import type { KeirinRaceDateTime } from '../utility/data/keirin/keirinRaceDateTime';
import { validateKeirinRaceDateTime } from '../utility/data/keirin/keirinRaceDateTime';
import {
    type KeirinRaceName,
    validateKeirinRaceName,
} from '../utility/data/keirin/keirinRaceName';
import {
    type KeirinRaceNumber,
    validateKeirinRaceNumber,
} from '../utility/data/keirin/keirinRaceNumber';
import {
    type KeirinRaceStage,
    validateKeirinRaceStage,
} from '../utility/data/keirin/keirinRaceStage';
import type { IPlaceData } from './iPlaceData';

/**
 * 競輪のレース開催データ
 */
export class KeirinRaceData implements IPlaceData<KeirinRaceData> {
    /**
     * レース名
     * @type {KeirinRaceName}
     */
    public readonly name: KeirinRaceName;
    /**
     * 開催ステージ
     * @type {KeirinRaceStage}
     */
    public readonly stage: KeirinRaceStage;
    /**
     * 開催日時
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
     * レース番号
     * @type {KeirinRaceNumber}
     */
    public readonly number: KeirinRaceNumber;

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
        name: KeirinRaceName,
        stage: KeirinRaceStage,
        dateTime: KeirinRaceDateTime,
        location: KeirinRaceCourse,
        grade: KeirinGradeType,
        number: KeirinRaceNumber,
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
            validateKeirinRaceName(name),
            validateKeirinRaceStage(stage),
            validateKeirinRaceDateTime(dateTime),
            validateKeirinRaceCourse(location),
            validateKeirinGradeType(grade),
            validateKeirinRaceNumber(number),
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
