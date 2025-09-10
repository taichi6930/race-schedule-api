/**
 * PlayerData ディシジョンテーブル
 * |No|raceType|playerNumber      |name         |priority|partialの内容                              |期待結果                |備考                              |
 * |--|--------|------------------|--------------|--------|------------------------------------------|------------------------|-----------------------------------|
 * |1 |有効    |有効             |有効         |有効   | -                                        |OK                     |正常系                            |
 * |2 |有効    |無効             |有効         |有効   | -                                        |Error                  |playerNumberバリデーション         |
 * |3 |有効    |有効             |有効         |有効   |{ playerNumber: 20000, name: '変更選手' } |copyで値変更OK         |copy正常系                         |
 * |4 |有効    |有効             |有効         |有効   |{ playerNumber: 0 }                       |copyで不正値→Error      |copy異常系                         |
 * |5 |有効    |有効             |有効         |有効   |{} または undefined                      |全プロパティ同値        |copyでpartial空                    |
 * |6 |有効    |有効             |有効         |有効   |{ playerNumber: undefined }               |playerNumberは元値維持   |copyでplayerNumber: undefined      |
 */
import { PlayerDataForAWS } from '../../../../../lib/src/domain/playerData';
import { testRaceTypeListMechanicalRacing } from '../../../../unittest/src/mock/common/baseCommonData';

describe.each(testRaceTypeListMechanicalRacing)(
    'PlayerDataクラスのテスト(%s)',
    (raceType) => {
        const validPlayerNumber = 10000;
        const invalidPlayerNumber = 0;
        const validName = 'テスト選手';
        const validPriority = 1;

        // 1. 正常系
        it('|1|有効|有効|有効|有効|OK|', () => {
            const data = PlayerDataForAWS.create(
                raceType,
                validPlayerNumber,
                validName,
                validPriority,
            );
            expect(data.raceType).toBe(raceType);
            expect(data.playerNumber).toBe(validPlayerNumber);
            expect(data.name).toBe(validName);
            expect(data.priority).toBe(validPriority);
        });

        // 2. playerNumber無効
        it('|2|有効|無効|有効|有効|Error|', () => {
            expect(() =>
                PlayerDataForAWS.create(
                    raceType,
                    invalidPlayerNumber,
                    validName,
                    validPriority,
                ),
            ).toThrow();
        });

        // 3. copyで値変更
        it('|3|有効|有効|有効|有効|copyで値変更OK|', () => {
            const data = PlayerDataForAWS.create(
                raceType,
                validPlayerNumber,
                validName,
                validPriority,
            );
            const copied = data.copy({
                playerNumber: 20000,
                name: '変更選手',
            });
            expect(copied.playerNumber).toBe(20000);
            expect(copied.name).toBe('変更選手');
            expect(copied.raceType).toBe(raceType);
            expect(copied.priority).toBe(validPriority);
        });

        // 4. copyで不正値
        it('|4|有効|有効|有効|有効|copyで不正値→Error|', () => {
            const data = PlayerDataForAWS.create(
                raceType,
                validPlayerNumber,
                validName,
                validPriority,
            );
            expect(() =>
                data.copy({ playerNumber: invalidPlayerNumber }),
            ).toThrow();
        });

        // 5. copyでpartialが空
        it('|5|有効|有効|有効|有効|copyでpartial空→全プロパティ同値|', () => {
            const data = PlayerDataForAWS.create(
                raceType,
                validPlayerNumber,
                validName,
                validPriority,
            );
            const copied = data.copy();
            expect(copied.raceType).toBe(raceType);
            expect(copied.playerNumber).toBe(validPlayerNumber);
            expect(copied.name).toBe(validName);
            expect(copied.priority).toBe(validPriority);
        });

        // 6. copyでplayerNumber: undefined
        it('|6|有効|有効|有効|有効|copyでplayerNumber: undefined→元値維持|', () => {
            const data = PlayerDataForAWS.create(
                raceType,
                validPlayerNumber,
                validName,
                validPriority,
            );
            const copied = data.copy({ playerNumber: undefined });
            expect(copied.playerNumber).toBe(validPlayerNumber);
        });
    },
);
