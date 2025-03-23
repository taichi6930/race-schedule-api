import { baseNarRaceData } from '../mock/common/baseNarData';

describe('NarRaceDataクラスのテスト', () => {
    const baseRaceData = baseNarRaceData;

    it('正しい入力でNarRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        expect(raceData.name).toBe('東京大賞典');
        expect(raceData.dateTime).toEqual(new Date('2024-12-29 15:40'));
        expect(raceData.location).toBe('大井');
        expect(raceData.surfaceType).toBe('ダート');
        expect(raceData.distance).toBe(2000);
        expect(raceData.grade).toBe('GⅠ');
        expect(raceData.number).toBe(11);
    });

    it('何も変更せずNarRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        const copiedRaceData = raceData.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceData).toEqual(raceData);
    });
});
