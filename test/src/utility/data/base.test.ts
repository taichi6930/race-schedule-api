import { GradeTypeSchema } from '../../../../lib/src/utility/data/common/gradeType';
import { UnionRaceCourseSchema } from '../../../../lib/src/utility/data/common/raceCourse';
import { RaceStageSchema } from '../../../../lib/src/utility/data/common/raceStage';

describe('GradeType', () => {
    it('GradeTypeに適した値を入力すると、その値が返却される', () => {
        const value = 'SG';
        const actual = GradeTypeSchema.parse(value);
        expect(actual).toBe(value);
    });
});

describe('RaceCourse', () => {
    it('RaceCourseに適した値を入力すると、その値が返却される', () => {
        const value = '東京';
        const actual = UnionRaceCourseSchema.parse(value);
        expect(actual).toBe(value);
    });
});

describe('RaceStage', () => {
    it('RaceStageに適した値を入力すると、その値が返却される', () => {
        const value = 'S級決勝';
        const actual = RaceStageSchema.parse(value);
        expect(actual).toBe(value);
    });
});
