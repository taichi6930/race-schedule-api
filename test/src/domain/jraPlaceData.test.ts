import { baseJraPlaceData } from '../mock/common/baseJraData';

describe('JraPlaceDataクラスのテスト', () => {
    it('正しい入力でJraPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseJraPlaceData;

        expect(placeData.dateTime).toEqual(new Date('2024-12-22'));
        expect(placeData.location).toBe('中山');
    });

    it('日付を変更したJraPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseJraPlaceData;
        const copiedPlaceData = placeData.copy({
            dateTime: new Date('2024-06-04'),
        });

        expect(copiedPlaceData.dateTime).toEqual(new Date('2024-06-04'));
        expect(copiedPlaceData.location).toBe('中山');
    });

    it('何も変更せずJraPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseJraPlaceData;
        const copiedPlaceData = placeData.copy();

        expect(copiedPlaceData).toEqual(placeData);
    });
});
