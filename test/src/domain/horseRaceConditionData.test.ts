import { baseJraConditionData } from '../mock/common/baseJraData';

describe('HorseRaceConditionDataクラスのテスト', () => {
    const baseRaceData = baseJraConditionData;

    it('正しい入力でNarRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        expect(raceData.surfaceType).toBe('芝');
        expect(raceData.distance).toBe(2500);
    });

    it('何も変更せずNarRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        const copiedRaceData = raceData.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceData).toEqual(raceData);
    });
});
