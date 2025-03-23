import { z } from 'zod';

/**
 * BoatracePlaceIdのzod型定義
 * boatrace + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const BoatracePlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('boatrace');
    }, 'boatraceから始まる必要があります')
    .refine((value) => {
        return /^boatrace\d{10}$/.test(value);
    }, 'BoatracePlaceIdの形式ではありません');

/**
 * BoatracePlaceIdの型定義
 */
export type BoatracePlaceId = z.infer<typeof BoatracePlaceIdSchema>;

/**
 * BoatracePlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのBoatracePlaceId
 */
export const validateBoatracePlaceId = (value: string): BoatracePlaceId =>
    BoatracePlaceIdSchema.parse(value);
