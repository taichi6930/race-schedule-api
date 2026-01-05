import 'reflect-metadata';

import { container } from 'tsyringe';

import { CourseRepositoryStub } from './repository/implement/courseRepositoryStub';
import type { ICourseRepository } from './repository/interface/ICourseRepository';
import { CourseService } from './service/implement/courseService';
import type { ICourseService } from './service/interface/ICourseService';
import { CourseUseCase } from './usecase/implement/courseUseCase';
import type { ICourseUseCase } from './usecase/interface/ICourseUseCase';

container.register<ICourseRepository>('CourseRepository', {
    useClass: CourseRepositoryStub,
});

container.register<ICourseService>('CourseService', {
    useClass: CourseService,
});

container.register<ICourseUseCase>('CourseUseCase', {
    useClass: CourseUseCase,
});

export { container } from 'tsyringe';
