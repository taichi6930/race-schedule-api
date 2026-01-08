import 'reflect-metadata';
import { beforeEach, describe, expect, it } from 'vitest';

import { CourseService } from './../../../../src/service/implement/courseService';

import { container } from 'tsyringe';

import { CourseCodeType } from '../../../../../shared/src/types/courseCodeType';
import {
    clearMocks,
    setupTestRepositoryMock,
    TestRepositorySetup,
} from '../../../testSetupHelper';
import { ICourseService } from './../../../../src/service/interface/ICourseService';

describe('CourseService', () => {
    let service: ICourseService;
    let repositorySetup: TestRepositorySetup;

    beforeEach(() => {
        repositorySetup = setupTestRepositoryMock();
        service = container.resolve(CourseService);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetch', () => {
        it.each([
            {
                types: [CourseCodeType.OFFICIAL, CourseCodeType.NETKEIBA],
                expected: 193,
                desc: '両方指定して正常に取得できること',
            },
            {
                types: [CourseCodeType.OFFICIAL],
                expected: 155,
                desc: 'OFFICIALのみ指定して正常に取得できること',
            },
            {
                types: [CourseCodeType.NETKEIBA],
                expected: 38,
                desc: 'NETKEIBAのみ指定して正常に取得できること',
            },
        ])('$desc', async ({ types, expected }) => {
            const result = await service.fetch(types);
            expect(result.length).toEqual(expected);
        });
    });
});
