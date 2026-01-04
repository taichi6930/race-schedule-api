import type { Course } from '@race-schedule/shared/src/types/course';
import type { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';

import type { ICourseRepository } from '../repository/interface/ICourseRepository';

/**
 * コース情報のビジネスロジックを担うサービスクラス
 */
export class CourseService {
    public constructor(private readonly courseRepository: ICourseRepository) {}

    /**
     * コースコード種別リストで全開催場データを取得
     * @param courseCodeTypeList - コースコード種別リスト
     * @return 開催場データリスト
     */
    public async fetch(
        courseCodeTypeList: CourseCodeType[],
    ): Promise<Course[]> {
        return this.courseRepository.findAllByCourseCodeTypeList(
            courseCodeTypeList,
        );
    }
}
