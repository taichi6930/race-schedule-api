import { z } from 'zod';

/**
 * RaceDistanceのzod型定義
 */
const RaceDistanceSchema = z
    .number()
    .positive('距離は0よりも大きい必要があります');

/**
 * RaceDistanceの型定義
 */
export type RaceDistance = z.infer<typeof RaceDistanceSchema>;

/**
 * 競馬の距離をバリデーションする
 * @param distance - 距離
 */
export const validateRaceDistance = (distance: number): RaceDistance =>
    RaceDistanceSchema.parse(distance);
