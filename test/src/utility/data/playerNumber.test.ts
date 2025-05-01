import { validatePlayerNumber } from '../../../../lib/src/utility/data/playerNumber';

/**
 * PlayerNumberのテスト
 */
describe('PlayerNumber', () => {
    it('正常系: 選手番号が正常な場合', () => {
        const playerNumber = 1;
        const result = validatePlayerNumber(playerNumber);
        expect(result).toBe(playerNumber);
    });

    it('異常系: 選手番号が異常な場合', () => {
        const playerNumber = -1;
        expect(() => validatePlayerNumber(playerNumber)).toThrow(
            '選手番号は1以上である必要があります',
        );
    });
});
