/**
 * HeldDayData ディシジョンテーブル
 * |No|heldTimes|heldDayTimes|partialの内容|期待結果|備考|
 * |--|---------|------------|-------------|--------|----|
 * |1 |有効     |有効        | -           |OK      |正常系|
 * |2 |無効     |有効        | -           |Error   |heldTimesバリデーション|
 * |3 |有効     |無効        | -           |Error   |heldDayTimesバリデーション|
 * |4 |無効     |無効        | -           |Error   |両方バリデーション|
 * |5 |有効     |有効        |{ heldTimes: 2, heldDayTimes: 3 }|copyで値変更OK|copy正常系|
 * |6 |有効     |有効        |{ heldTimes: 0 }, { heldDayTimes: 0 }|copyで不正値→Error|copy異常系|
 * |7 |有効     |有効        |{} または undefined|全プロパティ同値|copyでpartial空|
 */
import { HeldDayData } from '../../../../lib/src/domain/heldDayData';
import { validateHeldDayTimes } from '../../../../lib/src/utility/data/common/heldDayTimes';
import { validateHeldTimes } from '../../../../lib/src/utility/data/common/heldTimes';

describe('HeldDayDataクラスのテスト', () => {
    const validHeldTimes = 1; // 仮: 有効値
    const invalidHeldTimes = 0; // 仮: 無効値
    const validHeldDayTimes = 1; // 仮: 有効値
    const invalidHeldDayTimes = 0; // 仮: 無効値

    // 1. 正常系
    it('|1|有効|有効|OK|', () => {
        const data = HeldDayData.create(validHeldTimes, validHeldDayTimes);
        expect(data.heldTimes).toBe(validateHeldTimes(validHeldTimes));
        expect(data.heldDayTimes).toBe(validateHeldDayTimes(validHeldDayTimes));
    });

    // 2. heldTimes無効
    it('|2|無効|有効|Error|', () => {
        expect(() =>
            HeldDayData.create(invalidHeldTimes, validHeldDayTimes),
        ).toThrow();
    });

    // 3. heldDayTimes無効
    it('|3|有効|無効|Error|', () => {
        expect(() =>
            HeldDayData.create(validHeldTimes, invalidHeldDayTimes),
        ).toThrow();
    });

    // 4. 両方無効
    it('|4|無効|無効|Error|', () => {
        expect(() =>
            HeldDayData.create(invalidHeldTimes, invalidHeldDayTimes),
        ).toThrow();
    });

    // 5. copyで値変更
    it('|5|有効|有効|copyで値変更OK|', () => {
        const data = HeldDayData.create(validHeldTimes, validHeldDayTimes);
        const copied = data.copy({ heldTimes: 2, heldDayTimes: 3 });
        expect(copied.heldTimes).toBe(validateHeldTimes(2));
        expect(copied.heldDayTimes).toBe(validateHeldDayTimes(3));
    });

    // 6. copyで不正値
    it('|6|有効|有効|copyで不正値→Error|', () => {
        const data = HeldDayData.create(validHeldTimes, validHeldDayTimes);
        expect(() => data.copy({ heldTimes: invalidHeldTimes })).toThrow();
        expect(() =>
            data.copy({ heldDayTimes: invalidHeldDayTimes }),
        ).toThrow();
    });

    // 7. copyでpartialが空
    it('|7|有効|有効|copyでpartial空→全プロパティ同値|', () => {
        const data = HeldDayData.create(validHeldTimes, validHeldDayTimes);
        // partial: undefined
        const copied1 = data.copy();
        expect(copied1.heldTimes).toBe(validateHeldTimes(validHeldTimes));
        expect(copied1.heldDayTimes).toBe(
            validateHeldDayTimes(validHeldDayTimes),
        );

        // partial: {}
        const copied2 = data.copy({});
        expect(copied2.heldTimes).toBe(validateHeldTimes(validHeldTimes));
        expect(copied2.heldDayTimes).toBe(
            validateHeldDayTimes(validHeldDayTimes),
        );
    });
});
