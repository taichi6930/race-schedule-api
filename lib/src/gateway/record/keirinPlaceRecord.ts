import { PlaceData } from '../../domain/placeData';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import type { GradeType } from '../../utility/data/common/gradeType';
import { validateGradeType } from '../../utility/data/common/gradeType';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import {
    type RaceCourse,
    validateRaceCourse,
} from '../../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../../utility/data/common/raceDateTime';
import { createErrorMessage } from '../../utility/error';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord 競輪のレース開催場所データ
 */
export class KeirinPlaceRecord implements IRecord<KeirinPlaceRecord> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
        public readonly grade: GradeType,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        dateTime: Date,
        location: string,
        grade: string,
        updateDate: Date,
    ): KeirinPlaceRecord {
        try {
            return new KeirinPlaceRecord(
                validatePlaceId(RaceType.KEIRIN, id),
                validateRaceDateTime(dateTime),
                validateRaceCourse(RaceType.KEIRIN, location),
                validateGradeType(RaceType.KEIRIN, grade),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('KeirinPlaceRecord create error', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<KeirinPlaceRecord> = {}): KeirinPlaceRecord {
        return KeirinPlaceRecord.create(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * Entityに変換する
     */
    public toEntity(): PlaceEntity {
        return PlaceEntity.create(
            this.id,
            RaceType.KEIRIN,
            PlaceData.create(
                RaceType.KEIRIN,
                this.dateTime,
                this.location,
                this.grade,
            ),
            this.updateDate,
        );
    }
}
