import type { IPlaceEntity } from '../../../../lib/src/repository/entity/iPlaceEntity';
import type { IRaceEntity } from '../../../../lib/src/repository/entity/iRaceEntity';
import type { IRaceDataService } from '../../../../lib/src/service/interface/IRaceDataService';

/**
 * RaceDataServiceのモックを作成する
 * @returns モック化されたIRaceDataServiceインターフェースのインスタンス
 */
export const raceDataServiceMock = <
    R extends IRaceEntity<R>,
    P extends IPlaceEntity<P>,
>(): jest.Mocked<IRaceDataService<R, P>> => {
    return {
        fetchRaceEntityList: jest.fn().mockResolvedValue([] as R[]),
        updateRaceEntityList: jest.fn().mockResolvedValue([]),
    };
};
