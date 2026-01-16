import { container } from 'tsyringe';

import { CourseController } from './controller/courseController';
import { DBGateway } from './gateway/implement/dbGateway';
import { CourseRepository } from './repository/implement/courseRepository';
import { CourseService } from './service/implement/courseService';
import { CourseUsecase } from './usecase/implement/courseUsecase';

// DI登録
container.register('DBGateway', { useClass: DBGateway });
container.register('CourseRepository', { useClass: CourseRepository });
container.register('CourseService', { useClass: CourseService });
container.register('CourseUsecase', { useClass: CourseUsecase });

export const courseController = container.resolve(CourseController);
