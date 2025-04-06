import type { WorldPlaceData } from '../../domain/worldPlaceData';
import type { WorldPlaceId } from '../../utility/data/world/worldPlaceId';
import { generateWorldPlaceId } from '../../utility/raceId';
import type { IPlaceEntity } from './iPlaceEntity';

/**
 * Repository層のEntity 海外競馬のレース開催場所データ
 */
export class WorldPlaceEntity implements IPlaceEntity<WorldPlaceEntity> {
    /**
     * コンストラクタ
     * @remarks
     * レース開催場所データを生成する
     * @param id - ID
     * @param placeData - レース開催場所データ
     */
    public constructor(
        public readonly id: WorldPlaceId,
        public readonly placeData: WorldPlaceData,
    ) {}

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
