import type { Course } from '@race-schedule/shared/src/types/course';
import type { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';

/**
 * 開催場データリポジトリのインターフェース定義
 */
export interface ICourseRepository {
    /**
     * コースコード種別リストで全開催場データを取得
     * @param courseCodeTypeList - コースコード種別リスト
     * @return 開催場データリスト
     */
    findAllByCourseCodeTypeList: (
        courseCodeTypeList: CourseCodeType[],
    ) => Promise<Course[]>;
}
