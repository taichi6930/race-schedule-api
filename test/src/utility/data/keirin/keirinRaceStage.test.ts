import { validateKeirinRaceStage } from '../../../../../lib/src/utility/data/common/raceStage';

/**
 * KeirinRaceStageクラスのテスト
 */
describe('KeirinRaceStage', () => {
    describe('validateKeirinRaceStage', () => {
        it('正常系', () => {
            expect(validateKeirinRaceStage('S級決勝')).toBe('S級決勝');
        });

        it('異常系', () => {
            expect(() => validateKeirinRaceStage('不正なステージ')).toThrow(
                '競輪のステージではありません',
            );
        });
    });
});
