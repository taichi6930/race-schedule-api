import type { PlayerData } from '../../domain/playerData';
import type { RaceType } from '../../utility/raceType';


export interface IPlayerDataUseCase {
    
    fetchPlayerDataList: (raceTypeList: RaceType[]) => Promise<PlayerData[]>;
}
