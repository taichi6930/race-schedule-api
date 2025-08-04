import { PlaceData } from '../../domain/placeData';
import { PlaceEntity } from '../../repository/entity/autoracePlaceEntity';
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
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord レース開催場所データ
 */
export class PlaceRecord implements IRecord<PlaceRecord> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceType - レース種別
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly raceType: RaceType,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
        public readonly grade: GradeType,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceType - レース種別
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param updateDate - 更新日時
     */
    public static create(
        id: PlaceId,
        raceType: RaceType,
        dateTime: Date,
        location: string,
        grade: string,
        updateDate: Date,
    ): PlaceRecord {
        try {
            return new PlaceRecord(
                validatePlaceId(RaceType.AUTORACE, id),
                raceType,
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
    public copy(partial: Partial<PlaceRecord> = {}): PlaceRecord {
        return PlaceRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * PlaceEntityに変換する
     */
    public toEntity(): PlaceEntity {
        return PlaceEntity.create(
            this.id,
            this.raceType,
            PlaceData.create(
                this.raceType,
                this.dateTime,
                this.location,
                this.grade,
            ),
            this.updateDate,
        );
    }
}
