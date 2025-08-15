import { validateRaceId } from '../../../../../../lib/src/utility/data/common/raceId';
import { RaceType } from '../../../../../../lib/src/utility/raceType';

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
            expect(validateRaceId(raceType, raceId)).toBe(raceId);
        });
    }

    // 異常系
    for (const { raceType, invalidRaceId, message } of [
        // JRA
        {
            raceType: RaceType.JRA,
            invalidRaceId: 'jraabc2021080101',
            message: 'jraRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.JRA,
            invalidRaceId: 'jra2021jra080101',
            message: 'jraRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.JRA,
            invalidRaceId: 'jra202108010',
            message: 'jraRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.JRA,
            invalidRaceId: 'nar202108010101',
            message: 'jraから始まる必要があります',
        },
        {
            raceType: RaceType.JRA,
            invalidRaceId: 'jra202108010113',
            message: 'レース番号は1~12の範囲である必要があります',
        },
        // NAR
        {
            raceType: RaceType.NAR,
            invalidRaceId: 'narabc2021080101',
            message: 'narRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.NAR,
            invalidRaceId: 'nar2021nar080101',
            message: 'narRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.NAR,
            invalidRaceId: 'nar202108010',
            message: 'narRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.NAR,
            invalidRaceId: 'jra202108010101',
            message: 'narから始まる必要があります',
        },
        {
            raceType: RaceType.NAR,
            invalidRaceId: 'nar202108010113',
            message: 'レース番号は1~12の範囲である必要があります',
        },
        {
            raceType: RaceType.OVERSEAS,
            invalidRaceId: 'overseasabc2021080101',
            message: 'overseasRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.OVERSEAS,
            invalidRaceId: 'overseas2021overseas080101',
            message: 'overseasRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.OVERSEAS,
            invalidRaceId: 'overseas202108010',
            message: 'overseasRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.OVERSEAS,
            invalidRaceId: 'jra202108010101',
            message: 'overseasから始まる必要があります',
        },
        // KEIRIN
        {
            raceType: RaceType.KEIRIN,
            invalidRaceId: 'keirinabc2021080101',
            message: 'keirinRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.KEIRIN,
            invalidRaceId: 'keirin2021keirin080101',
            message: 'keirinRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.KEIRIN,
            invalidRaceId: 'keirin202108010',
            message: 'keirinRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.KEIRIN,
            invalidRaceId: 'jra202108010101',
            message: 'keirinから始まる必要があります',
        },
        {
            raceType: RaceType.KEIRIN,
            invalidRaceId: 'keirin202108010113',
            message: 'レース番号は1~12の範囲である必要があります',
        },
        // BOATRACE
        {
            raceType: RaceType.BOATRACE,
            invalidRaceId: 'boatraceabc2021080101',
            message: 'boatraceRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.BOATRACE,
            invalidRaceId: 'boatrace2021boatrace080101',
            message: 'boatraceRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.BOATRACE,
            invalidRaceId: 'boatrace202108010',
            message: 'boatraceRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.BOATRACE,
            invalidRaceId: 'jra202108010101',
            message: 'boatraceから始まる必要があります',
        },
        {
            raceType: RaceType.BOATRACE,
            invalidRaceId: 'boatrace202108010113',
            message: 'レース番号は1~12の範囲である必要があります',
        },
        // AUTORACE
        {
            raceType: RaceType.AUTORACE,
            invalidRaceId: 'autoraceabc2021080101',
            message: 'autoraceRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.AUTORACE,
            invalidRaceId: 'autorace2021autorace080101',
            message: 'autoraceRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.AUTORACE,
            invalidRaceId: 'autorace202108010',
            message: 'autoraceRaceIdの形式ではありません',
        },
        {
            raceType: RaceType.AUTORACE,
            invalidRaceId: 'jra202108010101',
            message: 'autoraceから始まる必要があります',
        },
        {
            raceType: RaceType.AUTORACE,
            invalidRaceId: 'autorace202108010113',
            message: 'レース番号は1~12の範囲である必要があります',
        },
    ]) {
        it(`異常系: ${raceType}のRaceIdが不正な場合`, () => {
            expect(() => validateRaceId(raceType, invalidRaceId)).toThrow(
                message,
            );
        });
    }
});

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
        expect(validateRaceId(raceType, raceId)).toBe(raceId);
    });
}

