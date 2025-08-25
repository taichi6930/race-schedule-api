import { validateRaceSurfaceType } from '../../../../../../lib/src/utility/data/common/raceSurfaceType';

/**
 * RaceSurfaceTypeのテスト
 */
describe('RaceSurfaceType', () => {
    it('正常系: 競馬場タイプが正常な場合', () => {
        const surfaceType = '芝';
        const result = validateRaceSurfaceType(surfaceType);
        expect(result).toBe(surfaceType);
    });

    it('異常系: 競馬場タイプが異常な場合', () => {
        const surfaceType = 'テスト';
        expect(() => validateRaceSurfaceType(surfaceType)).toThrow(
            '有効な競馬場種別ではありません',
        );
    });
});
