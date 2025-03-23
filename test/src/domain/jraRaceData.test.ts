import { JraRaceData } from '../../../lib/src/domain/jraRaceData';

describe('JraRaceDataクラスのテスト', () => {
    /**
     * テスト用のJraRaceDataインスタンス
     */
    const baseRaceData = JraRaceData.create(
        '東京優駿',
        new Date('2024-05-26 15:40'),
        '東京',
        '芝',
        2400,
        'GⅠ',
        10,
        1,
        1,
    );

    it('正しい入力でJraRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        // インスタンスのプロパティが正しいか確認
        expect(raceData.name).toBe('東京優駿');
        expect(raceData.dateTime).toEqual(new Date('2024-05-26 15:40'));
        expect(raceData.location).toBe('東京');
        expect(raceData.surfaceType).toBe('芝');
        expect(raceData.distance).toBe(2400);
        expect(raceData.grade).toBe('GⅠ');
        expect(raceData.number).toBe(10);
        expect(raceData.heldTimes).toBe(1);
        expect(raceData.heldDayTimes).toBe(1);
    });

    it('何も変更せずJraRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        const copiedRaceData = raceData.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceData).toEqual(raceData);
    });
});
