import {
    baseOverseasPlaceData,
    baseOverseasPlaceEntity,
} from '../../mock/common/baseOverseasData';

describe('OverseasPlaceEntityクラスのテスト', () => {
    it('正しい入力でOverseasPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseOverseasPlaceEntity;

        expect(placeEntity.placeData).toEqual(baseOverseasPlaceData);
    });

    it('何も変更せずOverseasPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseOverseasPlaceEntity;
        const copiedPlaceEntity = placeEntity.copy();

        expect(copiedPlaceEntity.id).toEqual(placeEntity.id);
        expect(copiedPlaceEntity.placeData).toBe(placeEntity.placeData);
    });

    it('何も変更せずOverseasPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseOverseasPlaceEntity;
        const { placeData } = placeEntity;

        expect(placeData).toEqual(baseOverseasPlaceData);
    });
});
