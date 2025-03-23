import { z } from 'zod';

/**
 * NarPlaceIdのzod型定義
 * nar + 8桁の数字（開催日） + 2桁の数字（開催場所）
 */
const NarPlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('nar');
    }, 'narから始まる必要があります')
    .refine((value) => {
        return /^nar\d{10}$/.test(value);
    }, 'NarPlaceIdの形式ではありません');

/**
 * NarPlaceIdの型定義
 */
export type NarPlaceId = z.infer<typeof NarPlaceIdSchema>;

/**
 * NarPlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのNarPlaceId
 */
export const validateNarPlaceId = (value: string): NarPlaceId =>
    NarPlaceIdSchema.parse(value);
