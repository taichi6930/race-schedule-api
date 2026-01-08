import 'reflect-metadata';
import { ICourseRepository } from './../src/repository/interface/ICourseRepository';

import { container } from 'tsyringe';
import { mockCourseRepository } from './mock/repository/mockCourseRepository';

/**
 * afterEach処理の共通化
 */
export const clearMocks = (): void => {
    jest.clearAllMocks();
};

/**
 * テスト用のセットアップ
 */
export interface TestRepositorySetup {
    // calendarRepository: jest.Mocked<ICalendarRepository>;
    courseRepository: jest.Mocked<ICourseRepository>;
}

/**
 * テスト用のセットアップ
 * @returns セットアップ済みのサービス
 */
export const setupTestRepositoryMock = (): TestRepositorySetup => {
    // const calendarRepository = mockCalendarRepository();
    // container.registerInstance('CalendarRepository', calendarRepository);

    const courseRepository = mockCourseRepository();
    container.registerInstance<ICourseRepository>(
        'CourseRepository',
        courseRepository,
    );
    return {
        // calendarRepository,
        courseRepository,
    };
};
