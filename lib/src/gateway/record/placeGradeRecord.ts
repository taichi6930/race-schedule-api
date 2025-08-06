import {
    type GradeType,
    validateGradeType,
} from '../../utility/data/common/gradeType';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import { createErrorMessage } from '../../utility/error';
import type { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord レース開催場所のグレードデータ
 */
export class PlaceGradeRecord implements IRecord<PlaceGradeRecord> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceType - レース種別
     * @param grade - レースグレード
     * @param updateDate - 更新日時
     * @remarks
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
     * @param grade - レースグレード
     * @param updateDate - 更新日時
     */
    public static create(
        id: PlaceId,
        raceType: RaceType,
        grade: GradeType,
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
                createErrorMessage('Failed to create PlaceRecord', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial
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
