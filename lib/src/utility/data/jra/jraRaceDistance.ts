import { z } from 'zod';

/**
 * JraRaceDistanceのzod型定義
 */
const JraRaceDistanceSchema = z
    .number()
    .positive('距離は0よりも大きい必要があります');

/**
 * JraRaceDistanceの型定義
 */
export type JraRaceDistance = z.infer<typeof JraRaceDistanceSchema>;

/**
 * 中央競馬の距離をバリデーションする
 * @param distance
 */
export const validateJraRaceDistance = (distance: number): JraRaceDistance =>
    JraRaceDistanceSchema.parse(distance);
