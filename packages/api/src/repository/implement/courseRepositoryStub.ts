import { Course } from '@race-schedule/shared';
import { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';
import { RaceCourseMasterList } from '@race-schedule/shared/src/utilities/course';
import { injectable } from 'tsyringe';

import type { ICourseRepository } from '../interface/ICourseRepository';

/**
 * 開催場データリポジトリのStub実装
 */
@injectable()
export class CourseRepositoryStub implements ICourseRepository {
    /**
     * コースコード種別リストで全開催場データを取得
     * @param courseCodeTypeList - コースコード種別リスト
     * @return 開催場データリスト
     */
    public async findAllByCourseCodeTypeList(
        courseCodeTypeList: CourseCodeType[],
    ): Promise<Course[]> {
        return RaceCourseMasterList.filter((c: any) =>
            courseCodeTypeList.includes(c.courseCodeType),
        );
    }
}
