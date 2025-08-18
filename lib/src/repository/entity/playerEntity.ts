import type { PlayerData } from '../../domain/playerData';


export const generatePlayerId = (
    raceType: string,
    playerNumber: number,
): string => {
    return `${raceType}${playerNumber.toString()}`;
};


export class PlayerEntity {
    
    private constructor(
        public readonly id: string,
        public readonly playerData: PlayerData,
    ) {}

    
    public static createWithoutId(playerData: PlayerData): PlayerEntity {
        return new PlayerEntity(
            generatePlayerId(playerData.raceType, playerData.playerNumber),
            playerData,
        );
    }

    
    public copy(partial: Partial<PlayerEntity> = {}): PlayerEntity {
        return new PlayerEntity(
            partial.id ?? this.id,
            partial.playerData ?? this.playerData,
        );
    }
}
