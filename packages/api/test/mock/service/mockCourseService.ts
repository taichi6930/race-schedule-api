import { ICourseService } from '../../../src/service/interface/ICourseService';

export const mockCourseService = (): jest.Mocked<ICourseService> => {
    return {
        fetch: jest.fn(),
    };
};
