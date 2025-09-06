import type { PlaceData } from '../../../lib/src/domain/placeData';
import type { PlaceId } from '../../../lib/src/utility/validateAndType/placeId';
import {
    generatePlaceId,
    validatePlaceId,
} from '../../../lib/src/utility/validateAndType/placeId';

export class PlaceEntity {
    private constructor(
        public readonly id: PlaceId,
        public readonly placeData: PlaceData,
    ) {}

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
