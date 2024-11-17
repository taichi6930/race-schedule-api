import { baseBoatraceRaceData } from '../mock/common/baseData';

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
        expect(raceData.stage).toBe('優勝戦');
        expect(raceData.location).toBe('平和島');
        expect(raceData.grade).toBe('SG');
        expect(raceData.number).toBe(11);
    });

    it('何も変更せずBoatraceRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        const newRaceData = raceData.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceData).toEqual(raceData);
    });

    it('レース番号が範囲外の場合にエラーがスローされることを確認', () => {
        expect(() => {
            baseRaceData.copy({ number: 13 });
        }).toThrow('レース番号は1以上12以下である必要があります');
    });
});