// 異常系
for (const { raceType, invalidRaceId, message } of [
    // JRA
    {
        raceType: RaceType.JRA,
        invalidRaceId: 'jraabc2021080101',
        message: 'jraRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.JRA,
        invalidRaceId: 'jra2021jra080101',
        message: 'jraRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.JRA,
        invalidRaceId: 'jra202108010',
        message: 'jraRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.JRA,
        invalidRaceId: 'nar202108010101',
        message: 'jraから始まる必要があります',
    },
    {
        raceType: RaceType.JRA,
        invalidRaceId: 'jra202108010113',
        message: 'レース番号は1~12の範囲である必要があります',
    },
    // NAR
    {
        raceType: RaceType.NAR,
        invalidRaceId: 'narabc2021080101',
        message: 'narRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.NAR,
        invalidRaceId: 'nar2021nar080101',
        message: 'narRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.NAR,
        invalidRaceId: 'nar202108010',
        message: 'narRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.NAR,
        invalidRaceId: 'jra202108010101',
        message: 'narから始まる必要があります',
    },
    {
        raceType: RaceType.NAR,
        invalidRaceId: 'nar202108010113',
        message: 'レース番号は1~12の範囲である必要があります',
    },
    {
        raceType: RaceType.OVERSEAS,
        invalidRaceId: 'overseasabc2021080101',
        message: 'overseasRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.OVERSEAS,
        invalidRaceId: 'overseas2021overseas080101',
        message: 'overseasRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.OVERSEAS,
        invalidRaceId: 'overseas202108010',
        message: 'overseasRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.OVERSEAS,
        invalidRaceId: 'jra202108010101',
        message: 'overseasから始まる必要があります',
    },
    // KEIRIN
    {
        raceType: RaceType.KEIRIN,
        invalidRaceId: 'keirinabc2021080101',
        message: 'keirinRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.KEIRIN,
        invalidRaceId: 'keirin2021keirin080101',
        message: 'keirinRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.KEIRIN,
        invalidRaceId: 'keirin202108010',
        message: 'keirinRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.KEIRIN,
        invalidRaceId: 'jra202108010101',
        message: 'keirinから始まる必要があります',
    },
    {
        raceType: RaceType.KEIRIN,
        invalidRaceId: 'keirin202108010113',
        message: 'レース番号は1~12の範囲である必要があります',
    },
    // BOATRACE
    {
        raceType: RaceType.BOATRACE,
        invalidRaceId: 'boatraceabc2021080101',
        message: 'boatraceRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.BOATRACE,
        invalidRaceId: 'boatrace2021boatrace080101',
        message: 'boatraceRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.BOATRACE,
        invalidRaceId: 'boatrace202108010',
        message: 'boatraceRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.BOATRACE,
        invalidRaceId: 'jra202108010101',
        message: 'boatraceから始まる必要があります',
    },
    {
        raceType: RaceType.BOATRACE,
        invalidRaceId: 'boatrace202108010113',
        message: 'レース番号は1~12の範囲である必要があります',
    },
    // AUTORACE
    {
        raceType: RaceType.AUTORACE,
        invalidRaceId: 'autoraceabc2021080101',
        message: 'autoraceRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.AUTORACE,
        invalidRaceId: 'autorace2021autorace080101',
        message: 'autoraceRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.AUTORACE,
        invalidRaceId: 'autorace202108010',
        message: 'autoraceRaceIdの形式ではありません',
    },
    {
        raceType: RaceType.AUTORACE,
        invalidRaceId: 'jra202108010101',
        message: 'autoraceから始まる必要があります',
    },
    {
        raceType: RaceType.AUTORACE,
        invalidRaceId: 'autorace202108010113',
        message: 'レース番号は1~12の範囲である必要があります',
    },
]) {
    it(`異常系: ${raceType}のRaceIdが不正な場合`, () => {
        expect(() => validateRaceId(raceType, invalidRaceId)).toThrow(message);
    });
}
