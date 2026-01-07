import { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';
import { RaceCourseMasterList } from '@race-schedule/shared/src/utilities/course';
import { injectable } from 'tsyringe';

import { PlaceMasterEntity } from '../../domain/entity/placeMasterEntity';
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
    ): Promise<PlaceMasterEntity[]> {
        return RaceCourseMasterList.filter((c: any) =>
            courseCodeTypeList.includes(c.courseCodeType),
        ).map((c: any) => {
            const entity = PlaceMasterEntity.create({
                raceType: c.raceType,
                courseCodeType: c.courseCodeType,
                placeName: c.placeName,
                placeCode: c.placeCode,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return entity;
        });
    }
}
