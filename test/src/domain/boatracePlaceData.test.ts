import { baseBoatracePlaceData } from '../mock/common/baseData';

describe('BoatracePlaceDataクラスのテスト', () => {
    it('正しい入力でBoatracePlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseBoatracePlaceData;

        expect(placeData.dateTime).toEqual(new Date('2024-12-31'));
        expect(placeData.location).toBe('平和島');
    });

    it('日付を変更したBoatracePlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseBoatracePlaceData;
        const newPlaceData = placeData.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(newPlaceData.dateTime).toEqual(new Date('2022-12-30'));
        expect(newPlaceData.location).toBe('平和島');
    });

    it('何も変更せずBoatracePlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseBoatracePlaceData;
        const newPlaceData = placeData.copy();

        expect(newPlaceData).toEqual(placeData);
    });
});
