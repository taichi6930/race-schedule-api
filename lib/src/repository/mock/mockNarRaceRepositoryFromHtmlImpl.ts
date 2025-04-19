import { NarRaceData } from '../../domain/narRaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { NarRaceEntity } from '../entity/narRaceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// NarRaceRepositoryFromHtmlImplのモックを作成
/**
 *
 */
export class MockNarRaceRepositoryFromHtmlImpl
    implements IRaceRepository<NarRaceEntity, NarPlaceEntity>
{
    /**
     *
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<NarPlaceEntity>,
    ): Promise<NarRaceEntity[]> {
        const { placeEntityList } = searchFilter;
        const raceEntityList: NarRaceEntity[] = [];
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    raceEntityList.push(
                        NarRaceEntity.createWithoutId(
                            NarRaceData.create(
                                `${placeEntity.placeData.location}第${i.toString()}R`,
                                new Date(
                                    placeEntity.placeData.dateTime.getFullYear(),
                                    placeEntity.placeData.dateTime.getMonth(),
                                    placeEntity.placeData.dateTime.getDate(),
                                    i + 9,
                                ),
                                placeEntity.placeData.location,
                                'ダート',
                                2000,
                                'GⅠ',
                                i,
                            ),
                            getJSTDate(new Date()),
                        ),
                    );
                }
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return raceEntityList;
    }

    /**
     *
     * @param raceEntityList
     */
    @Logger
    public async registerRaceEntityList(
        raceEntityList: NarRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
