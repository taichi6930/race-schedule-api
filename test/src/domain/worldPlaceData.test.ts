import { baseWorldPlaceData } from '../mock/common/baseWorldData';

describe('WorldPlaceDataクラスのテスト', () => {
    it('正しい入力でWorldPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseWorldPlaceData;

        expect(placeData.dateTime).toEqual(new Date('2024-10-01'));
        expect(placeData.location).toBe('パリロンシャン');
    });

    it('日付を変更したWorldPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseWorldPlaceData;
        const copiedPlaceData = placeData.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(copiedPlaceData.dateTime).toEqual(new Date('2022-12-30'));
        expect(copiedPlaceData.location).toBe('パリロンシャン');
    });

    it('何も変更せずWorldPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseWorldPlaceData;
        const copiedPlaceData = placeData.copy();

        expect(copiedPlaceData).toEqual(placeData);
    });
});
