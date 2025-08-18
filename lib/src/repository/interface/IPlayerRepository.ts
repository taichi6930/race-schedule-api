
export interface Player {
    id: string; 
    race_type: string;
    player_no: string;
    player_name: string;
    priority: number;
}

export interface IPlayerRepository {
    
    upsert: (player: Player) => void;
    
    findById: (id: string) => Player | undefined;
    
    findAll: () => Promise<Player[]>;
    
    deleteById: (id: string) => void;
}
