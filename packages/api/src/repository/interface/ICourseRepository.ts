import type { Course, CourseCodeType } from '@race-schedule/shared';

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
