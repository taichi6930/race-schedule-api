import { validatePlaceId } from '../../../../../../lib/src/utility/data/common/placeId';
import { RaceType } from '../../../../../../lib/src/utility/raceType';

describe('PlaceIdSchema', () => {
    for (const { raceType, placeId } of [
        {
            raceType: RaceType.JRA,
            placeId: 'jra2021080101',
        },
        {
            raceType: RaceType.NAR,
            placeId: 'nar2021080101',
        },
        {
            raceType: RaceType.WORLD,
            placeId: 'world20210801longchamp',
        },
        {
            raceType: RaceType.KEIRIN,
            placeId: 'keirin2021080101',
        },
        {
            raceType: RaceType.AUTORACE,
            placeId: 'autorace2021080101',
        },
        {
            raceType: RaceType.BOATRACE,
            placeId: 'boatrace2021080101',
        },
    ]) {
        it(`正常系: ${raceType}のPlaceIdが正常な場合`, () => {
            expect(validatePlaceId(raceType, placeId)).toBe(placeId);
        });
    }
});
