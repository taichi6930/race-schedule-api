import { JraPlaceData } from '../../domain/jraPlaceData';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import {
    type RaceCourse,
    validateRaceCourse,
} from '../../utility/data/common/raceCourse';
import type { RaceDateTime } from '../../utility/data/common/raceDateTime';
import { validateRaceDateTime } from '../../utility/data/common/raceDateTime';
import {
    type JraHeldDayTimes,
    validateJraHeldDayTimes,
} from '../../utility/data/jra/jraHeldDayTimes';
import type { JraHeldTimes } from '../../utility/data/jra/jraHeldTimes';
import { validateJraHeldTimes } from '../../utility/data/jra/jraHeldTimes';
import { createErrorMessage } from '../../utility/error';
import { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord 中央競馬のレース開催場所データ
 */
export class JraPlaceRecord implements IRecord<JraPlaceRecord> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly dateTime: RaceDateTime,
        public readonly location: RaceCourse,
        public readonly heldTimes: JraHeldTimes,
        public readonly heldDayTimes: JraHeldDayTimes,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param heldTimes - 開催回数
     * @param heldDayTimes - 開催日数
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        dateTime: Date,
        location: string,
        heldTimes: number,
        heldDayTimes: number,
        updateDate: Date,
    ): JraPlaceRecord {
        try {
            return new JraPlaceRecord(
                validatePlaceId(RaceType.JRA, id),
                validateRaceDateTime(dateTime),
                validateRaceCourse(RaceType.JRA, location),
                validateJraHeldTimes(heldTimes),
                validateJraHeldDayTimes(heldDayTimes),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                createErrorMessage('JraPlaceRecord create error', error),
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<JraPlaceRecord> = {}): JraPlaceRecord {
        return JraPlaceRecord.create(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.heldTimes ?? this.heldTimes,
            partial.heldDayTimes ?? this.heldDayTimes,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * Entityに変換する
     */
    public toEntity(): JraPlaceEntity {
        return JraPlaceEntity.create(
            this.id,
            JraPlaceData.create(
                this.dateTime,
                this.location,
                this.heldTimes,
                this.heldDayTimes,
            ),
            this.updateDate,
        );
    }
}
