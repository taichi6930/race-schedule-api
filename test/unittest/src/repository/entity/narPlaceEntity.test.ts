import { RaceType } from '../../../../../lib/src/utility/raceType';
import {
    basePlaceData,
    basePlaceEntity,
} from '../../mock/common/baseCommonData';

describe('NarPlaceEntityクラスのテスト', () => {
    it('正しい入力でNarPlaceEntityのインスタンスを作成できることを確認', () => {
        expect(basePlaceEntity(RaceType.NAR).placeData).toEqual(
            basePlaceData(RaceType.NAR),
        );
    });

    it('何も変更せずNarPlaceEntityのインスタンスを作成できることを確認', () => {
        const copiedPlaceEntity = basePlaceEntity(RaceType.NAR).copy();

        expect(copiedPlaceEntity.id).toEqual(basePlaceEntity(RaceType.NAR).id);
        expect(copiedPlaceEntity.placeData).toStrictEqual(
            basePlaceEntity(RaceType.NAR).placeData,
        );
    });

    it('何も変更せずNarPlaceDataのインスタンスを作成できることを確認', () => {
        const { placeData } = basePlaceEntity(RaceType.NAR);

        expect(placeData).toEqual(basePlaceData(RaceType.NAR));
    });
});
