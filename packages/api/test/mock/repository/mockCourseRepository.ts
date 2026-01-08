import { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';
import { ICourseRepository } from '../../../src/repository/interface/ICourseRepository';
import { RaceCourseMasterList } from './../../../../shared/src/utilities/course';

export const mockCourseRepository = (): jest.Mocked<ICourseRepository> => {
    return {
        findAllByCourseCodeTypeList: jest
            .fn()
            .mockImplementation(
                async (courseCodeTypeList: CourseCodeType[]) => {
                    return RaceCourseMasterList.filter((c: any) =>
                        courseCodeTypeList.includes(c.courseCodeType),
                    );
                },
            ),
    };
};
