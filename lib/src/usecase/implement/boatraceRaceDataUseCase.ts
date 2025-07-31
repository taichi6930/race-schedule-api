import { inject, injectable } from 'tsyringe';

import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IOldRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * Boatraceレース開催データユースケース
 */
@injectable()
export class BoatraceRaceDataUseCase
    implements IOldRaceDataUseCase<BoatraceRaceData>
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
        raceDataList: BoatraceRaceData[],
    ): Promise<void> {
        const raceEntityList: BoatraceRaceEntity[] = raceDataList.map(
            (raceData) =>
                BoatraceRaceEntity.createWithoutId(
                    raceData,
                    [],
                    getJSTDate(new Date()),
                ),
        );
        await this.raceDataService.updateRaceEntityList({
            boatrace: raceEntityList,
        });
    }
}
