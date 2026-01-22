import type { RaceEntity } from '@race-schedule/shared/src/entity/raceEntity';

/**
 * RaceEntity → DTO（API Response）へのマッパー
 */
export class RaceDtoMapper {
    /**
     * RaceEntityを公開用DTOに変換する（locationCodeを除外）
     * @param entity - RaceEntity
     * @returns 公開用DTO
     */
    public static toDisplayDto(entity: RaceEntity): Omit<RaceEntity, 'locationCode'> {
        return {
            raceId: entity.raceId,
            placeId: entity.placeId,
            raceType: entity.raceType,
            datetime: entity.datetime,
            placeName: entity.placeName,
            raceNumber: entity.raceNumber,
            placeHeldDays: entity.placeHeldDays,
        };
    }

    /**
     * RaceEntity配列を公開用DTO配列に変換する
     * @param entities - RaceEntity配列
     * @returns 公開用DTO配列
     */
    public static toDisplayDtoList(
        entities: RaceEntity[],
    ): Array<Omit<RaceEntity, 'locationCode'>> {
        return entities.map((entity) => this.toDisplayDto(entity));
    }

    /**
     * RaceEntity配列をlocationListでフィルタリングして公開用DTO配列に変換する
     * @param entities - RaceEntity配列
     * @param locationList - フィルタするlocationCodeのリスト（undefinedの場合フィルタなし）
     * @returns 公開用DTO配列
     */
    public static toFilteredDisplayDtoList(
        entities: RaceEntity[],
        locationList?: string[],
    ): Array<Omit<RaceEntity, 'locationCode'>> {
        const filtered =
            locationList && locationList.length > 0
                ? entities.filter(
                      (e) => e.locationCode && locationList.includes(e.locationCode),
                  )
                : entities;

        return this.toDisplayDtoList(filtered);
    }
}
