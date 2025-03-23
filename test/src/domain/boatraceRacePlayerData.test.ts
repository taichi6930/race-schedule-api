import { baseBoatraceRacePlayerData } from '../mock/common/baseBoatraceData';

describe('BoatraceRacePlayerDataクラスのテスト', () => {
    /**
     * テスト用のBoatraceRacePlayerDataインスタンス
     */
    const baseRacePlayerData = baseBoatraceRacePlayerData;

    it('正しい入力でBoatraceRacePlayerDataのインスタンスを作成できることを確認', () => {
        const racePlayerData = baseRacePlayerData;
        // インスタンスのプロパティが正しいか確認
        expect(racePlayerData.positionNumber).toBe(1);
        expect(racePlayerData.playerNumber).toBe(10000);
    });

    it('何も変更せずBoatraceRacePlayerDataのインスタンスを作成できることを確認', () => {
        const racePlayerData = baseRacePlayerData;
        const copiedRacePlayerData = racePlayerData.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRacePlayerData).toEqual(racePlayerData);
    });
});
