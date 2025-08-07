/**
 * JraHeldDayData ディシジョンテーブル
 * |No|heldTimes|heldDayTimes|期待結果|備考|
 * |--|---------|------------|--------|----|
 * |1 |有効     |有効        |OK      |正常系|
 * |2 |無効     |有効        |Error   |heldTimesバリデーション|
 * |3 |有効     |無効        |Error   |heldDayTimesバリデーション|
 * |4 |無効     |無効        |Error   |両方バリデーション|
 * |5 |有効     |有効        |copyで値変更OK|copy正常系|
 * |6 |有効     |有効        |copyで不正値→Error|copy異常系|
 */
import { JraHeldDayData } from '../../../lib/src/domain/jraHeldDayData';
import { validateJraHeldDayTimes } from '../../../lib/src/utility/data/jra/jraHeldDayTimes';
import { validateJraHeldTimes } from '../../../lib/src/utility/data/jra/jraHeldTimes';

describe('JraHeldDayDataクラスのテスト', () => {
    const validHeldTimes = 1; // 仮: 有効値
    const invalidHeldTimes = 0; // 仮: 無効値
    const validHeldDayTimes = 1; // 仮: 有効値
    const invalidHeldDayTimes = 0; // 仮: 無効値

    // 1. 正常系
    it('|1|有効|有効|OK|', () => {
        const data = JraHeldDayData.create(validHeldTimes, validHeldDayTimes);
        expect(data.heldTimes).toBe(validateJraHeldTimes(validHeldTimes));
        expect(data.heldDayTimes).toBe(
            validateJraHeldDayTimes(validHeldDayTimes),
        );
    });

    // 2. heldTimes無効
    it('|2|無効|有効|Error|', () => {
        expect(() =>
            JraHeldDayData.create(invalidHeldTimes, validHeldDayTimes),
        ).toThrow();
    });

    // 3. heldDayTimes無効
    it('|3|有効|無効|Error|', () => {
        expect(() =>
            JraHeldDayData.create(validHeldTimes, invalidHeldDayTimes),
        ).toThrow();
    });

    // 4. 両方無効
    it('|4|無効|無効|Error|', () => {
        expect(() =>
            JraHeldDayData.create(invalidHeldTimes, invalidHeldDayTimes),
        ).toThrow();
    });

    // 5. copyで値変更
    it('|5|有効|有効|copyで値変更OK|', () => {
        const data = JraHeldDayData.create(validHeldTimes, validHeldDayTimes);
        const copied = data.copy({ heldTimes: 2, heldDayTimes: 3 });
        expect(copied.heldTimes).toBe(validateJraHeldTimes(2));
        expect(copied.heldDayTimes).toBe(validateJraHeldDayTimes(3));
    });

    // 6. copyで不正値
    it('|6|有効|有効|copyで不正値→Error|', () => {
        const data = JraHeldDayData.create(validHeldTimes, validHeldDayTimes);
        expect(() => data.copy({ heldTimes: invalidHeldTimes })).toThrow();
        expect(() =>
            data.copy({ heldDayTimes: invalidHeldDayTimes }),
        ).toThrow();
    });
});
