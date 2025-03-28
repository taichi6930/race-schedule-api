import { z } from 'zod';

/**
 * NarRaceNameのzod型定義
 */
const NarRaceNameSchema = z.string().min(1, '空文字は許可されていません');

/**
 * NarRaceNameの型定義
 */
export type NarRaceName = z.infer<typeof NarRaceNameSchema>;

/**
 * 地方競馬のレース名のバリデーション
 * @param name - 地方競馬のレース名
 * @returns - バリデーション済みの地方競馬のレース名
 */
export const validateNarRaceName = (name: string): NarRaceName =>
    NarRaceNameSchema.parse(name);
