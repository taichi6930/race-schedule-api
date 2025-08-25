import { RaceType } from '../../../../../lib/src/utility/raceType';
import { validateRaceStage } from '../../../../../lib/src/utility/validateAndType/raceStage';
import { testRaceTypeListMechanicalRacing } from '../../mock/common/baseCommonData';

/**
 * RaceStageクラスのテスト
 */
describe('RaceStage', () => {
    describe('validateRaceStage', () => {
        it('正常系', () => {
            expect(validateRaceStage(RaceType.KEIRIN, 'S級決勝')).toBe(
                'S級決勝',
            );
            expect(validateRaceStage(RaceType.AUTORACE, '優勝戦')).toBe(
                '優勝戦',
            );
            expect(validateRaceStage(RaceType.AUTORACE, '準決勝戦')).toBe(
                '準決勝戦',
            );
            expect(validateRaceStage(RaceType.AUTORACE, '特別選抜戦')).toBe(
                '特別選抜戦',
            );
            expect(validateRaceStage(RaceType.AUTORACE, '特別一般戦')).toBe(
                '特別一般戦',
            );
            expect(validateRaceStage(RaceType.AUTORACE, '一般戦')).toBe(
                '一般戦',
            );
            expect(validateRaceStage(RaceType.AUTORACE, '予選')).toBe('予選');
            expect(validateRaceStage(RaceType.AUTORACE, '選抜予選')).toBe(
                '選抜予選',
            );
            expect(validateRaceStage(RaceType.AUTORACE, '最終予選')).toBe(
                '最終予選',
            );
            expect(validateRaceStage(RaceType.AUTORACE, 'オーバル特別')).toBe(
                'オーバル特別',
            );
            expect(validateRaceStage(RaceType.AUTORACE, '選抜戦')).toBe(
                '選抜戦',
            );
            expect(validateRaceStage(RaceType.BOATRACE, '優勝戦')).toBe(
                '優勝戦',
            );
        });

        it.each(testRaceTypeListMechanicalRacing)('異常系 %s', (raceType) => {
            expect(() => validateRaceStage(raceType, '不正なステージ')).toThrow(
                `${raceType}の開催ステージではありません`,
            );
        });
    });
});
