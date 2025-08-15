import { validateRaceCourse } from '../../../../../../lib/src/utility/data/common/raceCourse';
import { RaceType } from '../../../../../../lib/src/utility/raceType';

/**
 * RaceCourseのテスト
 */
describe('RaceCourse', () => {
    for (const { okCourse, raceType } of [
        {
            okCourse: '東京',
            raceType: RaceType.JRA,
        },
        {
            okCourse: '大井',
            raceType: RaceType.NAR,
        },
        {
            okCourse: 'ロンシャン',
            raceType: RaceType.OVERSEAS,
        },
        {
            okCourse: '平塚',
            raceType: RaceType.KEIRIN,
        },
        {
            okCourse: '川口',
            raceType: RaceType.AUTORACE,
        },
        {
            okCourse: '浜名湖',
            raceType: RaceType.BOATRACE,
        },
    ]) {
        it(`正常系: ${raceType}の開催場が正常な場合`, () => {
            const result = validateRaceCourse(raceType, okCourse);
            expect(result).toBe(okCourse);
        });

        it(`異常系: ${raceType}の競馬場が異常な場合`, () => {
            expect(() => validateRaceCourse(raceType, '不正な開催場')).toThrow(
                `${raceType}の開催場ではありません`,
            );
        });
    }
});
