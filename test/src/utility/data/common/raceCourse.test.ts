import { validateRaceCourse } from '../../../../../lib/src/utility/data/common/raceCourse';
import { RaceType } from '../../../../../lib/src/utility/raceType';

/**
 * RaceCourseのテスト
 */
describe('RaceCourse', () => {
    for (const {
        descriptions,
        okCourse,
        ngCourse,
        raceType,
        falseDescriptions,
    } of [
        {
            descriptions: '中央競馬の開催場',
            okCourse: '東京',
            ngCourse: '大井',
            raceType: RaceType.JRA,
            falseDescriptions: '中央の競馬場ではありません',
        },
        {
            descriptions: '地方競馬の開催場',
            okCourse: '大井',
            ngCourse: '東京',
            raceType: RaceType.NAR,
            falseDescriptions: '地方の競馬場ではありません',
        },
        {
            descriptions: '海外競馬の開催場',
            okCourse: 'ロンシャン',
            ngCourse: '東京',
            raceType: RaceType.WORLD,
            falseDescriptions: '海外の競馬場ではありません',
        },
        {
            descriptions: '競輪の開催場',
            okCourse: '平塚',
            ngCourse: '東京',
            raceType: RaceType.KEIRIN,
            falseDescriptions: '競輪場ではありません',
        },
        {
            descriptions: 'オートレースの開催場',
            okCourse: '川口',
            ngCourse: '東京',
            raceType: RaceType.AUTORACE,
            falseDescriptions: 'オートレース場ではありません',
        },
        {
            descriptions: 'ボートレースの開催場',
            okCourse: '浜名湖',
            ngCourse: '東京',
            raceType: RaceType.BOATRACE,
            falseDescriptions: 'ボートレース場ではありません',
        },
    ]) {
        it(`正常系: ${raceType}の開催場が正常な場合 - ${descriptions}`, () => {
            const result = validateRaceCourse(raceType, okCourse);
            expect(result).toBe(okCourse);
        });

        it(`異常系: ${raceType}の競馬場が異常な場合 - ${falseDescriptions}`, () => {
            expect(() => validateRaceCourse(raceType, ngCourse)).toThrow(
                falseDescriptions,
            );
        });
    }
});
