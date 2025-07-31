import { inject, injectable } from 'tsyringe';

import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IOldRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * Autoraceレース開催データユースケース
 */
@injectable()
export class AutoraceRaceDataUseCase
    implements IOldRaceDataUseCase<AutoraceRaceData>
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
        raceDataList: AutoraceRaceData[],
    ): Promise<void> {
        const raceEntityList: AutoraceRaceEntity[] = raceDataList.map(
            (raceData) =>
                AutoraceRaceEntity.createWithoutId(
                    raceData,
                    [],
                    getJSTDate(new Date()),
                ),
        );
        await this.raceDataService.updateRaceEntityList({
            autorace: raceEntityList,
        });
    }
}
