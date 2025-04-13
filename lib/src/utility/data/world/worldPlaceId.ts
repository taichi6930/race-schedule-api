import { z } from 'zod';

/**
 * WorldPlaceIdのzod型定義
 * @private
 */
const WorldPlaceIdSchema = z
    .string()
    .refine((value) => {
        return value.startsWith('world');
    }, 'worldから始まる必要があります')
    .refine((value) => {
        return /^world\d{10}$/.test(value);
    }, 'WorldPlaceIdの形式ではありません');

/**
 * WorldPlaceIdの型定義
 *
 * 以下の形式の文字列:
 * - "world" で始まる
 * - その後に10桁の数字が続く
 *   - 最初の8桁: 開催日（YYYYMMDD形式）
 *   - 最後の2桁: 開催場所を表す番号
 *
 * 例: "world2024010101" （2024年1月1日の01番の開催場所）
 */
export type WorldPlaceId = z.infer<typeof WorldPlaceIdSchema>;

/**
 * WorldPlaceIdのバリデーション
 * @param value - バリデーション対象
 * @returns バリデーション済みのWorldPlaceId
 */
export const validateWorldPlaceId = (value: string): WorldPlaceId =>
    WorldPlaceIdSchema.parse(value);
