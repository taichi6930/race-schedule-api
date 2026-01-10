import 'reflect-metadata';
import { beforeEach, describe, expect, it } from 'vitest';
import { CourseCodeType } from '../../../../../shared/src/types/courseCodeType';
import { RaceCourseMasterList } from '../../../../../shared/src/utilities/course'; /**
 * ディシジョンテーブル
 * | 種別   | types                                              | expected | 説明              |
 * |-------|----------------------------------------------------|----------|------------------|
 * | 正常系 | [CourseCodeType.OFFICIAL, CourseCodeType.NETKEIBA] | 193      | 両方指定          |
 * | 正常系 | [CourseCodeType.OFFICIAL]                          | 155      | OFFICIALのみ指定  |
 * | 正常系 | [CourseCodeType.NETKEIBA]                          | 38       | NETKEIBAのみ指定  |
 */

import { CourseUsecase } from '../../../../src/usecase/implement/courseUsecase';
import { ICourseUsecase } from '../../../../src/usecase/interface/ICourseUsecase';

import { container } from 'tsyringe';

import {
    clearMocks,
    setupTestServiceMock,
    TestServiceSetup,
} from '../../../testSetupHelper';

describe('CourseUsecase', () => {
    let usecase: ICourseUsecase;
    let serviceSetup: TestServiceSetup;

    beforeEach(() => {
        serviceSetup = setupTestServiceMock();
        usecase = container.resolve(CourseUsecase);
    });

    afterEach(() => {
        clearMocks();
    });

    describe('fetch', () => {
        it('正常に取得できること', async () => {
            const courseList = RaceCourseMasterList;
            serviceSetup.courseService.fetch.mockResolvedValue(courseList);
            const result = await usecase.fetch([
                CourseCodeType.OFFICIAL,
                CourseCodeType.NETKEIBA,
            ]);
            expect(193).toEqual(result.length);
        });
    });
});
