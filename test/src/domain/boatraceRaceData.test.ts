import { baseBoatraceRaceData } from '../mock/common/baseBoatraceData';

describe('BoatraceRaceDataクラスのテスト', () => {
    /**
     * テスト用のBoatraceRaceDataインスタンス
     */
    const baseRaceData = baseBoatraceRaceData;

    it('正しい入力でBoatraceRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        // インスタンスのプロパティが正しいか確認
        expect(raceData.name).toBe('グランプリ');
        expect(raceData.dateTime).toEqual(new Date('2024-12-31 16:30'));
        expect(raceData.location).toBe('平和島');
        expect(raceData.grade).toBe('SG');
        expect(raceData.number).toBe(11);
    });

    it('何も変更せずBoatraceRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        const copiedRaceData = raceData.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceData).toEqual(raceData);
    });
});
