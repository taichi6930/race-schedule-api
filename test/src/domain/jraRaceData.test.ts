import { RaceData } from '../../../lib/src/domain/raceData';
import { RaceType } from '../../../lib/src/utility/raceType';

describe('JraRaceDataクラスのテスト', () => {
    /**
     * テスト用のJraRaceDataインスタンス
     */
    const baseRaceData = RaceData.create(
        RaceType.JRA,
        '東京優駿',
        new Date('2024-05-26 15:40'),
        '東京',
        'GⅠ',
        10,
    );

    it('正しい入力でJraRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        // インスタンスのプロパティが正しいか確認
        expect(raceData.name).toBe('東京優駿');
        expect(raceData.dateTime).toEqual(new Date('2024-05-26 15:40'));
        expect(raceData.location).toBe('東京');
        expect(raceData.grade).toBe('GⅠ');
        expect(raceData.number).toBe(10);
    });

    it('何も変更せずJraRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        const copiedRaceData = raceData.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceData).toEqual(raceData);
    });
});
