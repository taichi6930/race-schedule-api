import { PlaceMasterEntity } from '../../domain/entity/placeMasterEntity';

// SQLの戻り値型
export interface PlaceMasterRow {
    race_type: string;
    course_code_type: string;
    place_name: string;
    place_code: string;
    created_at: string;
    updated_at: string;
}

export const PlaceMasterMapper = {
    toEntity(row: PlaceMasterRow): PlaceMasterEntity {
        return PlaceMasterEntity.create({
            raceType: row.race_type,
            courseCodeType: row.course_code_type,
            placeName: row.place_name,
            placeCode: row.place_code,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        });
    },

    toRow(entity: PlaceMasterEntity): any {
        return {
            race_type: entity.raceType,
            course_code_type: entity.courseCodeType,
            place_name: entity.placeName,
            place_code: entity.placeCode,
            created_at: entity.createdAt.toISOString(),
            updated_at: entity.updatedAt.toISOString(),
        };
    },
};
