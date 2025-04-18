import { z } from 'zod';

/**
 * NarRaceDistanceのzod型定義
 */
const NarRaceDistanceSchema = z
    .number()
    .positive('距離は0よりも大きい必要があります');

/**
 * NarRaceDistanceの型定義
 */
export type NarRaceDistance = z.infer<typeof NarRaceDistanceSchema>;

/**
 * 地方競馬の距離をバリデーションする
 * @param distance
 */
export const validateNarRaceDistance = (distance: number): NarRaceDistance =>
    NarRaceDistanceSchema.parse(distance);
