import type { IPlaceRepository } from '../../../../../lib/src/repository/interface/IPlaceRepository';

export const mockPlaceRepository = (): jest.Mocked<IPlaceRepository> => {
    return {
        fetchPlaceEntityList: jest.fn().mockResolvedValue(Promise.resolve([])),
        registerPlaceEntityList: jest.fn().mockResolvedValue(Promise.resolve()),
    };
};
