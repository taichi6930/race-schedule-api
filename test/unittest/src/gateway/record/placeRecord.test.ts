/**
 * ディシジョンテーブル
 *
 * 【create/copy】
 * | No. | 操作   | id        | raceType | dateTime     | location | updateDate     | 期待結果                      | 備考                        |
 * |-----|--------|-----------|----------|--------------|----------|----------------|-------------------------------|-----------------------------|
 * |  1  | create | 正常値    | 正常値   | 正常なDate   | 正常値   | 正常なDate     | 正常に生成                    | 正常系                      |
 * |  2  | create | 不正値    | 正常値   | 正常なDate   | 正常値   | 正常なDate     | 例外発生                      | idバリデーション失敗       |
 * |  3  | create | 正常値    | 正常値   | 不正なDate   | 正常値   | 正常なDate     | 例外発生                      | dateTimeバリデーション失敗 |
 * |  4  | create | 正常値    | 正常値   | 正常なDate   | 不正値   | 正常なDate     | 例外発生                      | locationバリデーション失敗 |
 * |  5  | create | 正常値    | 正常値   | 正常なDate   | 正常値   | 不正なDate     | 例外発生                      | updateDateバリデーション失敗|
 * |  6  | copy   | -         | -        | -            | -        | -              | 全項目コピー（partial未指定）  | デフォルトコピー            |
 * |  7  | copy   | -         | -        | -            | 新しい値 | -              | Dateのみ変更              | 部分更新                    |
 * |  8  | copy   | -         | -        | -            | 不正値   | -              | 例外発生                      | locationバリデーション失敗 |
 */
import { describe, expect, it } from 'vitest';

import { PlaceRecord } from '../../../../../lib/src/gateway/record/placeRecord';
import { generatePlaceId } from '../../../../../lib/src/utility/data/common/placeId';
import {
    basePlaceRecord,
    defaultLocation,
    testRaceTypeListAll,
} from '../../mock/common/baseCommonData';

describe('PlaceRecord', () => {
    describe.each(testRaceTypeListAll)('%s', (raceType) => {
        const validDate = new Date('2024-12-29');
        const validLocation = defaultLocation[raceType];
        const validPlaceId = generatePlaceId(
            raceType,
            validDate,
            validLocation,
        );
        const validUpdateDate = new Date('2025-10-01T16:30:00Z');

        describe('PlaceRecord.create', () => {
            it('正常値ですべて生成できる', () => {
                const record = PlaceRecord.create(
                    validPlaceId,
                    raceType,
                    validDate,
                    validLocation,
                    validUpdateDate,
                );
                expect(record).toBeInstanceOf(PlaceRecord);
                expect(record.id).toBeDefined();
                expect(record.raceType).toBe(raceType);
                expect(record.dateTime).toBeDefined();
                expect(record.location).toBeDefined();
                expect(record.updateDate).toBeDefined();
            });

            it('idバリデーション失敗で例外', () => {
                expect(() =>
                    PlaceRecord.create(
                        'bad-id',
                        raceType,
                        validDate,
                        validLocation,
                        validUpdateDate,
                    ),
                ).toThrow('Failed to create PlaceRecord');
            });

            it('dateTimeバリデーション失敗で例外', () => {
                expect(() =>
                    PlaceRecord.create(
                        validPlaceId,
                        raceType,
                        new Date('bad-date'),
                        validLocation,
                        validUpdateDate,
                    ),
                ).toThrow('Failed to create PlaceRecord');
            });

            it('locationバリデーション失敗で例外', () => {
                expect(() =>
                    PlaceRecord.create(
                        validPlaceId,
                        raceType,
                        validDate,
                        'bad-location',
                        validUpdateDate,
                    ),
                ).toThrow('Failed to create PlaceRecord');
            });

            it('updateDateバリデーション失敗で例外', () => {
                expect(() =>
                    PlaceRecord.create(
                        validPlaceId,
                        raceType,
                        validDate,
                        validLocation,
                        new Date('bad-date'),
                    ),
                ).toThrow('Failed to create PlaceRecord');
            });
        });

        describe('PlaceRecord.copy', () => {
            const base = basePlaceRecord(raceType);

            it('全項目コピー（partial未指定）', () => {
                const copied = base.copy();
                expect(copied).not.toBe(base);
                expect(copied).toEqual(base);
            });

            it('Dateのみ変更', () => {
                const copied = base.copy({
                    dateTime: new Date('2025-01-01T00:00:00Z'),
                });
                expect(copied.id).toBe(base.id);
                expect(copied.raceType).toBe(base.raceType);
                expect(copied.dateTime).toStrictEqual(
                    new Date('2025-01-01T00:00:00Z'),
                );
                expect(copied.location).toBe(defaultLocation[raceType]);
                expect(copied.updateDate).toBe(base.updateDate);
            });

            it('locationバリデーション失敗で例外', () => {
                expect(() => base.copy({ location: '' })).toThrow(
                    'Failed to create PlaceRecord',
                );
            });
        });
    });
});
