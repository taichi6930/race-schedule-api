import type { IPlaceEntity } from '../../../../lib/src/repository/entity/iPlaceEntity';
import type { IRaceEntity } from '../../../../lib/src/repository/entity/iRaceEntity';
import type { IOldRaceDataService } from '../../../../lib/src/service/interface/IOldRaceDataService';

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
