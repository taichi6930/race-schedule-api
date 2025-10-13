import {
    isIncludedRaceType,
    RACE_TYPE_LIST_MECHANICAL_RACING,
    RaceType,
} from '../../../../../src/utility/raceType';
import {
    basePlaceData,
    basePlaceEntity,
    defaultHeldDayData,
    defaultPlaceGrade,
    testRaceTypeListAll,
} from '../../mock/common/baseCommonData';

describe.each(testRaceTypeListAll)('PlaceEntity(%s)', (raceType) => {
    it(`正しい入力でPlaceEntityのインスタンスを作成できることを確認`, () => {
        expect(basePlaceEntity(raceType).placeData).toEqual(
            basePlaceData(raceType),
        );
        if (isIncludedRaceType(raceType, [RaceType.JRA]))
            expect(basePlaceEntity(raceType).heldDayData).toBe(
                defaultHeldDayData[raceType],
            );
        if (isIncludedRaceType(raceType, RACE_TYPE_LIST_MECHANICAL_RACING))
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
});
