import { validateRacePlayerId } from '../../../../../../lib/src/utility/validateAndType/racePlayerId';
import { RaceType } from '../../../../../../src/utility/raceType';

describe('racePlayerIdSchema', () => {
    for (const { raceType, racePlayerId } of [
        {
            raceType: RaceType.KEIRIN,
            racePlayerId: 'keirin20210801010101',
        },
        {
            raceType: RaceType.AUTORACE,
            racePlayerId: 'autorace20210801010101',
        },
        {
            raceType: RaceType.BOATRACE,
            racePlayerId: 'boatrace20210801010101',
        },
    ]) {
        it(`正常系: ${raceType}のRacePlayerIdが正常な場合`, () => {
            expect(validateRacePlayerId(raceType, racePlayerId)).toBe(
                racePlayerId,
            );
        });
    }

    for (const { raceType, invalidRacePlayerId, message } of [
        {
            raceType: RaceType.KEIRIN,
            invalidRacePlayerId: 'keirinabc202108010101',
            message: 'keirinRacePlayerIdの形式ではありません',
        },
        {
            raceType: RaceType.KEIRIN,
            invalidRacePlayerId: 'keirin2021keirin08010101',
            message: 'keirinRacePlayerIdの形式ではありません',
        },
        {
            raceType: RaceType.KEIRIN,
            invalidRacePlayerId: 'keirin202108010101',
            message: 'keirinRacePlayerIdの形式ではありません',
        },
        {
            raceType: RaceType.AUTORACE,
            invalidRacePlayerId: 'autoraceabc202108010101',
            message: 'autoraceRacePlayerIdの形式ではありません',
        },
        {
            raceType: RaceType.AUTORACE,
            invalidRacePlayerId: 'autorace2021autorace08010101',
            message: 'autoraceRacePlayerIdの形式ではありません',
        },
        {
            raceType: RaceType.AUTORACE,
            invalidRacePlayerId: 'autorace202108010101',
            message: 'autoraceRacePlayerIdの形式ではありません',
        },
        {
            raceType: RaceType.AUTORACE,
            invalidRacePlayerId: 'jra20210801010101',
            message: 'autoraceから始まる必要があります',
        },
        {
            raceType: RaceType.AUTORACE,
            invalidRacePlayerId: 'autorace20210801010113',
            message: '枠番が不正です',
        },
        {
            raceType: RaceType.BOATRACE,
            invalidRacePlayerId: 'boatraceabc202108010101',
            message: 'boatraceRacePlayerIdの形式ではありません',
        },
        {
            raceType: RaceType.BOATRACE,
            invalidRacePlayerId: 'boatrace2021boatrace08010101',
            message: 'boatraceRacePlayerIdの形式ではありません',
        },
        {
            raceType: RaceType.BOATRACE,
            invalidRacePlayerId: 'boatrace202108010101',
            message: 'boatraceRacePlayerIdの形式ではありません',
        },
        {
            raceType: RaceType.BOATRACE,
            invalidRacePlayerId: 'jra20210801010101',
            message: 'boatraceから始まる必要があります',
        },
        {
            raceType: RaceType.BOATRACE,
            invalidRacePlayerId: 'boatrace20210801010113',
            message: '枠番が不正です',
        },
    ]) {
        it(`異常系: ${raceType}のRacePlayerIdが不正な場合`, () => {
            expect(() =>
                validateRacePlayerId(raceType, invalidRacePlayerId),
            ).toThrow(message);
        });
    }
});
