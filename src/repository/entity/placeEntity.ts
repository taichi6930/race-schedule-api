import type { PlaceData } from '../../../lib/src/domain/placeData';
import type { PlaceId } from '../../../lib/src/utility/validateAndType/placeId';
import {
    generatePlaceId,
    validatePlaceId,
} from '../../../lib/src/utility/validateAndType/placeId';

/**
 * Repository層のEntity 競馬のレース開催場所データ
 */
export class PlaceEntity {
    /**
     * コンストラクタ
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly placeData: PlaceData,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param placeData - レース開催場所データ
     */
    public static create(id: string, placeData: PlaceData): PlaceEntity {
        try {
            return new PlaceEntity(
                validatePlaceId(placeData.raceType, id),
                placeData,
            );
        } catch {
            throw new Error(`Failed to create PlaceEntity:
                id: ${id},
                placeData: ${JSON.stringify(placeData)},
            `);
        }
    }

    /**
     * idがない場合でのcreate
     * @param placeData - レース開催場所データ
     */
    public static createWithoutId(placeData: PlaceData): PlaceEntity {
        return PlaceEntity.create(
            generatePlaceId(
                placeData.raceType,
                placeData.dateTime,
                placeData.location,
            ),
            placeData,
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<PlaceEntity> = {}): PlaceEntity {
        return PlaceEntity.create(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
        );
    }
}
