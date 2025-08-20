import { RaceType } from '../../../../../lib/src/utility/raceType';
import {
    basePlaceData,
    basePlaceEntity,
} from '../../mock/common/baseCommonData';

describe('PlaceEntityクラスのテスト', () => {
    it('正しい入力でPlaceEntityのインスタンスを作成できることを確認', () => {
        expect(basePlaceEntity(RaceType.JRA).placeData).toEqual(
            basePlaceData(RaceType.JRA),
        );
    });

    it('何も変更せずPlaceEntityのインスタンスを作成できることを確認', () => {
        const copiedPlaceEntity = basePlaceEntity(RaceType.JRA).copy();

        expect(copiedPlaceEntity.id).toEqual(basePlaceEntity(RaceType.JRA).id);
        expect(copiedPlaceEntity.placeData).toStrictEqual(
            basePlaceEntity(RaceType.JRA).placeData,
        );
    });

    it('何も変更せずJraPlaceDataのインスタンスを作成できることを確認', () => {
        const { placeData } = basePlaceEntity(RaceType.JRA);

        expect(placeData).toEqual(basePlaceData(RaceType.JRA));
    });
});
