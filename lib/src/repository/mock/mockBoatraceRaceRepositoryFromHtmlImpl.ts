import { baseBoatraceRacePlayerDataList } from '../../../../test/src/mock/common/baseBoatraceData';
import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../entity/boatraceRaceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// BoatraceRaceRepositoryFromHtmlImplのモックを作成
export class MockBoatraceRaceRepositoryFromHtmlImpl
    implements IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
{
    @Logger
    async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<BoatracePlaceEntity>,
    ): Promise<BoatraceRaceEntity[]> {
        const placeEntityList = searchFilter.placeEntityList;
        const raceEntityList: BoatraceRaceEntity[] = [];
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                const placeData: BoatracePlaceData = placeEntity.placeData;
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    const raceStage = i === 12 ? '優勝戦' : '';
                    raceEntityList.push(
                        BoatraceRaceEntity.createWithoutId(
                            BoatraceRaceData.create(
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
        return await Promise.resolve(raceEntityList);
    }

    @Logger
    async registerRaceEntityList(
        raceEntityList: BoatraceRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
