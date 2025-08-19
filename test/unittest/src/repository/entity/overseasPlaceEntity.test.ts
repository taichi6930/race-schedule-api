import {
    baseOverseasPlaceData,
    baseOverseasPlaceEntity,
} from '../../mock/common/baseOverseasData';

describe('OverseasPlaceEntityクラスのテスト', () => {
    it('正しい入力でOverseasPlaceEntityのインスタンスを作成できることを確認', () => {
        expect(baseOverseasPlaceEntity.placeData).toEqual(
            baseOverseasPlaceData,
        );
    });

    it('何も変更せずOverseasPlaceEntityのインスタンスを作成できることを確認', () => {
        const copiedPlaceEntity = baseOverseasPlaceEntity.copy();

        expect(copiedPlaceEntity.id).toEqual(baseOverseasPlaceEntity.id);
        expect(copiedPlaceEntity.placeData).toBe(
            baseOverseasPlaceEntity.placeData,
        );
    });

    it('何も変更せずOverseasPlaceDataのインスタンスを作成できることを確認', () => {
        const { placeData } = baseOverseasPlaceEntity;

        expect(placeData).toEqual(baseOverseasPlaceData);
    });
});
