import { validatePlaceId } from '../../../../../../lib/src/utility/data/common/placeId';
import { RaceType } from '../../../../../../lib/src/utility/raceType';
import { testRaceTypeListAll } from '../../../mock/common/baseCommonData';

describe('PlaceIdSchema', () => {
    for (const { raceType, placeId } of [
        { raceType: RaceType.JRA, placeId: 'jra2021080101' },
        { raceType: RaceType.NAR, placeId: 'nar2021080101' },
        { raceType: RaceType.OVERSEAS, placeId: 'overseas2021080101' },
        { raceType: RaceType.KEIRIN, placeId: 'keirin2021080101' },
        { raceType: RaceType.AUTORACE, placeId: 'autorace2021080101' },
        { raceType: RaceType.BOATRACE, placeId: 'boatrace2021080101' },
    ]) {
        it(`正常系: ${raceType}のPlaceIdが正常な場合`, () => {
            expect(validatePlaceId(raceType, placeId)).toBe(placeId);
        });
    }

    const invalidPlaceIdAndMessage = {
        [RaceType.JRA]: [
            ['abc2021080101', 'jraから始まる必要があります'],
            ['2021jra080101', 'jraから始まる必要があります'],
            ['jra202108010', 'jraPlaceIdの形式ではありません'],
            ['nar2021080101', 'jraから始まる必要があります'],
        ],
        [RaceType.NAR]: [
            ['abc2021080101', 'narから始まる必要があります'],
            ['2021nar080101', 'narから始まる必要があります'],
            ['nar202108010', 'narPlaceIdの形式ではありません'],
            ['jra2021080101', 'narから始まる必要があります'],
        ],
        [RaceType.OVERSEAS]: [
            ['abc2021080101', 'overseasから始まる必要があります'],
            ['2021overseas080101', 'overseasから始まる必要があります'],
            ['overseas202108010', 'overseasPlaceIdの形式ではありません'],
            ['jra2021080101', 'overseasから始まる必要があります'],
            ['world021080101', 'overseasから始まる必要があります'],
        ],
        [RaceType.KEIRIN]: [
            ['abc2021080101', 'keirinから始まる必要があります'],
            ['2021keirin080101', 'keirinから始まる必要があります'],
            ['keirin202108010', 'keirinPlaceIdの形式ではありません'],
            ['jra2021080101', 'keirinから始まる必要があります'],
        ],
        [RaceType.BOATRACE]: [
            ['abc2021080101', 'boatraceから始まる必要があります'],
            ['2021boatrace080101', 'boatraceから始まる必要があります'],
            ['boatrace202108010', 'boatracePlaceIdの形式ではありません'],
            ['jra2021080101', 'boatraceから始まる必要があります'],
        ],
        [RaceType.AUTORACE]: [
            ['abc2021080101', 'autoraceから始まる必要があります'],
            ['2021autorace080101', 'autoraceから始まる必要があります'],
            ['autorace202108010', 'autoracePlaceIdの形式ではありません'],
            ['jra2021080101', 'autoraceから始まる必要があります'],
        ],
    };

    for (const raceType of testRaceTypeListAll) {
        for (const [invalidId, message] of invalidPlaceIdAndMessage[raceType]) {
            it(`異常系: ${raceType} の PlaceId が不正 (${invalidId})`, () => {
                expect(() => validatePlaceId(raceType, invalidId)).toThrow(
                    message,
                );
            });
        }
    }
});
