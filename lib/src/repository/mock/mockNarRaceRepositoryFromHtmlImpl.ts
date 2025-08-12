import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { NarRaceEntity } from '../entity/narRaceEntity';
import { PlaceEntity } from '../entity/placeEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// NarRaceRepositoryFromHtmlImplのモックを作成
export class MockNarRaceRepositoryFromHtmlImpl
    implements IRaceRepository<NarRaceEntity, PlaceEntity>
{
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<PlaceEntity>,
    ): Promise<NarRaceEntity[]> {
        const { placeEntityList } = searchFilter;
        const raceEntityList: NarRaceEntity[] = [];
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    raceEntityList.push(
                        NarRaceEntity.createWithoutId(
                            RaceData.create(
                                RaceType.NAR,
                                `${placeEntity.placeData.location}第${i.toString()}R`,
                                new Date(
                                    placeEntity.placeData.dateTime.getFullYear(),
                                    placeEntity.placeData.dateTime.getMonth(),
                                    placeEntity.placeData.dateTime.getDate(),
                                    i + 9,
                                ),
                                placeEntity.placeData.location,
                                'GⅠ',
                                i,
                            ),
                            HorseRaceConditionData.create('ダート', 2000),
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
        raceEntityList: NarRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
