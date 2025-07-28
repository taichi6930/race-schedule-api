import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';
import { baseAutoraceRaceEntityList } from '../common/baseAutoraceData';

export const raceDataServiceMock = (): jest.Mocked<IRaceDataService> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue({
            autorace: baseAutoraceRaceEntityList,
        }),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
