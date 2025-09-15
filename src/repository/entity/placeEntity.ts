import type { HeldDayData } from '../../domain/heldDayData';
import type { PlaceData } from '../../domain/placeData';
import { RaceType } from '../../utility/raceType';
import type { GradeType } from '../../utility/validateAndType/gradeType';
import type { PublicGamblingId } from '../../utility/validateAndType/idUtility';
import {
    generateId,
    IdType,
    validateId,
} from '../../utility/validateAndType/idUtility';

/**
 * Repository層のEntity レース開催場所データ
 */
export class PlaceEntity {
    /**
     * コンストラクタ
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param heldDayData - 開催日データ
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private readonly _heldDayData: HeldDayData | undefined;
    private readonly _grade: GradeType | undefined;

    private constructor(
        public readonly id: PublicGamblingId,
        public readonly placeData: PlaceData,
        heldDayData: HeldDayData | undefined,
        grade: GradeType | undefined,
    ) {
        this._heldDayData = heldDayData;
        this._grade = grade;
    }

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param heldDayData - 開催日データ
     * @param grade - グレード
     */
    public static create(
        id: string,
        placeData: PlaceData,
        heldDayData: HeldDayData | undefined,
        grade: GradeType | undefined,
    ): PlaceEntity {
        try {
            // placeData.raceType が JRA の場合, heldDayDataがundefinedの時はエラー
            // JRAの場合はheldDayDataが必須、JRA以外の場合はheldDayDataは不要
            if (
                (placeData.raceType === RaceType.JRA) !==
                (heldDayData !== undefined)
            ) {
                throw new Error(`HeldDayData is incorrect`);
            }
            // placeData.raceType が KEIRIN, AUTORACE, BOATRACE の場合, gradeがundefinedの時はエラー
            if (
                ((placeData.raceType === RaceType.KEIRIN ||
                    placeData.raceType === RaceType.AUTORACE ||
                    placeData.raceType === RaceType.BOATRACE) &&
                    grade === undefined) ||
                ((placeData.raceType === RaceType.JRA ||
                    placeData.raceType === RaceType.NAR ||
                    placeData.raceType === RaceType.OVERSEAS) &&
                    grade !== undefined)
            ) {
                throw new Error(`Grade is incorrect`);
            }

            return new PlaceEntity(
                validateId(IdType.PLACE, placeData.raceType, id),
                placeData,
                heldDayData,
                grade,
            );
        } catch {
            throw new Error(
                `Failed to create PlaceEntity:
                    id: ${id},
                    placeData: ${JSON.stringify(placeData)},
                    heldDayData: ${JSON.stringify(heldDayData)},
                    grade: ${JSON.stringify(grade)}
                `,
            );
        }
    }

    /**
     * idがない場合でのcreate
     * @param placeData - レース開催場所データ
     * @param heldDayData - 開催日データ
     * @param grade - グレード
     * @param updateDate - 更新日時
     */
    public static createWithoutId(
        placeData: PlaceData,
        heldDayData: HeldDayData | undefined,
        grade: GradeType | undefined,
    ): PlaceEntity {
        return PlaceEntity.create(
            generateId(IdType.PLACE, {
                raceType: placeData.raceType,
                dateTime: placeData.dateTime,
                location: placeData.location,
            }),
            placeData,
            heldDayData,
            grade,
        );
    }

    /**
     * JRA のみ有効な heldDayData のアクセサ
     * raceType が JRA 以外の場合にアクセスされると例外を投げる
     */
    public get heldDayData(): HeldDayData {
        if (this.placeData.raceType !== RaceType.JRA) {
            throw new Error('heldDayData is only available for JRA');
        }
        if (this._heldDayData === undefined) {
            throw new Error('heldDayData is missing for JRA');
        }
        return this._heldDayData;
    }

    /**
     * KEIRIN, AUTORACE, BOATRACE のみ有効な grade のアクセサ
     * それ以外の raceType でアクセスされると例外を投げる
     */
    public get grade(): GradeType {
        if (
            this.placeData.raceType !== RaceType.KEIRIN &&
            this.placeData.raceType !== RaceType.AUTORACE &&
            this.placeData.raceType !== RaceType.BOATRACE
        ) {
            throw new Error(
                'grade is only available for KEIRIN/AUTORACE/BOATRACE',
            );
        }
        if (this._grade === undefined) {
            throw new Error('grade is missing for this race type');
        }
        return this._grade;
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<PlaceEntity> = {}): PlaceEntity {
        return PlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
            partial.heldDayData ?? this._heldDayData,
            partial.grade ?? this._grade,
        );
    }
}
