import { container } from 'tsyringe';

import { CourseController } from './controller/courseController';
import { CourseRepositoryStub } from './repository/implement/courseRepositoryStub';
import { CourseService } from './service/implement/courseService';
import { CourseUseCase } from './usecase/implement/courseUseCase';

// DI登録
container.register('CourseRepository', { useClass: CourseRepositoryStub });
container.register('CourseService', { useClass: CourseService });
container.register('CourseUsecase', { useClass: CourseUseCase });

export const courseController = container.resolve(CourseController);
