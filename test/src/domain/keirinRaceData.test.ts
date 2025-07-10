import { baseKeirinRaceData } from '../mock/common/baseKeirinData';

describe('KeirinRaceDataクラスのテスト', () => {
    /**
     * テスト用のKeirinRaceDataインスタンス
     */
    it('正しい入力でKeirinRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseKeirinRaceData;
        // インスタンスのプロパティが正しいか確認
        expect(raceData.name).toBe('KEIRINグランプリ');
        expect(raceData.dateTime).toEqual(new Date('2025-12-30 16:30'));
        expect(raceData.stage).toBe('S級グランプリ');
        expect(raceData.location).toBe('平塚');
        expect(raceData.grade).toBe('GP');
        expect(raceData.number).toBe(11);
    });

    it('何も変更せずKeirinRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseKeirinRaceData;
        const copiedRaceData = raceData.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceData).toEqual(raceData);
    });

    describe('Value Object としての等価性テスト', () => {
        it('同じ値を持つインスタンスは等価であることを確認', () => {
            const raceData1 = baseKeirinRaceData;
            const raceData2 = baseKeirinRaceData.copy();

            // 異なるインスタンスだが値が同じなので等価
            expect(raceData1 === raceData2).toBe(false); // 参照は異なる
            expect(raceData1.equals(raceData2)).toBe(true); // 値は等価
        });

        it('異なる値を持つインスタンスは等価でないことを確認', () => {
            const raceData1 = baseKeirinRaceData;
            const raceData2 = raceData1.copy({ name: '異なるレース名' });

            expect(raceData1.equals(raceData2)).toBe(false);
        });

        it('日時が異なるインスタンスは等価でないことを確認', () => {
            const raceData1 = baseKeirinRaceData;
            const raceData2 = raceData1.copy({
                dateTime: new Date('2025-12-31 16:30'),
            });

            expect(raceData1.equals(raceData2)).toBe(false);
        });

        it('toString メソッドが正しい文字列表現を返すことを確認', () => {
            const raceData = baseKeirinRaceData;
            const result = raceData.toString();

            expect(result).toContain('KeirinRaceData');
            expect(result).toContain('KEIRINグランプリ');
            expect(result).toContain('平塚');
            expect(result).toContain('GP');
        });
    });
});
