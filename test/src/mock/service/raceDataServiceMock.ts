import type { IPlaceEntity } from '../../../../lib/src/repository/entity/iPlaceEntity';
import type { IRaceEntity } from '../../../../lib/src/repository/entity/iRaceEntity';
import type { IOldRaceDataService } from '../../../../lib/src/service/interface/IOldRaceDataService';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';

/**
 * RaceDataServiceのモックを作成する
 * @returns モック化されたIRaceDataServiceインターフェースのインスタンス
 */
export const oldRaceDataServiceMock = <
    R extends IRaceEntity<R>,
    P extends IPlaceEntity<P>,
>(): jest.Mocked<IOldRaceDataService<R, P>> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([] as R[]),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};

export const raceDataServiceMock = (): jest.Mocked<IRaceDataService> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([]),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
