import {
    baseWorldPlaceData,
    baseWorldPlaceEntity,
} from '../../mock/common/baseWorldData';

describe('WorldPlaceEntityクラスのテスト', () => {
    it('正しい入力でWorldPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseWorldPlaceEntity;

        expect(placeEntity.placeData).toEqual(baseWorldPlaceData);
    });

    it('何も変更せずWorldPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseWorldPlaceEntity;
        const copiedPlaceEntity = placeEntity.copy();

        expect(copiedPlaceEntity.id).toEqual(placeEntity.id);
        expect(copiedPlaceEntity.placeData).toBe(placeEntity.placeData);
    });

    it('何も変更せずWorldPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseWorldPlaceEntity;
        const placeData = placeEntity.placeData;

        expect(placeData).toEqual(baseWorldPlaceData);
    });
});
