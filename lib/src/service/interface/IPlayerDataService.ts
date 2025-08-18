import type { PlayerData } from '../../domain/playerData';
import type { RaceType } from '../../utility/raceType';

export interface IPlayerDataService {
    
    fetchPlayerDataList: (type: RaceType) => Promise<PlayerData[]>;
}
