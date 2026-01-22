import { inject, injectable } from 'tsyringe';

import type { SearchPlayerFilterEntity } from '../../domain/entity/filter/searchPlayerFilterEntity';
import type { PlayerEntity } from '../../domain/entity/playerEntity';
import type { IPlayerService } from '../../service/interface/IPlayerService';
import type { IPlayerUsecase } from '../interface/IPlayerUsecase';

/**
 * Player に関する業務ロジック（Usecase）
 */
@injectable()
export class PlayerUsecase implements IPlayerUsecase {
    public constructor(
        @inject('PlayerService')
        private readonly playerService: IPlayerService,
    ) {}

    /**
     * 選手データを取得する
     * @param searchPlayerFilter - 選手検索フィルター
     * @return 選手エンティティリスト
     */
    public async fetchPlayerEntityList(
        searchPlayerFilter: SearchPlayerFilterEntity,
    ): Promise<PlayerEntity[]> {
        return this.playerService.fetchPlayerEntityList(searchPlayerFilter);
    }

    /**
     * 選手データを登録/更新する
     * @param entityList - 選手エンティティリスト
     */
    public async upsertPlayerEntityList(
        entityList: PlayerEntity[],
    ): Promise<void> {
        await this.playerService.upsertPlayerEntityList(entityList);
    }
}
