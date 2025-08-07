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
});
