import { validateRaceCourse } from '../../../../../../lib/src/utility/data/common/raceCourse';
import { RaceType } from '../../../../../../lib/src/utility/raceType';

/**
 * RaceCourseのテスト
 */
describe('RaceCourse', () => {
    for (const { okCourse, ngCourse, raceType } of [
        {
            okCourse: '東京',
            ngCourse: '大井',
            raceType: RaceType.JRA,
        },
        {
            okCourse: '大井',
            ngCourse: '東京',
            raceType: RaceType.NAR,
        },
        {
            okCourse: 'ロンシャン',
            ngCourse: '東京',
            raceType: RaceType.WORLD,
        },
        {
            okCourse: '平塚',
            ngCourse: '東京',
            raceType: RaceType.KEIRIN,
        },
        {
            okCourse: '川口',
            ngCourse: '東京',
            raceType: RaceType.AUTORACE,
        },
        {
            okCourse: '浜名湖',
            ngCourse: '東京',
            raceType: RaceType.BOATRACE,
        },
    ]) {
        it(`正常系: ${raceType}の開催場が正常な場合`, () => {
            const result = validateRaceCourse(raceType, okCourse);
            expect(result).toBe(okCourse);
        });

        it(`異常系: ${raceType}の競馬場が異常な場合`, () => {
            expect(() => validateRaceCourse(raceType, ngCourse)).toThrow(
                `${raceType}の開催場ではありません`,
            );
        });
    }
});
