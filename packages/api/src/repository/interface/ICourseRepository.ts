import type { CourseCodeType } from '@race-schedule/shared';

import type { PlaceMasterEntity } from '../../domain/entity/placeMasterEntity';

/**
 * 開催場データリポジトリのインターフェース定義
 */
export interface ICourseRepository {
    /**
     * PlaceMasterEntity の全件取得
     */
    findAllByCourseCodeTypeList: (
        courseCodeTypeList: CourseCodeType[],
    ) => Promise<PlaceMasterEntity[]>;
}
