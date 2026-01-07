import type { Course } from '@race-schedule/shared/src/types/course';
import type { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';

/**
 * 開催場データリポジトリのインターフェース定義
 */
export interface ICourseRepository {
    /**
     * PlaceMasterEntity の全件取得
     */
    findAllByCourseCodeTypeList: (
        courseCodeTypeList: CourseCodeType[],
    ) => Promise<Course[]>;
}
