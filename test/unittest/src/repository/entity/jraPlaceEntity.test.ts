import {
    baseJraPlaceData,
    baseJraPlaceEntity,
} from '../../mock/common/baseJraData';

describe('PlaceEntityクラスのテスト', () => {
    it('正しい入力でPlaceEntityのインスタンスを作成できることを確認', () => {
        expect(baseJraPlaceEntity.placeData).toEqual(baseJraPlaceData);
    });

    it('何も変更せずPlaceEntityのインスタンスを作成できることを確認', () => {
        const copiedPlaceEntity = baseJraPlaceEntity.copy();

        expect(copiedPlaceEntity.id).toEqual(baseJraPlaceEntity.id);
        expect(copiedPlaceEntity.placeData).toBe(baseJraPlaceEntity.placeData);
    });

    it('何も変更せずJraPlaceDataのインスタンスを作成できることを確認', () => {
        const { placeData } = baseJraPlaceEntity;

        expect(placeData).toEqual(baseJraPlaceData);
    });
});
