import { validateRaceStage } from '../../../../../lib/src/utility/data/common/raceStage';
import { RaceType } from '../../../../../lib/src/utility/raceType';

/**
 * KeirinRaceStageクラスのテスト
 */
describe('RaceStage', () => {
    describe('validateKeirinRaceStage', () => {
        it('正常系', () => {
            expect(validateRaceStage(RaceType.KEIRIN, 'S級決勝')).toBe(
                'S級決勝',
            );
        });

        it('異常系', () => {
            expect(() =>
                validateRaceStage(RaceType.KEIRIN, '不正なステージ'),
            ).toThrow('競輪のステージではありません');
        });
    });
});
