import { z } from 'zod';

/**
 * WorldRaceDistanceのzod型定義
 */
const WorldRaceDistanceSchema = z
    .number()
    .positive('距離は0よりも大きい必要があります');

/**
 * WorldRaceDistanceの型定義
 */
export type WorldRaceDistance = z.infer<typeof WorldRaceDistanceSchema>;

/**
 * 海外競馬の距離をバリデーションする
 * @param distance
 */
export const validateWorldRaceDistance = (
    distance: number,
): WorldRaceDistance => WorldRaceDistanceSchema.parse(distance);
