import type { Course } from '@race-schedule/shared/src/types/course';
import type { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';

export interface ICourseService {
    fetch: (courseCodeTypeList: CourseCodeType[]) => Promise<Course[]>;
}
