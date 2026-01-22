import { RaceType } from '../../../../../packages/shared/src/types/raceType';
import { validateRaceStage } from '../../../../../packages/shared/src/utilities/raceStage';
import { testRaceTypeListMechanicalRacing } from '../../mock/common/baseCommonData';

const testCases = {
    [RaceType.JRA]: [],
    [RaceType.NAR]: [],
    [RaceType.OVERSEAS]: [],
    [RaceType.KEIRIN]: ['S級決勝'],
    [RaceType.AUTORACE]: [],
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
        test('異常系', () => {
            expect(() => validateRaceStage(raceType, '不正なステージ')).toThrow(
                `${raceType}の開催ステージではありません`,
            );
        });
    },
);
