import type { Course } from '@race-schedule/shared/src/types/course';
import type { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';
import type { RaceType } from '@race-schedule/shared/src/types/raceType';
import { inject, injectable } from 'tsyringe';

import type {
    IDBGateway,
    SqlParameter,
} from '../../gateway/interface/IDBGateway';
import { ICourseRepository } from '../interface/ICourseRepository';

@injectable()
export class CourseRepository implements ICourseRepository {
    public constructor(
        @inject('DBGateway')
        private readonly dbGateway: IDBGateway,
    ) {}

    public async findAllByCourseCodeTypeList(
        courseCodeTypeList: CourseCodeType[],
    ): Promise<Course[]> {
        let sql = 'SELECT * FROM place_master';
        const params: SqlParameter[] = [];

        if (courseCodeTypeList.length > 0) {
            const placeholders = courseCodeTypeList.map(() => '?').join(', ');
            sql += ` WHERE course_code_type IN (${placeholders})`;
            params.push(...courseCodeTypeList);
        }

        const { results } = await this.dbGateway.queryAll(sql, params);
        return results.map((result) => {
            if (typeof result !== 'object' || result === null) {
                throw new Error('Invalid database row');
            }
            const row = result as Record<string, unknown>;
            return {
                raceType: row.raceType as RaceType,
                courseCodeType: row.courseCodeType as CourseCodeType,
                placeName: row.placeName as string,
                placeCode: row.placeCode as string,
            };
        });
    }
}
