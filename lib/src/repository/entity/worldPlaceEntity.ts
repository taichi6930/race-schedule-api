import type { WorldPlaceData } from '../../domain/worldPlaceData';
import type { WorldPlaceId } from '../../utility/data/world/worldPlaceId';
import { generateWorldPlaceId } from '../../utility/raceId';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity 海外競馬のレース開催場所データ
 */
export class WorldPlaceEntity implements IPlaceEntity<WorldPlaceEntity> {
    /**
     * ID
     */
    public readonly id: WorldPlaceId;

    /**
     * コンストラクタ
     * @remarks
     * レース開催場所データを生成する
     * @param placeData - レース開催場所データ
     */
    public constructor(
        id: WorldPlaceId | null,
        public readonly placeData: WorldPlaceData,
    ) {
        this.id =
            id ?? generateWorldPlaceId(placeData.dateTime, placeData.location);
    }

    /**
     * インスタンス生成メソッド（Idなし）
     * @remarks
     * レース開催場所データを生成する
     * @param placeData - レース開催場所データ
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
