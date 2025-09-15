import { PlaceData } from '../../../../src/domain/placeData';
import type { RaceType } from '../../../../src/utility/raceType';
import {
    IdType,
    type PublicGamblingId,
    validateId,
} from '../../../../src/utility/validateAndType/idUtility';
import type { RaceCourse } from '../../../../src/utility/validateAndType/raceCourse';
import { validateRaceCourse } from '../../../../src/utility/validateAndType/raceCourse';
import type { RaceDateTime } from '../../../../src/utility/validateAndType/raceDateTime';
import { validateRaceDateTime } from '../../../../src/utility/validateAndType/raceDateTime';
import { createErrorMessage } from '../../utility/error';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';

/**
 * Repository層のRecord レース開催場所データ
 */
export class PlaceRecord {
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
        public readonly id: PublicGamblingId,
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
        id: PublicGamblingId,
        raceType: RaceType,
        dateTime: Date,
        location: string,
        updateDate: Date,
    ): PlaceRecord {
        try {
            return new PlaceRecord(
                validateId(IdType.PLACE, raceType, id),
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
    public copy(partial: Partial<PlaceRecord> = {}): PlaceRecord {
        return PlaceRecord.create(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * PlaceDataに変換する
     */
    public toPlaceData(): PlaceData {
        return PlaceData.create(this.raceType, this.dateTime, this.location);
    }
}
