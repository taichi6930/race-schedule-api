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
            raceType: RaceType.OVERSEAS,
            placeId: 'overseas2021080101',
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

describe('JraPlaceIdSchema', () => {
    it('異常系: 不正なJraPlaceId', () => {
        const invalidJraPlaceIdAndMessage = [
            ['abc2021080101', 'jraから始まる必要があります'],
            ['2021jra080101', 'jraから始まる必要があります'],
            ['jra202108010', 'jraPlaceIdの形式ではありません'],
            ['nar2021080101', 'jraから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidJraPlaceIdAndMessage) {
            expect(() => validatePlaceId(RaceType.JRA, invalidId)).toThrow(
                message,
            );
        }
    });
});

describe('NarPlaceIdSchema', () => {
    it('異常系: 不正なNarPlaceId', () => {
        const invalidNarPlaceIdAndMessage = [
            ['abc2021080101', 'narから始まる必要があります'],
            ['2021nar080101', 'narから始まる必要があります'],
            ['nar202108010', 'narPlaceIdの形式ではありません'],
            ['jra2021080101', 'narから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidNarPlaceIdAndMessage) {
            expect(() => validatePlaceId(RaceType.NAR, invalidId)).toThrow(
                message,
            );
        }
    });
});

describe('OverseasPlaceIdSchema', () => {
    it('異常系: 不正なOverseasPlaceId', () => {
        const invalidOverseasPlaceIdAndMessage = [
            ['abc2021080101', 'overseasから始まる必要があります'],
            ['2021overseas080101', 'overseasから始まる必要があります'],
            ['overseas202108010', 'overseasPlaceIdの形式ではありません'],
            ['jra2021080101', 'overseasから始まる必要があります'],
            ['world021080101', 'overseasから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidOverseasPlaceIdAndMessage) {
            expect(() => validatePlaceId(RaceType.OVERSEAS, invalidId)).toThrow(
                message,
            );
        }
    });
});

describe('KeirinPlaceIdSchema', () => {
    it('異常系: 不正なKeirinPlaceId', () => {
        const invalidKeirinPlaceIdAndMessage = [
            ['abc2021080101', 'keirinから始まる必要があります'],
            ['2021keirin080101', 'keirinから始まる必要があります'],
            ['keirin202108010', 'keirinPlaceIdの形式ではありません'],
            ['jra2021080101', 'keirinから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidKeirinPlaceIdAndMessage) {
            expect(() => validatePlaceId(RaceType.KEIRIN, invalidId)).toThrow(
                message,
            );
        }
    });
});

describe('BoatracePlaceIdSchema', () => {
    it('異常系: 不正なBoatracePlaceId', () => {
        const invalidBoatracePlaceIdAndMessage = [
            ['abc2021080101', 'boatraceから始まる必要があります'],
            ['2021boatrace080101', 'boatraceから始まる必要があります'],
            ['boatrace202108010', 'boatracePlaceIdの形式ではありません'],
            ['jra2021080101', 'boatraceから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidBoatracePlaceIdAndMessage) {
            expect(() => validatePlaceId(RaceType.BOATRACE, invalidId)).toThrow(
                message,
            );
        }
    });
});

describe('AutoracePlaceIdSchema', () => {
    it('異常系: 不正なAutoracePlaceId', () => {
        const invalidAutoracePlaceIdAndMessage = [
            ['abc2021080101', 'autoraceから始まる必要があります'],
            ['2021autorace080101', 'autoraceから始まる必要があります'],
            ['autorace202108010', 'autoracePlaceIdの形式ではありません'],
            ['jra2021080101', 'autoraceから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidAutoracePlaceIdAndMessage) {
            expect(() => validatePlaceId(RaceType.AUTORACE, invalidId)).toThrow(
                message,
            );
        }
    });
});
