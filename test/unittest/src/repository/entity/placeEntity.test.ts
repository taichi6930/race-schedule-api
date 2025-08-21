import {
    RACE_TYPE_LIST_ALL,
    RaceType,
} from '../../../../../lib/src/utility/raceType';
import {
    basePlaceData,
    basePlaceEntity,
    defaultHeldDayData,
    defaultPlaceGrade,
} from '../../mock/common/baseCommonData';

describe('PlaceEntityクラスのテスト', () => {
    for (const raceType of RACE_TYPE_LIST_ALL) {
        it(`正しい入力でPlaceEntityのインスタンスを作成できることを確認(${raceType})`, () => {
            expect(basePlaceEntity(raceType).placeData).toEqual(
                basePlaceData(raceType),
            );
            if (raceType === RaceType.JRA)
                expect(basePlaceEntity(raceType).heldDayData).toBe(
                    defaultHeldDayData[raceType],
                );
            if (
                raceType === RaceType.KEIRIN ||
                raceType === RaceType.AUTORACE ||
                raceType === RaceType.BOATRACE
            )
                expect(basePlaceEntity(raceType).grade).toBe(
                    defaultPlaceGrade[raceType],
                );
        });

        it('何も変更せずPlaceEntityのインスタンスを作成できることを確認', () => {
            const copiedPlaceEntity = basePlaceEntity(raceType).copy();
            expect(copiedPlaceEntity).toEqual(basePlaceEntity(raceType));
        });

        it('何も変更せずPlaceDataのインスタンスを作成できることを確認', () => {
            const { placeData } = basePlaceEntity(raceType);
            expect(placeData).toEqual(basePlaceData(raceType));
        });
    }
});
