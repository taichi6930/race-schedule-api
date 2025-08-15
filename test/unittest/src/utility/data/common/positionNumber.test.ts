import { validatePositionNumber } from '../../../../../../lib/src/utility/data/common/positionNumber';
import { RaceType } from '../../../../../../lib/src/utility/raceType';

/**
 * PositionNumberのテスト
 */
describe('PositionNumber', () => {
    for (const { raceType } of [
        { raceType: RaceType.JRA },
        { raceType: RaceType.NAR },
        { raceType: RaceType.OVERSEAS },
        { raceType: RaceType.KEIRIN },
        { raceType: RaceType.AUTORACE },
        { raceType: RaceType.BOATRACE },
    ]) {
        it(`正常系: 枠番が正常な場合(${raceType})`, () => {
            const positionNumber = 1;
            const result = validatePositionNumber(raceType, positionNumber);
            expect(result).toBe(positionNumber);
        });

        it(`異常系: 枠番が異常な場合(${raceType})`, () => {
            const positionNumber = -1;
            expect(() =>
                validatePositionNumber(raceType, positionNumber),
            ).toThrow('枠番は1以上である必要があります');
        });
    }
});
