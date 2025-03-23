import { baseAutoracePlaceData } from '../mock/common/baseAutoraceData';

describe('AutoracePlaceDataクラスのテスト', () => {
    it('正しい入力でAutoracePlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseAutoracePlaceData;

        expect(placeData.dateTime).toEqual(new Date('2024-12-31'));
        expect(placeData.location).toBe('飯塚');
    });

    it('日付を変更したAutoracePlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseAutoracePlaceData;
        const copiedPlaceData = placeData.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(copiedPlaceData.dateTime).toEqual(new Date('2022-12-30'));
        expect(copiedPlaceData.location).toBe('飯塚');
    });

    it('何も変更せずAutoracePlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseAutoracePlaceData;
        const copiedPlaceData = placeData.copy();

        expect(copiedPlaceData).toEqual(placeData);
    });
});
