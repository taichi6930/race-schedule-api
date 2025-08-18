import type { HeldDayData } from '../../domain/heldDayData';
import type { PlaceData } from '../../domain/placeData';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import type { GradeType } from '../../utility/data/common/gradeType';
import type { PlaceId } from '../../utility/data/common/placeId';
import {
    generatePlaceId,
    validatePlaceId,
} from '../../utility/data/common/placeId';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity 競馬のレース開催場所データ
 */
export class PlaceEntity implements IPlaceEntity<PlaceEntity> {
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
        public readonly id: PlaceId,
        public readonly placeData: PlaceData,
        heldDayData: HeldDayData | undefined,
        grade: GradeType | undefined,
        public readonly updateDate: UpdateDate,
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
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        placeData: PlaceData,
        heldDayData: HeldDayData | undefined,
        grade: GradeType | undefined,
        updateDate: Date,
    ): PlaceEntity {
        try {
            // placeData.raceType が JRA の場合, heldDayDataがundefinedの時はエラー
            if (
                (placeData.raceType === RaceType.JRA &&
                    heldDayData === undefined) ||
                (placeData.raceType !== RaceType.JRA &&
                    heldDayData !== undefined)
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
                validatePlaceId(placeData.raceType, id),
                placeData,
                heldDayData,
                grade,
                validateUpdateDate(updateDate),
            );
        } catch {
            throw new Error(`Failed to create PlaceEntity:
                id: ${id},
                placeData: ${JSON.stringify(placeData)},
                heldDayData: ${JSON.stringify(heldDayData)},
                updateDate: ${JSON.stringify(updateDate)}
            `);
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
        updateDate: Date,
    ): PlaceEntity {
        return PlaceEntity.create(
            generatePlaceId(
                placeData.raceType,
                placeData.dateTime,
                placeData.location,
            ),
            placeData,
            heldDayData,
            grade,
            updateDate,
        );
    }

    /**
     * PlaceRecordに変換する
     */
    public toPlaceRecord(): PlaceRecord {
        return PlaceRecord.create(
            this.id,
            this.placeData.raceType,
            this.placeData.dateTime,
            this.placeData.location,
            this.updateDate,
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
            partial.updateDate ?? this.updateDate,
        );
    }
}
