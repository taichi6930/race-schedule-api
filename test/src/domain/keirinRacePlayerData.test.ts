import { baseKeirinRacePlayerData } from '../mock/common/baseKeirinData';

describe('KeirinRacePlayerDataクラスのテスト', () => {
    /**
     * テスト用のKeirinRacePlayerDataインスタンス
     */
    const baseRacePlayerData = baseKeirinRacePlayerData;

    it('正しい入力でKeirinRacePlayerDataのインスタンスを作成できることを確認', () => {
        const racePlayerData = baseRacePlayerData;
        // インスタンスのプロパティが正しいか確認
        expect(racePlayerData.positionNumber).toBe(1);
        expect(racePlayerData.playerNumber).toBe(10000);
    });

    it('何も変更せずKeirinRacePlayerDataのインスタンスを作成できることを確認', () => {
        const racePlayerData = baseRacePlayerData;
        const copiedRacePlayerData = racePlayerData.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRacePlayerData).toEqual(racePlayerData);
    });
});
