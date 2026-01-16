import type { Course } from '@race-schedule/shared/src/types/course';
import type { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';
import type { RaceType } from '@race-schedule/shared/src/types/raceType';
import { inject, injectable } from 'tsyringe';

import { IDBGateway } from '../../gateway/interface/IDBGateway';
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
        const params: unknown[] = [];

        if (courseCodeTypeList.length > 0) {
            const placeholders = courseCodeTypeList.map(() => '?').join(', ');
            sql += ` WHERE course_code_type IN (${placeholders})`;
            params.push(...courseCodeTypeList);
        }

        const { results } = await this.dbGateway.queryAll(sql, params);
        // PlaceMasterMapper削除のため、resultを直接型変換
        return results.map((result) => ({
            raceType: result.raceType as RaceType,
            courseCodeType: result.courseCodeType as CourseCodeType,
            placeName: result.placeName,
            placeCode: result.placeCode,
        }));
    }
}
