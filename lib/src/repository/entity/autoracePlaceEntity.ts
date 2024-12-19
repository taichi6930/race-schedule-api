import type { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { AutoracePlaceRecord } from '../../gateway/record/autoracePlaceRecord';
import type { AutoracePlaceId } from '../../utility/raceId';
import { generateAutoracePlaceId } from '../../utility/raceId';

/**
 * Repository層のEntity オートレースのレース開催場所データ
 */
export class AutoracePlaceEntity {
    /**
     * ID
     */
    public readonly id: AutoracePlaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催場所データを生成する
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - オートレースのグレード
     * @param updateDate - 更新日時
     */
    constructor(
        id: AutoracePlaceId | null,
        public readonly placeData: AutoracePlaceData,
        public readonly updateDate: Date,
    ) {
        this.id =
            id ??
            generateAutoracePlaceId(placeData.dateTime, placeData.location);
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<AutoracePlaceEntity> = {}): AutoracePlaceEntity {
        return new AutoracePlaceEntity(
            partial.id ?? null,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * AutoracePlaceRecordに変換する
     * @returns
     */
    toRecord(): AutoracePlaceRecord {
        return new AutoracePlaceRecord(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.placeData.grade,
            this.updateDate,
        );
    }
}
