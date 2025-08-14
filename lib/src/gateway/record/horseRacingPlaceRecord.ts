import { PlaceData } from '../../domain/placeData';
import { HorseRacingPlaceEntity } from '../../repository/entity/horseRacingPlaceEntity';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import type { RaceCourse } from '../../utility/data/common/raceCourse';
import { validateRaceCourse } from '../../utility/data/common/raceCourse';
import type { RaceDateTime } from '../../utility/data/common/raceDateTime';
import { validateRaceDateTime } from '../../utility/data/common/raceDateTime';
import { createErrorMessage } from '../../utility/error';
import type { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord レース開催場所データ
 */
export class HorseRacingPlaceRecord implements IRecord<HorseRacingPlaceRecord> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceType - レース種別
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly raceType: RaceType,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceType - レース種別
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param updateDate - 更新日時
     */
    public static create(
        id: PlaceId,
        raceType: RaceType,
        dateTime: Date,
        location: string,
        updateDate: Date,
    ): HorseRacingPlaceRecord {
        try {
            return new HorseRacingPlaceRecord(
                validatePlaceId(raceType, id),
                raceType,
                validateRaceDateTime(dateTime),
                validateRaceCourse(raceType, location),
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
     * @param partial - 上書きする部分データ
     */
    public copy(
        partial: Partial<HorseRacingPlaceRecord> = {},
    ): HorseRacingPlaceRecord {
        return HorseRacingPlaceRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * PlaceEntityに変換する
     */
    public toEntity(): HorseRacingPlaceEntity {
        return HorseRacingPlaceEntity.create(
            this.id,
            this.raceType,
            PlaceData.create(this.raceType, this.dateTime, this.location),
            this.updateDate,
        );
    }
}
