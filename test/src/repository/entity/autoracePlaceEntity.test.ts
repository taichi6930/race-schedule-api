import {
    baseAutoracePlaceData,
    baseAutoracePlaceEntity,
} from '../../mock/common/baseAutoraceData';

describe('AutoracePlaceEntityクラスのテスト', () => {
    it('正しい入力でAutoracePlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseAutoracePlaceEntity;

        expect(placeEntity.placeData).toEqual(baseAutoracePlaceData);
    });

    it('日付を変更したNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseAutoracePlaceEntity;
        const newPlaceEntity = placeEntity.copy({
            placeData: baseAutoracePlaceData.copy({
                dateTime: new Date('2022-12-30'),
            }),
        });

        expect(newPlaceEntity.placeData.dateTime).toEqual(
            new Date('2022-12-30'),
        );
        expect(newPlaceEntity.placeData.location).toBe('飯塚');
    });

    it('何も変更せずAutoracePlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseAutoracePlaceEntity;
        const newPlaceEntity = placeEntity.copy();

        expect(newPlaceEntity.id).toEqual(placeEntity.id);
        expect(newPlaceEntity.placeData).toBe(placeEntity.placeData);
    });

    it('何も変更せずAutoracePlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseAutoracePlaceEntity;
        const placeData = placeEntity.placeData;

        expect(placeData).toEqual(baseAutoracePlaceData);
    });
});
