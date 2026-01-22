import type { PlaceDisplayDto } from '@race-schedule/shared/src/dto/placeDisplayDto';
import type { PlaceEntity } from '@race-schedule/shared/src/entity/placeEntity';

/**
 * PlaceEntity → PlaceDisplayDto へのマッパー
 */
export class PlaceDtoMapper {
    /**
     * PlaceEntityをPlaceDisplayDtoに変換する
     * @param entity - PlaceEntity
     * @returns PlaceDisplayDto
     */
    public static toDisplayDto(entity: PlaceEntity): PlaceDisplayDto {
        return {
            placeId: entity.placeId,
            raceType: entity.raceType,
            datetime: entity.datetime,
            placeName: entity.placeName,
            placeGrade: entity.placeGrade,
            placeHeldDays: entity.placeHeldDays,
        };
    }

    /**
     * PlaceEntity配列をPlaceDisplayDto配列に変換する
     * @param entities - PlaceEntity配列
     * @returns PlaceDisplayDto配列
     */
    public static toDisplayDtoList(entities: PlaceEntity[]): PlaceDisplayDto[] {
        return entities.map((entity) => this.toDisplayDto(entity));
    }

    /**
     * PlaceEntity配列をlocationListでフィルタリングしてPlaceDisplayDto配列に変換する
     * @param entities - PlaceEntity配列
     * @param locationList - フィルタするlocationCodeのリスト（undefinedの場合フィルタなし）
     * @returns PlaceDisplayDto配列
     */
    public static toFilteredDisplayDtoList(
        entities: PlaceEntity[],
        locationList?: string[],
    ): PlaceDisplayDto[] {
        const filtered =
            locationList && locationList.length > 0
                ? entities.filter(
                      (e) => e.locationCode && locationList.includes(e.locationCode),
                  )
                : entities;

        return this.toDisplayDtoList(filtered);
    }
}
