import {
    type PlayerNumber,
    validatePlayerNumber,
} from '../utility/data/common/playerNumber';
import type { PositionNumber } from '../utility/data/common/positionNumber';
import { validatePositionNumber } from '../utility/data/common/positionNumber';
import type { RaceType } from '../utility/raceType';


export class RacePlayerData {
    
    public readonly raceType: RaceType;
    
    public readonly positionNumber: PositionNumber;
    
    public readonly playerNumber: PlayerNumber;

    
    private constructor(
        raceType: RaceType,
        positionNumber: PositionNumber,
        playerNumber: PlayerNumber,
    ) {
        this.raceType = raceType;
        this.positionNumber = positionNumber;
        this.playerNumber = playerNumber;
    }

    
    public static create(
        raceType: RaceType,
        positionNumber: number,
        playerNumber: number,
    ): RacePlayerData {
        return new RacePlayerData(
            raceType,
            validatePositionNumber(raceType, positionNumber),
            validatePlayerNumber(playerNumber),
        );
    }

    
    public copy(partial: Partial<RacePlayerData> = {}): RacePlayerData {
        return RacePlayerData.create(
            partial.raceType ?? this.raceType,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }
}
