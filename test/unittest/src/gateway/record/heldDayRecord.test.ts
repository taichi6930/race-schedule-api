import { heldDayRecord } from '../../../../../lib/src/gateway/record/heldDayRecord';
import { RaceType } from '../../../../../lib/src/utility/raceType';

/**
 * ディシジョンテーブル
 *
 * | No. | 操作   | id         | raceType   | heldTimes | heldDayTimes | updateDate         | 期待結果         | 備考                      |
 * |-----|--------|------------|------------|-----------|--------------|--------------------|------------------|---------------------------|
 * |  1  | create | 正常値      | 正常値     | 正常値    | 正常値       | 正常なDate         | 正常に生成       | 正常系                    |
 * |  2  | create | 不正値      | 正常値     | 正常値    | 正常値       | 正常なDate         | 例外発生         | idバリデーション失敗      |
 * |  3  | create | 正常値      | 正常値     | 不正値    | 正常値       | 正常なDate         | 例外発生         | heldTimesバリデ失敗       |
 * |  4  | create | 正常値      | 正常値     | 正常値    | 不正値       | 正常なDate         | 例外発生         | heldDayTimesバリデ失敗    |
 * |  5  | create | 正常値      | 正常値     | 正常値    | 正常値       | 不正なDate         | 例外発生         | updateDateバリデ失敗      |
 * |  6  | copy   | undefined   | undefined  | undefined | undefined    | undefined          | 全項目コピー     | デフォルトコピー          |
 * |  7  | copy   | 新しい値    | undefined  | undefined | undefined    | undefined          | idのみ変更       | 部分更新                  |
 * |  8  | copy   | undefined   | undefined  | 99        | undefined    | undefined          | heldTimes変更    | 部分更新                  |
 * |  9  | copy   | undefined   | undefined  | undefined | 99           | undefined          | heldDayTimes変更 | 部分更新                  |
 * | 10  | copy   | undefined   | undefined  | undefined | undefined    | 新しいDate         | updateDate変更   | 部分更新                  |
 * | 11  | copy   | undefined   | undefined  | 不正値    | undefined    | undefined          | 例外発生         | heldTimesバリデ失敗       |
 * | 12  | copy   | undefined   | undefined  | undefined | 不正値       | undefined          | 例外発生         | heldDayTimesバリデ失敗    |
 */

describe('heldDayRecord', () => {
    const validRaceType = RaceType.KEIRIN;
    const validId = 'keirin2024122205';
    const validHeldTimes = 1;
    const validHeldDayTimes = 1;
    const validUpdateDate = new Date('2024-01-01T12:00:00Z');

    it('正常値ですべて生成できる', () => {
        const record = heldDayRecord.create(
            validId,
            validRaceType,
            validHeldTimes,
            validHeldDayTimes,
            validUpdateDate,
        );
        expect(record).toBeInstanceOf(heldDayRecord);
        expect(record.id).toBe(validId);
        expect(record.raceType).toBe(validRaceType);
        expect(record.heldTimes).toBe(validHeldTimes);
        expect(record.heldDayTimes).toBe(validHeldDayTimes);
        expect(record.updateDate).toEqual(validUpdateDate);
    });

    it('idバリデーション失敗で例外', () => {
        expect(() =>
            heldDayRecord.create(
                'bad-id',
                validRaceType,
                validHeldTimes,
                validHeldDayTimes,
                validUpdateDate,
            ),
        ).toThrow();
    });

    it('heldTimesバリデーション失敗で例外', () => {
        expect(() =>
            heldDayRecord.create(
                validId,
                validRaceType,
                -1,
                validHeldDayTimes,
                validUpdateDate,
            ),
        ).toThrow();
    });

    it('heldDayTimesバリデーション失敗で例外', () => {
        expect(() =>
            heldDayRecord.create(
                validId,
                validRaceType,
                validHeldTimes,
                -1,
                validUpdateDate,
            ),
        ).toThrow();
    });

    it('updateDateバリデーション失敗で例外', () => {
        expect(() =>
            heldDayRecord.create(
                validId,
                validRaceType,
                validHeldTimes,
                validHeldDayTimes,
                new Date('bad-date'),
            ),
        ).toThrow();
    });

    it('copy: 全項目コピー（partial未指定）', () => {
        const base = heldDayRecord.create(
            validId,
            validRaceType,
            validHeldTimes,
            validHeldDayTimes,
            validUpdateDate,
        );
        const copied = base.copy();
        expect(copied).not.toBe(base);
        expect(copied).toEqual(base);
    });

    it('copy: idのみ変更', () => {
        const base = heldDayRecord.create(
            validId,
            validRaceType,
            validHeldTimes,
            validHeldDayTimes,
            validUpdateDate,
        );
        const nextId = 'keirin2024122206';
        const copied = base.copy({ id: nextId });
        expect(copied.id).toBe(nextId);
        expect(copied.raceType).toBe(base.raceType);
        expect(copied.heldTimes).toBe(base.heldTimes);
        expect(copied.heldDayTimes).toBe(base.heldDayTimes);
        expect(copied.updateDate).toEqual(base.updateDate);
    });

    it('copy: heldTimesのみ変更', () => {
        const base = heldDayRecord.create(
            validId,
            validRaceType,
            validHeldTimes,
            validHeldDayTimes,
            validUpdateDate,
        );
        const copied = base.copy({ heldTimes: 99 });
        expect(copied.heldTimes).toBe(99);
        expect(copied.heldDayTimes).toBe(base.heldDayTimes);
    });

    it('copy: heldDayTimesのみ変更', () => {
        const base = heldDayRecord.create(
            validId,
            validRaceType,
            validHeldTimes,
            validHeldDayTimes,
            validUpdateDate,
        );
        const copied = base.copy({ heldDayTimes: 99 });
        expect(copied.heldDayTimes).toBe(99);
        expect(copied.heldTimes).toBe(base.heldTimes);
    });

    it('copy: updateDateのみ変更', () => {
        const base = heldDayRecord.create(
            validId,
            validRaceType,
            validHeldTimes,
            validHeldDayTimes,
            validUpdateDate,
        );
        const nextDate = new Date('2025-01-01T00:00:00Z');
        const copied = base.copy({ updateDate: nextDate });
        expect(copied.updateDate).toEqual(nextDate);
    });

    it('copy: heldTimesバリデーション失敗で例外', () => {
        const base = heldDayRecord.create(
            validId,
            validRaceType,
            validHeldTimes,
            validHeldDayTimes,
            validUpdateDate,
        );
        expect(() => base.copy({ heldTimes: -1 })).toThrow();
    });

    it('copy: heldDayTimesバリデーション失敗で例外', () => {
        const base = heldDayRecord.create(
            validId,
            validRaceType,
            validHeldTimes,
            validHeldDayTimes,
            validUpdateDate,
        );
        expect(() => base.copy({ heldDayTimes: -1 })).toThrow();
    });
});
