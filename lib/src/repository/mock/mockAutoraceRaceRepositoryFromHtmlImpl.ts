import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../entity/autoraceRaceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// AutoraceRaceRepositoryFromHtmlImplのモックを作成
/**
 *
 */
export class MockAutoraceRaceRepositoryFromHtmlImpl
    implements IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
{
    /**
     *
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<AutoracePlaceEntity>,
    ): Promise<AutoraceRaceEntity[]> {
        const { placeEntityList } = searchFilter;
        const raceEntityList: AutoraceRaceEntity[] = [];
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    const raceStage = i === 12 ? '優勝戦' : '予選';
                    raceEntityList.push(
                        AutoraceRaceEntity.createWithoutId(
                            AutoraceRaceData.create(
                                `${placeEntity.placeData.location}第${i.toString()}R`,
                                raceStage,
                                new Date(
                                    placeEntity.placeData.dateTime.getFullYear(),
                                    placeEntity.placeData.dateTime.getMonth(),
                                    placeEntity.placeData.dateTime.getDate(),
                                    i + 9,
                                ),
                                placeEntity.placeData.location,
                                placeEntity.placeData.grade,
                                i,
                            ),
                            [],
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
        raceEntityList: AutoraceRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
