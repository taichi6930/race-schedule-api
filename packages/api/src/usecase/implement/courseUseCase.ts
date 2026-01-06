import type { Course } from '@race-schedule/shared/src/types/course';
import type { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';
import { inject, injectable } from 'tsyringe';

import type { ICourseService } from '../../service/interface/ICourseService';
import type { ICourseUseCase } from '../interface/ICourseUseCase';

/**
 * Course に関する業務ロジック（UseCase）
 */
@injectable()
export class CourseUseCase implements ICourseUseCase {
    public constructor(
        @inject('CourseService')
        private readonly courseService: ICourseService,
    ) {}

    /**
     * コース一覧を取得する
     * @param courseCodeTypeList - コースコード種別リスト
     * @return コース一覧
     */
    public async fetch(
        courseCodeTypeList: CourseCodeType[],
    ): Promise<Course[]> {
        return this.courseService.fetch(courseCodeTypeList);
    }
}
