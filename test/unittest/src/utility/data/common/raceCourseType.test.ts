import { validateRaceCourseType } from '../../../../../../lib/src/utility/data/common/raceCourseType';

/**
 * RaceCourseTypeのテスト
 */
describe('RaceCourseType', () => {
    it('正常系: 競馬場タイプが正常な場合', () => {
        const courseType = '芝';
        const result = validateRaceCourseType(courseType);
        expect(result).toBe(courseType);
    });

    it('異常系: 競馬場タイプが異常な場合', () => {
        const courseType = 'テスト';
        expect(() => validateRaceCourseType(courseType)).toThrow(
            '有効な競馬場種別ではありません',
        );
    });
});
