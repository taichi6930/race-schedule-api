import { validatePlayerNumber } from '../utility/data/common/playerNumber';
import type { RaceType } from '../utility/raceType';


export class PlayerData {
    
    private constructor(
        public readonly raceType: RaceType,
        public readonly playerNumber: number,
        public readonly name: string,
        public readonly priority: number,
    ) {}

    
    public static create(
        raceType: RaceType,
        playerNumber: number,
        name: string,
        priority: number,
    ): PlayerData {
        return new PlayerData(
            raceType,
            validatePlayerNumber(playerNumber),
            name,
            priority,
        );
    }

    
    public copy(partial: Partial<PlayerData> = {}): PlayerData {
        return PlayerData.create(
            partial.raceType ?? this.raceType,
            partial.playerNumber ?? this.playerNumber,
            partial.name ?? this.name,
            partial.priority ?? this.priority,
        );
    }
}
