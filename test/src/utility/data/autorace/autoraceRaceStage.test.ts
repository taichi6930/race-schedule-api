import { validateAutoraceRaceStage } from '../../../../../lib/src/utility/data/common/raceStage';

/**
 * AutoraceRaceStageクラスのテスト
 */
describe('RaceStage', () => {
    describe('validateAutoraceRaceStage', () => {
        it('正常系', () => {
            expect(validateAutoraceRaceStage('優勝戦')).toBe('優勝戦');
            expect(validateAutoraceRaceStage('準決勝戦')).toBe('準決勝戦');
            expect(validateAutoraceRaceStage('特別選抜戦')).toBe('特別選抜戦');
            expect(validateAutoraceRaceStage('特別一般戦')).toBe('特別一般戦');
            expect(validateAutoraceRaceStage('一般戦')).toBe('一般戦');
            expect(validateAutoraceRaceStage('予選')).toBe('予選');
            expect(validateAutoraceRaceStage('選抜予選')).toBe('選抜予選');
            expect(validateAutoraceRaceStage('最終予選')).toBe('最終予選');
            expect(validateAutoraceRaceStage('オーバル特別')).toBe(
                'オーバル特別',
            );
            expect(validateAutoraceRaceStage('選抜戦')).toBe('選抜戦');
        });

        it('異常系', () => {
            expect(() => validateAutoraceRaceStage('不正なステージ')).toThrow(
                'オートレースのステージではありません',
            );
        });
    });
});
