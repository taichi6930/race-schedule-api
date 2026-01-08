import type { Course } from '@race-schedule/shared/src/types/course';
import type { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';

/**
 * Course に関する業務ロジック（Usecase）のインターフェース定義
 */
export interface ICourseUsecase {
    /**
     * コース一覧を取得する
     * @param courseCodeTypeList - コースコード種別リスト
     * @return コース一覧
     */
    fetch: (courseCodeTypeList: CourseCodeType[]) => Promise<Course[]>;
}
