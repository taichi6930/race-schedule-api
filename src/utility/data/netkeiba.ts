import { CourseCodeType, RaceCourseMasterList } from './course';

export const NetkeibaBabacodeMap: Record<string, string> =
    RaceCourseMasterList.filter(
        (course) => course.courseCodeType === CourseCodeType.NETKEIBA,
    ).reduce<Record<string, string>>((map, course) => {
        map[course.placeName] = course.placeCode;
        return map;
    }, {});
