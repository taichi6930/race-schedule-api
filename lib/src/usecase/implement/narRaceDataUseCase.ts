import { inject, injectable } from 'tsyringe';

import { NarRaceData } from '../../domain/narRaceData';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IOldRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * Narレース開催データユースケース
 */
@injectable()
export class NarRaceDataUseCase implements IOldRaceDataUseCase<NarRaceData> {
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
        raceDataList: NarRaceData[],
    ): Promise<void> {
        const raceEntityList: NarRaceEntity[] = raceDataList.map((raceData) =>
            NarRaceEntity.createWithoutId(raceData, getJSTDate(new Date())),
        );
        await this.raceDataService.updateRaceEntityList({
            nar: raceEntityList,
        });
    }
}
