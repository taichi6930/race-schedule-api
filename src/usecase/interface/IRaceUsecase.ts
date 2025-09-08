import type { CommonParameter } from '../../commonParameter';
import type { RaceEntity } from '../../repository/entity/raceEntity';

export interface IRaceUseCase {
    fetchRaceEntityList: (
        commonParameter: CommonParameter,
    ) => Promise<RaceEntity[]>;
}
