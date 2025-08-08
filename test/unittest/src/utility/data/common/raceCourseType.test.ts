import {
    RaceCourseType,
    validateRaceCourseType,
} from '../../../../../../lib/src/utility/data/common/raceCourseType';

/**
 * RaceCourseTypeのテスト
 */
describe('RaceCourseType', () => {
    it('正常系: 競馬場タイプが正常な場合', () => {
        const courseType = RaceCourseType.TURF;
        const result = validateRaceCourseType(courseType);
        expect(result).toBe(courseType);
    });

    it('異常系: 競馬場タイプが異常な場合', () => {
        const courseType = 'テスト';
        expect(() => validateRaceCourseType(courseType)).toThrow(
            '無効な競馬場種別です',
        );
    });
});
