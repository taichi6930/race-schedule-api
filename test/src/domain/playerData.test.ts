/**
 * PlayerData ディシジョンテーブル
 * |No|raceType|playerNumber|name|priority|期待結果|備考|
 * |--|--------|-----------|----|--------|--------|----|
 * |1 |有効    |有効       |有効|有効   |OK      |正常系|
 * |2 |有効    |無効       |有効|有効   |Error   |playerNumberバリデーション|
 * |3 |有効    |有効       |有効|有効   |copyで値変更OK|copy正常系|
 * |4 |有効    |有効       |有効|有効   |copyで不正値→Error|copy異常系|
 */
import { PlayerData } from '../../../lib/src/domain/playerData';
import { RaceType } from '../../../lib/src/utility/raceType';

describe('PlayerDataクラスのテスト', () => {
    const validRaceType = RaceType.KEIRIN;
    const validPlayerNumber = 10000;
    const invalidPlayerNumber = 0;
    const validName = 'テスト選手';
    const validPriority = 1;

    // 1. 正常系
    it('|1|有効|有効|有効|有効|OK|', () => {
        const data = PlayerData.create(
            validRaceType,
            validPlayerNumber,
            validName,
            validPriority,
        );
        expect(data.raceType).toBe(validRaceType);
        expect(data.playerNumber).toBe(validPlayerNumber);
        expect(data.name).toBe(validName);
        expect(data.priority).toBe(validPriority);
    });

    // 2. playerNumber無効
    it('|2|有効|無効|有効|有効|Error|', () => {
        expect(() =>
            PlayerData.create(
                validRaceType,
                invalidPlayerNumber,
                validName,
                validPriority,
            ),
        ).toThrow();
    });

    // 3. copyで値変更
    it('|3|有効|有効|有効|有効|copyで値変更OK|', () => {
        const data = PlayerData.create(
            validRaceType,
            validPlayerNumber,
            validName,
            validPriority,
        );
        const copied = data.copy({ playerNumber: 20000, name: '変更選手' });
        expect(copied.playerNumber).toBe(20000);
        expect(copied.name).toBe('変更選手');
        expect(copied.raceType).toBe(validRaceType);
        expect(copied.priority).toBe(validPriority);
    });

    // 4. copyで不正値
    it('|4|有効|有効|有効|有効|copyで不正値→Error|', () => {
        const data = PlayerData.create(
            validRaceType,
            validPlayerNumber,
            validName,
            validPriority,
        );
        expect(() =>
            data.copy({ playerNumber: invalidPlayerNumber }),
        ).toThrow();
    });
});
