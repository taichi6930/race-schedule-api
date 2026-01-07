import type { Course } from '@race-schedule/shared/src/types/course';
import type { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';
import type { RaceType } from '@race-schedule/shared/src/types/raceType';
import { inject, injectable } from 'tsyringe';

import { PlaceMasterEntity } from '../../domain/entity/placeMasterEntity';
import { IDBGateway } from '../../gateway/interface/IDBGateway';
import { ICourseRepository } from '../interface/ICourseRepository';
import { PlaceMasterMapper } from '../mapper/placeMasterMapper';

@injectable()
export class CourseRepositoryFromStorage implements ICourseRepository {
    public constructor(
        @inject('DBGateway')
        private readonly dbGateway: IDBGateway,
    ) {}

    public async findAllByCourseCodeTypeList(
        courseCodeTypeList: CourseCodeType[],
    ): Promise<Course[]> {
        let sql = 'SELECT * FROM place_master';
        const params: unknown[] = [];

        if (courseCodeTypeList.length > 0) {
            const placeholders = courseCodeTypeList.map(() => '?').join(', ');
            sql += ` WHERE course_code_type IN (${placeholders})`;
            params.push(...courseCodeTypeList);
        }

        const { results } = await this.dbGateway.queryAll(sql, params);
        return results
            .map((result) => PlaceMasterMapper.toEntity(result))
            .map((entity: PlaceMasterEntity) => ({
                raceType: entity.raceType as RaceType,
                courseCodeType: entity.courseCodeType as CourseCodeType,
                placeName: entity.placeName,
                placeCode: entity.placeCode,
            }));
    }
}
