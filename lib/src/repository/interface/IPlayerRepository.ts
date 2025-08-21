// Playerエンティティ型定義
export interface Player {
    id: string; // raceType_playerNo
    race_type: string;
    player_no: string;
    player_name: string;
    priority: number;
}

export interface IPlayerRepository {
    /**
     * プレイヤー情報をアップサートします。
     * 既存のデータがある場合は更新、ない場合は挿入します。
     */
    upsert: (player: Player) => void;

    /**
     * IDでプレイヤー情報を取得します。
     * @param id - プレイヤーのID
     * @returns プレイヤー情報またはundefined
     */
    findById: (id: string) => Player | undefined;

    /**
     * 全てのプレイヤー情報を取得します。
     * @returns プレイヤー情報のリスト
     */
    findAll: () => Promise<Player[]>;

    /**
     * IDでプレイヤー情報を削除します。
     * @param id - プレイヤーのID
     */
    deleteById: (id: string) => void;
}
