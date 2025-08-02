import type { RaceCourseType } from '../common/raceCourseType';
import {
    RaceCourseTypeList,
    RaceCourseTypeSchema,
} from '../common/raceCourseType';

export type NarRaceCourseType = RaceCourseType;
export const validateNarRaceCourseType = (type: string): NarRaceCourseType => {
    if (!RaceCourseTypeList.has(type)) {
        throw new Error('地方競馬の馬場種別ではありません');
    }
    return RaceCourseTypeSchema.parse(type);
};
