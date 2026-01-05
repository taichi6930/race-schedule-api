import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Course } from '../../shared/src/types/course';
import { CourseCodeType } from '../../shared/src/types/courseCodeType';
import { RaceType } from '../../shared/src/types/raceType';
import type { ICourseService } from '../src/service/interface/ICourseService';
import { CourseUseCase } from '../src/usecase/implement/courseUseCase';

describe('CourseUseCase', () => {
    let service: ICourseService & { fetch: any };
    let usecase: CourseUseCase;

    const allCourses: Course[] = [
        {
            raceType: RaceType.JRA,
            courseCodeType: CourseCodeType.OFFICIAL,
            placeName: 'A',
            placeCode: 'A',
        },
        {
            raceType: RaceType.JRA,
            courseCodeType: CourseCodeType.NETKEIBA,
            placeName: 'B',
            placeCode: 'B',
        },
    ];

    beforeEach(() => {
        service = {
            fetch: vi.fn(),
        } as unknown as ICourseService & { fetch: any };

        usecase = new CourseUseCase(service);
    });

    it('fetch delegates to CourseService.fetch and returns result', async () => {
        (service.fetch as any).mockResolvedValue(allCourses);

        const res = await usecase.fetch([CourseCodeType.OFFICIAL]);

        expect(service.fetch).toHaveBeenCalledWith([CourseCodeType.OFFICIAL]);
        expect(res).toEqual(allCourses);
    });

    it('fetch propagates errors from service', async () => {
        const err = new Error('service failure');
        (service.fetch as any).mockRejectedValue(err);

        await expect(
            usecase.fetch([CourseCodeType.OFFICIAL]),
        ).rejects.toThrowError(err);
    });
});
