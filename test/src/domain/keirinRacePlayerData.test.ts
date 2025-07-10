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

    describe('Value Object としての等価性テスト', () => {
        it('同じ値を持つインスタンスは等価であることを確認', () => {
            const playerData1 = baseRacePlayerData;
            const playerData2 = baseRacePlayerData.copy();

            // 異なるインスタンスだが値が同じなので等価
            expect(playerData1 === playerData2).toBe(false); // 参照は異なる
            expect(playerData1.equals(playerData2)).toBe(true); // 値は等価
        });

        it('異なる値を持つインスタンスは等価でないことを確認', () => {
            const playerData1 = baseRacePlayerData;
            const playerData2 = playerData1.copy({ positionNumber: 2 });

            expect(playerData1.equals(playerData2)).toBe(false);
        });

        it('選手番号が異なるインスタンスは等価でないことを確認', () => {
            const playerData1 = baseRacePlayerData;
            const playerData2 = playerData1.copy({ playerNumber: 20000 });

            expect(playerData1.equals(playerData2)).toBe(false);
        });

        it('toString メソッドが正しい文字列表現を返すことを確認', () => {
            const playerData = baseRacePlayerData;
            const result = playerData.toString();

            expect(result).toContain('KeirinRacePlayerData');
            expect(result).toContain('1');
            expect(result).toContain('10000');
        });
    });
});
