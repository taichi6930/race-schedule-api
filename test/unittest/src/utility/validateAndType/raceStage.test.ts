import { RaceType } from '../../../../../lib/src/utility/raceType';
import { validateRaceStage } from '../../../../../lib/src/utility/validateAndType/raceStage';
import { testRaceTypeListMechanicalRacing } from '../../mock/common/baseCommonData';

const testCases = {
    [RaceType.KEIRIN]: ['S級決勝'],
    [RaceType.AUTORACE]: ['優勝戦', '準決勝戦', '特別選抜戦'],
    [RaceType.BOATRACE]: ['優勝戦'],
};

/**
 * RaceStageクラスのテスト
 */
describe.each(testRaceTypeListMechanicalRacing)(
    'validateRaceStage(%s)',
    (raceType) => {
        test('正常系', () => {
            for (const stage of testCases[raceType]) {
                expect(() => validateRaceStage(raceType, stage)).not.toThrow();
            }
        });
        it('異常系', () => {
            expect(() => validateRaceStage(raceType, '不正なステージ')).toThrow(
                `${raceType}の開催ステージではありません`,
            );
        });
    },
);
