import { inject, injectable } from 'tsyringe';

import { WorldRaceData } from '../../domain/worldRaceData';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IOldRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * Worldレース開催データユースケース
 */
@injectable()
export class WorldRaceDataUseCase
    implements IOldRaceDataUseCase<WorldRaceData>
{
    public constructor(
        @inject('PublicGamblingRaceDataService')
        private readonly raceDataService: IRaceDataService,
    ) {}

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    @Logger
    public async upsertRaceDataList(
        raceDataList: WorldRaceData[],
    ): Promise<void> {
        const raceEntityList: WorldRaceEntity[] = raceDataList.map((raceData) =>
            WorldRaceEntity.createWithoutId(raceData, getJSTDate(new Date())),
        );
        await this.raceDataService.updateRaceEntityList({
            world: raceEntityList,
            jra: [],
            nar: [],
            keirin: [],
            boatrace: [],
            autorace: [],
        });
    }
}
