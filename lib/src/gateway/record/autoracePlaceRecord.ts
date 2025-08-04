import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import type { AutoraceGradeType } from '../../utility/data/common/gradeType';
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
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord オートレースのレース開催場所データ
 */
export class AutoracePlaceRecord implements IRecord<AutoracePlaceRecord> {
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
        public readonly grade: AutoraceGradeType,
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
        id: PlaceId,
        dateTime: Date,
        location: string,
        grade: string,
        updateDate: Date,
    ): AutoracePlaceRecord {
        try {
            return new AutoracePlaceRecord(
                validatePlaceId(RaceType.AUTORACE, id),
                validateRaceDateTime(dateTime),
                validateRaceCourse(RaceType.AUTORACE, location),
                validateGradeType(RaceType.AUTORACE, grade),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage(
                    'Failed to create AutoracePlaceRecord',
                    error,
                ),
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(
        partial: Partial<AutoracePlaceRecord> = {},
    ): AutoracePlaceRecord {
        return AutoracePlaceRecord.create(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * AutoracePlaceEntityに変換する
     */
    public toEntity(): AutoracePlaceEntity {
        return AutoracePlaceEntity.create(
            this.id,
            AutoracePlaceData.create(this.dateTime, this.location, this.grade),
            this.updateDate,
        );
    }
}
