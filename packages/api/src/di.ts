import 'reflect-metadata';

import { container } from 'tsyringe';

import { CourseRepositoryStub } from './repository/implement/courseRepositoryStub';
import type { ICourseRepository } from './repository/interface/ICourseRepository';
import { CourseService } from './service/implement/courseService';
import type { ICourseService } from './service/interface/ICourseService';
import { CourseUseCase } from './usecase/implement/courseUseCase';
import type { ICourseUseCase } from './usecase/interface/ICourseUseCase';

export type EnvName = 'local' | 'test' | 'production';

export function setupDi(env?: EnvName): void {
    let selectedEnv: EnvName = 'local';
    if (env) selectedEnv = env;
    else if (typeof process.env.NODE_ENV === 'string')
        selectedEnv = process.env.NODE_ENV as EnvName;
    // Repository selection per environment (currently only Stub exists)
    if (selectedEnv === 'production') {
        // In future, switch to production repository implementation
        container.register<ICourseRepository>('ICourseRepository', {
            useClass: CourseRepositoryStub,
        });
    } else if (selectedEnv === 'test') {
        container.register<ICourseRepository>('ICourseRepository', {
            useClass: CourseRepositoryStub,
        });
    } else {
        // local
        container.register<ICourseRepository>('ICourseRepository', {
            useClass: CourseRepositoryStub,
        });
    }

    // Service & Usecase registrations (same across envs for now)
    container.register<ICourseService>('ICourseService', {
        useClass: CourseService,
    });
    container.register<ICourseUseCase>('CourseUsecase', {
        useClass: CourseUseCase,
    });
}

export { container } from 'tsyringe';
