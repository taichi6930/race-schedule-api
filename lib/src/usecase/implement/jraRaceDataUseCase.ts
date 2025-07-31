import { inject, injectable } from 'tsyringe';

import { JraRaceData } from '../../domain/jraRaceData';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IOldRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * Jraレース開催データユースケース
 */
@injectable()
export class JraRaceDataUseCase implements IOldRaceDataUseCase<JraRaceData> {
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
        raceDataList: JraRaceData[],
    ): Promise<void> {
        const raceEntityList: JraRaceEntity[] = raceDataList.map((raceData) =>
            JraRaceEntity.createWithoutId(raceData, getJSTDate(new Date())),
        );
        await this.raceDataService.updateRaceEntityList({
            jra: raceEntityList,
        });
    }
}
