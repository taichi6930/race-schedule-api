/**
 * RacePlayerData ディシジョンテーブル
 * |No|raceType|positionNumber|playerNumber|partialの内容|期待結果|備考|
 * |--|--------|-------------|-----------|-------------|--------|----|
 * |1 |有効    |有効         |有効       | -           |OK      |正常系|
 * |2 |有効    |無効         |有効       | -           |Error   |positionNumberバリデーション|
 * |3 |有効    |有効         |無効       | -           |Error   |playerNumberバリデーション|
 * |4 |有効    |無効         |無効       | -           |Error   |両方バリデーション|
 * |5 |有効    |有効         |有効       |{ positionNumber: 2, playerNumber: 20000 }|copyで値変更OK|copy正常系|
 * |6 |有効    |有効         |有効       |{ positionNumber: 0 }, { playerNumber: 0 }|copyで不正値→Error|copy異常系|
 * |7 |有効    |有効         |有効       |{} または undefined|全プロパティ同値|copyでpartial空|
 */

import { RacePlayerData } from '../../../../lib/src/domain/racePlayerData';
import { RaceType } from '../../../../lib/src/utility/raceType';

describe('RacePlayerDataクラスのテスト', () => {
    const validRaceType = RaceType.BOATRACE;
    const validPositionNumber = 1; // BOATRACE: 1-6
    const invalidPositionNumber = 0;
    const validPlayerNumber = 10000;
    const invalidPlayerNumber = 0;

    // 1. 正常系
    it('|1|有効|有効|有効|OK|', () => {
        const data = RacePlayerData.create(
            validRaceType,
            validPositionNumber,
            validPlayerNumber,
        );
        expect(data.raceType).toBe(validRaceType);
        expect(data.positionNumber).toBe(validPositionNumber);
        expect(data.playerNumber).toBe(validPlayerNumber);
    });

    // 2. positionNumber無効
    it('|2|有効|無効|有効|Error|', () => {
        expect(() =>
            RacePlayerData.create(
                validRaceType,
                invalidPositionNumber,
                validPlayerNumber,
            ),
        ).toThrow();
    });

    // 3. playerNumber無効
    it('|3|有効|有効|無効|Error|', () => {
        expect(() =>
            RacePlayerData.create(
                validRaceType,
                validPositionNumber,
                invalidPlayerNumber,
            ),
        ).toThrow();
    });

    // 4. 両方無効
    it('|4|有効|無効|無効|Error|', () => {
        expect(() =>
            RacePlayerData.create(
                validRaceType,
                invalidPositionNumber,
                invalidPlayerNumber,
            ),
        ).toThrow();
    });

    // 5. copyで値変更
    it('|5|有効|有効|有効|copyで値変更OK|', () => {
        const data = RacePlayerData.create(
            validRaceType,
            validPositionNumber,
            validPlayerNumber,
        );
        const copied = data.copy({ positionNumber: 2, playerNumber: 20000 });
        expect(copied.positionNumber).toBe(2);
        expect(copied.playerNumber).toBe(20000);
        expect(copied.raceType).toBe(validRaceType);
    });

    // 6. copyで不正値
    it('|6|有効|有効|有効|copyで不正値→Error|', () => {
        const data = RacePlayerData.create(
            validRaceType,
            validPositionNumber,
            validPlayerNumber,
        );
        expect(() =>
            data.copy({ positionNumber: invalidPositionNumber }),
        ).toThrow();
        expect(() =>
            data.copy({ playerNumber: invalidPlayerNumber }),
        ).toThrow();
    });

    // 7. copyでpartialが空
    it('|7|有効|有効|有効|copyでpartial空→全プロパティ同値|', () => {
        const data = RacePlayerData.create(
            validRaceType,
            validPositionNumber,
            validPlayerNumber,
        );
        // partial: undefined
        const copied1 = data.copy();
        expect(copied1.raceType).toBe(validRaceType);
        expect(copied1.positionNumber).toBe(validPositionNumber);
        expect(copied1.playerNumber).toBe(validPlayerNumber);

        // partial: {}
        const copied2 = data.copy({});
        expect(copied2.raceType).toBe(validRaceType);
        expect(copied2.positionNumber).toBe(validPositionNumber);
        expect(copied2.playerNumber).toBe(validPlayerNumber);
    });
});
