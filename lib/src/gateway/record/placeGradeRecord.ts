import type { RaceType } from '../../../../src/utility/raceType';
import { createErrorMessage } from '../../utility/error';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { GradeType } from '../../utility/validateAndType/gradeType';
import { validateGradeType } from '../../utility/validateAndType/gradeType';
import type { PlaceId } from '../../utility/validateAndType/placeId';
import { validatePlaceId } from '../../utility/validateAndType/placeId';

/**
 * Repository層のRecord レース開催場所データ
 */
export class PlaceGradeRecord {
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceType - レース種別
     * @param grade - グレード
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly raceType: RaceType,
        public readonly grade: GradeType,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceType - レース種別
     * @param grade - グレード
     * @param updateDate - 更新日時
     */
    public static create(
        id: PlaceId,
        raceType: RaceType,
        grade: string,
        updateDate: Date,
    ): PlaceGradeRecord {
        try {
            return new PlaceGradeRecord(
                validatePlaceId(raceType, id),
                raceType,
                validateGradeType(raceType, grade),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('Failed to create PlaceGradeRecord', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<PlaceGradeRecord> = {}): PlaceGradeRecord {
        return PlaceGradeRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }
}
