import {
    baseNarPlaceData,
    baseNarPlaceEntity,
} from '../../mock/common/baseNarData';

describe('NarPlaceEntityクラスのテスト', () => {
    it('正しい入力でNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseNarPlaceEntity;

        expect(placeEntity.placeData).toEqual(baseNarPlaceData);
    });

    it('何も変更せずNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseNarPlaceEntity;
        const copiedPlaceEntity = placeEntity.copy();

        expect(copiedPlaceEntity.id).toEqual(placeEntity.id);
        expect(copiedPlaceEntity.placeData).toBe(placeEntity.placeData);
    });

    it('何も変更せずNarPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseNarPlaceEntity;
        const { placeData } = placeEntity;

        expect(placeData).toEqual(baseNarPlaceData);
    });
});
