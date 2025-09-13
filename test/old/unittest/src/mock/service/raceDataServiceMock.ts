import type { IRaceServiceForAWS } from '../../../../../../lib/src/service/interface/IRaceServiceForAWS';

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
