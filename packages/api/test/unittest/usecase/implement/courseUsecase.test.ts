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
            const courseList = RaceCourseMasterList;
            serviceSetup.courseService.fetch.mockResolvedValue(courseList);
            const result = await usecase.fetch(types);
            expect(result.length).toEqual(expected);
        });
    });
});
