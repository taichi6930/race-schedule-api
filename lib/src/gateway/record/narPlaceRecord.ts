import { PlaceData } from '../../domain/placeData';
import { PlaceEntity } from '../../repository/entity/placeEntity';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import type { RaceCourse } from '../../utility/data/common/raceCourse';
import { validateRaceCourse } from '../../utility/data/common/raceCourse';
import {
    type RaceDateTime,
    validateRaceDateTime,
} from '../../utility/data/common/raceDateTime';
import { createErrorMessage } from '../../utility/error';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord 地方競馬のレース開催場所データ
 */
export class NarPlaceRecord implements IRecord<NarPlaceRecord> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        dateTime: Date,
        location: string,
        updateDate: Date,
    ): NarPlaceRecord {
        try {
            return new NarPlaceRecord(
                validatePlaceId(RaceType.NAR, id),
                validateRaceDateTime(dateTime),
                validateRaceCourse(RaceType.NAR, location),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('NarPlaceRecord create error', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<NarPlaceRecord> = {}): NarPlaceRecord {
        return NarPlaceRecord.create(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * Entityに変換する
     */
    public toEntity(): PlaceEntity {
        return PlaceEntity.create(
            this.id,
            RaceType.NAR,
            PlaceData.create(RaceType.NAR, this.dateTime, this.location),
            this.updateDate,
        );
    }
}
