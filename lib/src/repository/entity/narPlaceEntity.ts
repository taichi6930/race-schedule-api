import type { NarPlaceData } from '../../domain/narPlaceData';
import { NarPlaceRecord } from '../../gateway/record/narPlaceRecord';
import type { PlaceId } from '../../utility/data/common/placeId';
import { validatePlaceId } from '../../utility/data/common/placeId';
import { generatePlaceId } from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity 地方競馬のレース開催場所データ
 */
export class NarPlaceEntity implements IPlaceEntity<NarPlaceEntity> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @param updateDate - 更新日時
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly placeData: NarPlaceData,
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
        placeData: NarPlaceData,
        updateDate: Date,
    ): NarPlaceEntity {
        return new NarPlaceEntity(
            validatePlaceId(RaceType.NAR, id),
            placeData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param placeData
     * @param updateDate
     */
    public static createWithoutId(
        placeData: NarPlaceData,
        updateDate: Date,
    ): NarPlaceEntity {
        return NarPlaceEntity.create(
            generatePlaceId(
                RaceType.NAR,
                placeData.dateTime,
                placeData.location,
            ),
            placeData,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<NarPlaceEntity> = {}): NarPlaceEntity {
        return NarPlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * NarPlaceRecordに変換する
     */
    public toRecord(): NarPlaceRecord {
        return NarPlaceRecord.create(
            this.id,
            this.placeData.dateTime,
            this.placeData.location,
            this.updateDate,
        );
    }
}
