import type { RaceCourseType } from '../common/raceCourseType';
import {
    RaceCourseTypeList,
    RaceCourseTypeSchema,
} from '../common/raceCourseType';

export type JraRaceCourseType = RaceCourseType;
export const validateJraRaceCourseType = (type: string): JraRaceCourseType => {
    if (!RaceCourseTypeList.has(type)) {
        throw new Error('中央競馬の馬場種別ではありません');
    }
    return RaceCourseTypeSchema.parse(type);
};
