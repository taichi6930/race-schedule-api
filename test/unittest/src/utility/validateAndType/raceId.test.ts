import { RaceType } from '../../../../../src/utility/raceType';
import {
    IdType,
    validateId,
} from '../../../../../src/utility/validateAndType/idUtility';
import { testRaceTypeListAll } from '../../mock/common/baseCommonData';

describe('raceIdSchema', () => {
    // 正常系
    for (const { raceType, raceId } of [
        { raceType: RaceType.JRA, raceId: 'jra202108010101' },
        { raceType: RaceType.NAR, raceId: 'nar202108010101' },
        { raceType: RaceType.OVERSEAS, raceId: 'overseas202108010101' },
        { raceType: RaceType.KEIRIN, raceId: 'keirin202108010101' },
        { raceType: RaceType.BOATRACE, raceId: 'boatrace202108010101' },
        { raceType: RaceType.AUTORACE, raceId: 'autorace202108010101' },
    ]) {
        it(`正常系: ${raceType}のRaceIdが正常な場合`, () => {
            expect(validateId(IdType.RACE, raceType, raceId)).toBe(raceId);
        });
    }

    // 異常系
    const invalidRaceIdAndMessage = {
        [RaceType.JRA]: [
            ['jraabc2021080101', 'jraRaceIdの形式ではありません'],
            ['jra2021jra080101', 'jraRaceIdの形式ではありません'],
            ['jra202108010', 'jraRaceIdの形式ではありません'],
            ['nar202108010101', 'jraから始まる必要があります'],
            ['jra202108010113', 'レース番号は1~12の範囲である必要があります'],
        ],
        [RaceType.NAR]: [
            ['narabc2021080101', 'narRaceIdの形式ではありません'],
            ['nar2021nar080101', 'narRaceIdの形式ではありません'],
            ['nar202108010', 'narRaceIdの形式ではありません'],
            ['jra202108010101', 'narから始まる必要があります'],
            ['nar202108010113', 'レース番号は1~12の範囲である必要があります'],
        ],
        [RaceType.OVERSEAS]: [
            ['overseasabc2021080101', 'overseasRaceIdの形式ではありません'],
            [
                'overseas2021overseas080101',
                'overseasRaceIdの形式ではありません',
            ],
            ['overseas202108010', 'overseasRaceIdの形式ではありません'],
            ['jra202108010101', 'overseasから始まる必要があります'],
        ],
        [RaceType.KEIRIN]: [
            ['keirinabc2021080101', 'keirinRaceIdの形式ではありません'],
            ['keirin2021keirin080101', 'keirinRaceIdの形式ではありません'],
            ['keirin202108010', 'keirinRaceIdの形式ではありません'],
            ['jra202108010101', 'keirinから始まる必要があります'],
            [
                'keirin202108010113',
                'レース番号は1~12の範囲である必要があります',
            ],
        ],
        [RaceType.BOATRACE]: [
            ['boatraceabc2021080101', 'boatraceRaceIdの形式ではありません'],
            [
                'boatrace2021boatrace080101',
                'boatraceRaceIdの形式ではありません',
            ],
            ['boatrace202108010', 'boatraceRaceIdの形式ではありません'],
            ['jra202108010101', 'boatraceから始まる必要があります'],
            [
                'boatrace202108010113',
                'レース番号は1~12の範囲である必要があります',
            ],
        ],
        [RaceType.AUTORACE]: [
            ['autoraceabc2021080101', 'autoraceRaceIdの形式ではありません'],
            [
                'autorace2021autorace080101',
                'autoraceRaceIdの形式ではありません',
            ],
            ['autorace202108010', 'autoraceRaceIdの形式ではありません'],
            ['jra202108010101', 'autoraceから始まる必要があります'],
            [
                'autorace202108010113',
                'レース番号は1~12の範囲である必要があります',
            ],
        ],
    };

    for (const raceType of testRaceTypeListAll) {
        for (const [invalidRaceId, message] of invalidRaceIdAndMessage[
            raceType
        ]) {
            it(`異常系: ${raceType}のRaceIdが不正 (${invalidRaceId})`, () => {
                expect(() =>
                    validateId(IdType.RACE, raceType, invalidRaceId),
                ).toThrow(message);
            });
        }
    }
});
