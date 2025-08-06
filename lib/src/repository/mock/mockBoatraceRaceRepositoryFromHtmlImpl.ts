import { baseBoatraceRacePlayerDataList } from '../../../../test/src/mock/common/baseBoatraceData';
import { MechanicalRacingPlaceData } from '../../domain/mechanicalRacingPlaceData';
import { MechanicalRacingRaceData } from '../../domain/mechanicalRacingRaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { BoatraceRaceEntity } from '../entity/boatraceRaceEntity';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// BoatraceRaceRepositoryFromHtmlImplのモックを作成
export class MockBoatraceRaceRepositoryFromHtmlImpl
    implements IRaceRepository<BoatraceRaceEntity, MechanicalRacingPlaceEntity>
{
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<MechanicalRacingPlaceEntity>,
    ): Promise<BoatraceRaceEntity[]> {
        const { placeEntityList } = searchFilter;
        const raceEntityList: BoatraceRaceEntity[] = [];
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                const placeData: MechanicalRacingPlaceData =
                    placeEntity.placeData;
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    const raceStage = i === 12 ? '優勝戦' : '一般戦';
                    raceEntityList.push(
                        BoatraceRaceEntity.createWithoutId(
                            MechanicalRacingRaceData.create(
                                RaceType.BOATRACE,
                                `${placeData.location}第${i.toString()}R`,
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
                            baseBoatraceRacePlayerDataList,
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
        raceEntityList: BoatraceRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
