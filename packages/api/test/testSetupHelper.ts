import 'reflect-metadata';
import { container } from 'tsyringe';
import { ICourseService } from '../src/service/interface/ICourseService';
import { ICourseRepository } from './../src/repository/interface/ICourseRepository';
import { mockCourseRepository } from './mock/repository/mockCourseRepository';
import { mockCourseService } from './mock/service/mockCourseService';

// afterEachで使用する共通のモッククリア関数
export const clearMocks = (): void => {
    jest.clearAllMocks();
};

// Repositoryモックの型
export interface TestRepositorySetup {
    courseRepository: jest.Mocked<ICourseRepository>;
}

// Serviceモックの型
export interface TestServiceSetup {
    courseService: jest.Mocked<ICourseService>;
}

// RepositoryモックをDIコンテナへ登録し返却
export const setupTestRepositoryMock = (): TestRepositorySetup => {
    const courseRepository = mockCourseRepository();
    container.registerInstance<ICourseRepository>(
        'CourseRepository',
        courseRepository,
    );
    return { courseRepository };
};

// ServiceモックをDIコンテナへ登録し返却
export const setupTestServiceMock = (): TestServiceSetup => {
    const courseService = mockCourseService();
    container.registerInstance<ICourseService>('CourseService', courseService);
    return { courseService };
};
