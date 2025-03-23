import { baseWorldRaceData } from '../mock/common/baseWorldData';

describe('WorldRaceDataクラスのテスト', () => {
    /**
     * テスト用のWorldRaceDataインスタンス
     */
    const baseRaceData = baseWorldRaceData;

    it('正しい入力でWorldRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        // インスタンスのプロパティが正しいか確認
        expect(raceData.name).toBe('凱旋門賞');
        expect(raceData.dateTime).toEqual(new Date('2024-10-01 16:30'));
        expect(raceData.location).toBe('パリロンシャン');
        expect(raceData.surfaceType).toBe('芝');
        expect(raceData.distance).toBe(2400);
        expect(raceData.grade).toBe('GⅠ');
        expect(raceData.number).toBe(11);
    });

    it('何も変更せずWorldRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        const copiedRaceData = raceData.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceData).toEqual(raceData);
    });
});
