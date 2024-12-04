import {
    baseBoatracePlaceData,
    baseBoatracePlaceEntity,
} from '../../mock/common/baseBoatraceData';

describe('BoatracePlaceEntityクラスのテスト', () => {
    it('正しい入力でBoatracePlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseBoatracePlaceEntity;

        expect(placeEntity.placeData).toEqual(baseBoatracePlaceData);
    });

    it('日付を変更したNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseBoatracePlaceEntity;
        const newPlaceEntity = placeEntity.copy({
            placeData: baseBoatracePlaceData.copy({
                dateTime: new Date('2022-12-30'),
            }),
        });

        expect(newPlaceEntity.placeData.dateTime).toEqual(
            new Date('2022-12-30'),
        );
        expect(newPlaceEntity.placeData.location).toBe('平和島');
    });

    it('何も変更せずBoatracePlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseBoatracePlaceEntity;
        const newPlaceEntity = placeEntity.copy();

        expect(newPlaceEntity).toEqual(placeEntity);
    });

    it('何も変更せずBoatracePlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseBoatracePlaceEntity;
        const placeData = placeEntity.placeData;

        expect(placeData).toEqual(baseBoatracePlaceData);
    });
});
