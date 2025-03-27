import type { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinPlaceRecord } from '../../gateway/record/keirinPlaceRecord';
import {
    type KeirinPlaceId,
    validateKeirinPlaceId,
} from '../../utility/data/keirin/keirinPlaceId';
import { generateKeirinPlaceId } from '../../utility/raceId';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity 競輪のレース開催場所データ
 */
export class KeirinPlaceEntity implements IPlaceEntity<KeirinPlaceEntity> {
    /**
     * コンストラクタ
     * @remarks
     * レース開催場所データを生成する
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: KeirinPlaceId,
        public readonly placeData: KeirinPlaceData,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        placeData: KeirinPlaceData,
        updateDate: Date,
    ): KeirinPlaceEntity {
        return new KeirinPlaceEntity(
            validateKeirinPlaceId(id),
            placeData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     */
    public static createWithoutId(
        placeData: KeirinPlaceData,
        updateDate: Date,
    ): KeirinPlaceEntity {
        return KeirinPlaceEntity.create(
            generateKeirinPlaceId(placeData.dateTime, placeData.location),
            placeData,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<KeirinPlaceEntity> = {}): KeirinPlaceEntity {
        return KeirinPlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * KeirinPlaceRecordに変換する
     */
    public toRecord(): KeirinPlaceRecord {
        return KeirinPlaceRecord.create(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.placeData.grade,
            this.updateDate,
        );
    }
}
