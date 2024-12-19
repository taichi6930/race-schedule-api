import type { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { BoatracePlaceRecord } from '../../gateway/record/boatracePlaceRecord';
import type { BoatracePlaceId } from '../../utility/raceId';
import { generateBoatracePlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity ボートレースのレース開催場所データ
 */
export class BoatracePlaceEntity {
    /**
     * ID
     */
    public readonly id: BoatracePlaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催場所データを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - ボートレースのグレード
     * @param updateDate - 更新日時
     */
    constructor(
        id: BoatracePlaceId | null,
        public readonly placeData: BoatracePlaceData,
        public readonly updateDate: Date,
    ) {
        this.id =
            id ??
            generateBoatracePlaceId(placeData.dateTime, placeData.location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<BoatracePlaceEntity> = {}): BoatracePlaceEntity {
        return new BoatracePlaceEntity(
            partial.id ?? null,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * BoatracePlaceRecordに変換する
     * @returns
     */
    toRecord(): BoatracePlaceRecord {
        return new BoatracePlaceRecord(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.placeData.grade,
            this.updateDate,
        );
    }
}
