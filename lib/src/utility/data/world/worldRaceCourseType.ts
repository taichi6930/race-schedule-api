import type { RaceCourseType } from '../common/raceCourseType';
import {
    RaceCourseTypeList,
    RaceCourseTypeSchema,
} from '../common/raceCourseType';

export type WorldRaceCourseType = RaceCourseType;
export const validateWorldRaceCourseType = (
    type: string,
): WorldRaceCourseType => {
    if (!RaceCourseTypeList.has(type)) {
        throw new Error('海外競馬の馬場種別ではありません');
    }
    return RaceCourseTypeSchema.parse(type);
};
