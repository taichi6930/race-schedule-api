import { CommonParameter } from '../..';

export interface IPlayerRepository {
    getPlayerDataList(commonParameter: CommonParameter): Promise<any[]>;
}
