import { validatePlaceId } from '../../../../../../lib/src/utility/validateAndType/idUtility';
import { RaceType } from '../../../../../../src/utility/raceType';
import { testRaceTypeListAll } from '../../../../../unittest/src/mock/common/baseCommonData';

describe('PlaceIdSchema', () => {
    const validCases = {
        [RaceType.JRA]: 'jra2021080101',
        [RaceType.NAR]: 'nar2021080101',
        [RaceType.OVERSEAS]: 'overseas2021080101',
        [RaceType.KEIRIN]: 'keirin2021080101',
        [RaceType.AUTORACE]: 'autorace2021080101',
        [RaceType.BOATRACE]: 'boatrace2021080101',
    } as const;

    test.each(testRaceTypeListAll)(
        '正常系: %s の PlaceId が正常な場合 (%s)',
        (raceType) => {
            const placeId = validCases[raceType];
            expect(validatePlaceId(raceType, placeId)).toBe(placeId);
        },
    );

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
    } as Record<RaceType, [string, string][]>;

    const invalidCases: [RaceType, string, string][] = [];
    for (const raceType of testRaceTypeListAll) {
        for (const [invalidId, message] of invalidPlaceIdAndMessage[raceType]) {
            invalidCases.push([raceType, invalidId, message]);
        }
    }

    test.each(invalidCases)(
        '異常系: %s の PlaceId が不正 (%s)',
        (raceType, invalidId, message) => {
            expect(() => validatePlaceId(raceType, invalidId)).toThrow(message);
        },
    );
});
