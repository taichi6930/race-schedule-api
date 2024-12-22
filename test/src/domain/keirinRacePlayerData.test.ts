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
        const newRacePlayerData = racePlayerData.copy();
        // インスタンスが変更されていないか確認
        expect(newRacePlayerData).toEqual(racePlayerData);
    });

    it('レース番号が範囲外の場合にエラーがスローされることを確認', () => {
        expect(() => {
            baseRacePlayerData.copy({ positionNumber: 13 });
        }).toThrow('枠番は1以上9以下である必要があります');
    });

    it('選手番号が範囲外の場合にエラーがスローされることを確認', () => {
        expect(() => {
            baseRacePlayerData.copy({ playerNumber: 0 });
        }).toThrow('選手番号は1以上である必要があります');
    });
});
