import { baseAutoraceRacePlayerData } from '../mock/common/baseAutoraceData';

describe('AutoraceRacePlayerDataクラスのテスト', () => {
    /**
     * テスト用のAutoraceRacePlayerDataインスタンス
     */
    const baseRacePlayerData = baseAutoraceRacePlayerData;

    it('正しい入力でAutoraceRacePlayerDataのインスタンスを作成できることを確認', () => {
        const racePlayerData = baseRacePlayerData;
        // インスタンスのプロパティが正しいか確認
        expect(racePlayerData.positionNumber).toBe(1);
        expect(racePlayerData.playerNumber).toBe(10000);
    });

    it('何も変更せずAutoraceRacePlayerDataのインスタンスを作成できることを確認', () => {
        const racePlayerData = baseRacePlayerData;
        const copiedRacePlayerData = racePlayerData.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRacePlayerData).toEqual(racePlayerData);
    });
});
