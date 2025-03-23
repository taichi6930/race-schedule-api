import {
    baseJraPlaceData,
    baseJraPlaceEntity,
} from '../../mock/common/baseJraData';

describe('JraPlaceEntityクラスのテスト', () => {
    it('正しい入力でJraPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseJraPlaceEntity;

        expect(placeEntity.placeData).toEqual(baseJraPlaceData);
    });

    it('何も変更せずJraPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseJraPlaceEntity;
        const copiedPlaceEntity = placeEntity.copy();

        expect(copiedPlaceEntity.id).toEqual(placeEntity.id);
        expect(copiedPlaceEntity.placeData).toBe(placeEntity.placeData);
    });

    it('何も変更せずJraPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseJraPlaceEntity;
        const placeData = placeEntity.placeData;

        expect(placeData).toEqual(baseJraPlaceData);
    });
});
