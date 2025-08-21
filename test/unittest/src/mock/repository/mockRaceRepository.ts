import type { IRaceRepository } from '../../../../../lib/src/repository/interface/IRaceRepository';

export const mockRaceRepository = (): jest.Mocked<IRaceRepository> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue(Promise.resolve([])),
        registerRaceEntityList: jest.fn().mockResolvedValue(Promise.resolve()),
    };
};
