import {
    baseJraPlaceData,
    basePlaceEntity,
} from '../../mock/common/baseJraData';

describe('PlaceEntityクラスのテスト', () => {
    it('正しい入力でPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = basePlaceEntity;

        expect(placeEntity.placeData).toEqual(baseJraPlaceData);
    });

    it('何も変更せずPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = basePlaceEntity;
        const copiedPlaceEntity = placeEntity.copy();

        expect(copiedPlaceEntity.id).toEqual(placeEntity.id);
        expect(copiedPlaceEntity.placeData).toBe(placeEntity.placeData);
    });

    it('何も変更せずJraPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = basePlaceEntity;
        const { placeData } = placeEntity;

        expect(placeData).toEqual(baseJraPlaceData);
    });
});
