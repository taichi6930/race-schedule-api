import type { IRaceServiceForAWS } from '../../../../../../lib/src/service/interface/IRaceService';

/**
 * RaceDataServiceのモックを作成する
 * @returns モック化されたIRaceDataServiceインターフェースのインスタンス
 */
export const raceDataServiceForAWSMock =
    (): jest.Mocked<IRaceServiceForAWS> => {
        return {
            fetchRaceEntityList: jest.fn().mockResolvedValue([]),
            updateRaceEntityList: jest.fn().mockResolvedValue([]),
        };
    };
