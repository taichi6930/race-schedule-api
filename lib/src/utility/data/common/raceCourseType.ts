import { z } from 'zod';

const RaceCourseTypeList = new Set(['芝', 'ダート', '障害', 'AW']);


const RaceCourseTypeSchema = z.string().refine((value) => {
    return RaceCourseTypeList.has(value);
}, '有効な競馬場種別ではありません');


export type RaceCourseType = z.infer<typeof RaceCourseTypeSchema>;


export const validateRaceCourseType = (type: string): RaceCourseType => {
    return RaceCourseTypeSchema.parse(type);
};
