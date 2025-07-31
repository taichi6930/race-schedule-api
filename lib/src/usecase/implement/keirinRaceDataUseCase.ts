import { inject, injectable } from 'tsyringe';

import { KeirinRaceData } from '../../domain/keirinRaceData';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IOldRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * Keirinレース開催データユースケース
 */
@injectable()
export class KeirinRaceDataUseCase
    implements IOldRaceDataUseCase<KeirinRaceData>
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
        raceDataList: KeirinRaceData[],
    ): Promise<void> {
        const raceEntityList: KeirinRaceEntity[] = raceDataList.map(
            (raceData) =>
                KeirinRaceEntity.createWithoutId(
                    raceData,
                    [],
                    getJSTDate(new Date()),
                ),
        );
        await this.raceDataService.updateRaceEntityList({
            keirin: raceEntityList,
        });
    }
}
