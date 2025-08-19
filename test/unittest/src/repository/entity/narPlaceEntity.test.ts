import {
    baseNarPlaceData,
    baseNarPlaceEntity,
} from '../../mock/common/baseNarData';

describe('NarPlaceEntityクラスのテスト', () => {
    it('正しい入力でNarPlaceEntityのインスタンスを作成できることを確認', () => {
        expect(baseNarPlaceEntity.placeData).toEqual(baseNarPlaceData);
    });

    it('何も変更せずNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const copiedPlaceEntity = baseNarPlaceEntity.copy();

        expect(copiedPlaceEntity.id).toEqual(baseNarPlaceEntity.id);
        expect(copiedPlaceEntity.placeData).toBe(baseNarPlaceEntity.placeData);
    });

    it('何も変更せずNarPlaceDataのインスタンスを作成できることを確認', () => {
        const { placeData } = baseNarPlaceEntity;

        expect(placeData).toEqual(baseNarPlaceData);
    });
});
