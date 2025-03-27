import {
    baseKeirinPlaceData,
    baseKeirinPlaceEntity,
} from '../../mock/common/baseKeirinData';

describe('KeirinPlaceEntityクラスのテスト', () => {
    it('正しい入力でKeirinPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseKeirinPlaceEntity;

        expect(placeEntity.placeData).toEqual(baseKeirinPlaceData);
    });

    it('日付を変更したKeirinPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseKeirinPlaceEntity;
        const copiedPlaceEntity = placeEntity.copy({
            placeData: baseKeirinPlaceData.copy({
                dateTime: new Date('2022-12-30'),
            }),
        });

        expect(copiedPlaceEntity.placeData.dateTime).toEqual(
            new Date('2022-12-30'),
        );
        expect(copiedPlaceEntity.placeData.location).toBe('平塚');
    });

    it('何も変更せずKeirinPlaceEntityのインスタンスを作成できることを確認', () => {
        const placeEntity = baseKeirinPlaceEntity;
        const copiedPlaceEntity = placeEntity.copy();

        expect(copiedPlaceEntity.id).toEqual(placeEntity.id);
        expect(copiedPlaceEntity.placeData).toBe(placeEntity.placeData);
    });

    it('何も変更せずKeirinPlaceDataのインスタンスを作成できることを確認', () => {
        const placeEntity = baseKeirinPlaceEntity;
        const { placeData } = placeEntity;

        expect(placeData).toEqual(baseKeirinPlaceData);
    });
});
