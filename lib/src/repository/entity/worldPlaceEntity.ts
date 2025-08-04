import type { WorldPlaceData } from '../../domain/worldPlaceData';
import type { PlaceId } from '../../utility/data/common/placeId';
import { generateWorldPlaceId } from '../../utility/raceId';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity 海外競馬のレース開催場所データ
 */
export class WorldPlaceEntity implements IPlaceEntity<WorldPlaceEntity> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param placeData - レース開催場所データ
     * @remarks
     * レース開催場所データを生成する
     */
    private constructor(
        public readonly id: PlaceId,
        public readonly placeData: WorldPlaceData,
    ) {}

    /**
     * インスタンス生成メソッド（Idなし）
     * @param placeData - レース開催場所データ
     * @remarks
     * レース開催場所データを生成する
     */
    public static createWithoutId(placeData: WorldPlaceData): WorldPlaceEntity {
        return new WorldPlaceEntity(
            generateWorldPlaceId(placeData.dateTime, placeData.location),
            placeData,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<WorldPlaceEntity> = {}): WorldPlaceEntity {
        return new WorldPlaceEntity(
            partial.id ?? this.id,
            partial.placeData ?? this.placeData,
        );
    }
}
