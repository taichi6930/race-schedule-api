import { Course } from '@race-schedule/shared/src/types/course';
import { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';
import { inject, injectable } from 'tsyringe';

import { ICourseRepository } from '../../repository/interface/ICourseRepository';
import { ICourseService } from '../interface/ICourseService';

/**
 * 開催場データサービスの実装
 */
@injectable()
export class CourseService implements ICourseService {
    public constructor(
        @inject('ICourseRepository')
        private readonly courseRepository: ICourseRepository,
    ) {}

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
