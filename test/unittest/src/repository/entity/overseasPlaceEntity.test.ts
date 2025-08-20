import { RaceType } from '../../../../../lib/src/utility/raceType';
import {
    basePlaceData,
    basePlaceEntity,
} from '../../mock/common/baseCommonData';

describe('OverseasPlaceEntityクラスのテスト', () => {
    it('正しい入力でOverseasPlaceEntityのインスタンスを作成できることを確認', () => {
        expect(basePlaceEntity(RaceType.OVERSEAS).placeData).toStrictEqual(
            basePlaceData(RaceType.OVERSEAS),
        );
    });

    it('何も変更せずOverseasPlaceEntityのインスタンスを作成できることを確認', () => {
        const copiedPlaceEntity = basePlaceEntity(RaceType.OVERSEAS).copy();

        expect(copiedPlaceEntity.id).toEqual(
            basePlaceEntity(RaceType.OVERSEAS).id,
        );
        expect(copiedPlaceEntity.placeData).toStrictEqual(
            basePlaceEntity(RaceType.OVERSEAS).placeData,
        );
    });

    it('何も変更せずOverseasPlaceDataのインスタンスを作成できることを確認', () => {
        const { placeData } = basePlaceEntity(RaceType.OVERSEAS);

        expect(placeData).toStrictEqual(basePlaceData(RaceType.OVERSEAS));
    });
});
