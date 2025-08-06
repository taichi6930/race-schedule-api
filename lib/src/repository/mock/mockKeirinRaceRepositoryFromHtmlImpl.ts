import { baseKeirinRacePlayerDataList } from '../../../../test/src/mock/common/baseKeirinData';
import { MechanicalRacingPlaceData } from '../../domain/mechanicalRacingPlaceData';
import { MechanicalRacingRaceData } from '../../domain/mechanicalRacingRaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { KeirinRaceEntity } from '../entity/keirinRaceEntity';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// KeirinRaceRepositoryFromHtmlImplのモックを作成
export class MockKeirinRaceRepositoryFromHtmlImpl
    implements IRaceRepository<KeirinRaceEntity, MechanicalRacingPlaceEntity>
{
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<MechanicalRacingPlaceEntity>,
    ): Promise<KeirinRaceEntity[]> {
        const { placeEntityList } = searchFilter;
        const raceEntityList: KeirinRaceEntity[] = [];
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                const placeData: MechanicalRacingPlaceData =
                    placeEntity.placeData;
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    const raceStage = i === 12 ? 'S級決勝' : 'S級予選';
                    raceEntityList.push(
                        KeirinRaceEntity.createWithoutId(
                            MechanicalRacingRaceData.create(
                                RaceType.KEIRIN,
                                `keirin第${i.toString()}R`,
                                raceStage,
                                new Date(
                                    placeData.dateTime.getFullYear(),
                                    placeData.dateTime.getMonth(),
                                    placeData.dateTime.getDate(),
                                    i + 9,
                                ),
                                placeData.location,
                                placeData.grade,
                                i,
                            ),
                            baseKeirinRacePlayerDataList,
                            getJSTDate(new Date()),
                        ),
                    );
                }
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return raceEntityList;
    }

    @Logger
    public async registerRaceEntityList(
        raceEntityList: KeirinRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
