import { z } from 'zod';

/** AutoracePositionNumber zod型定義 */
const AutoracePositionNumberSchema = z
    .number()
    .int()
    .min(1, '枠番は1以上である必要があります')
    .max(8, '枠番は8以下である必要があります');
export type AutoracePositionNumber = z.infer<
    typeof AutoracePositionNumberSchema
>;
export const validateAutoracePositionNumber = (
    positionNumber: number,
): AutoracePositionNumber => AutoracePositionNumberSchema.parse(positionNumber);

/** BoatracePositionNumber zod型定義 */
const BoatracePositionNumberSchema = z
    .number()
    .int()
    .min(1, '枠番は1以上である必要があります')
    .max(6, '枠番は6以下である必要があります');
export type BoatracePositionNumber = z.infer<
    typeof BoatracePositionNumberSchema
>;
export const validateBoatracePositionNumber = (
    positionNumber: number,
): BoatracePositionNumber => BoatracePositionNumberSchema.parse(positionNumber);

/** KeirinPositionNumber zod型定義 */
const KeirinPositionNumberSchema = z
    .number()
    .int()
    .min(1, '枠番は1以上である必要があります')
    .max(9, '枠番は9以下である必要があります');
export type KeirinPositionNumber = z.infer<typeof KeirinPositionNumberSchema>;
export const validateKeirinPositionNumber = (
    positionNumber: number,
): KeirinPositionNumber => KeirinPositionNumberSchema.parse(positionNumber);
