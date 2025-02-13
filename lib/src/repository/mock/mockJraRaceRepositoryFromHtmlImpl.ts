import { JraRaceData } from '../../domain/jraRaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// JraRaceRepositoryFromHtmlImplのモックを作成
export class MockJraRaceRepositoryFromHtmlImpl
    implements IRaceRepository<JraRaceEntity, JraPlaceEntity>
{
    @Logger
    fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<JraPlaceEntity>,
    ): Promise<JraRaceEntity[]> {
        const placeEntityList = searchFilter.placeEntityList;
        const raceEntityList: JraRaceEntity[] = [];
        if (placeEntityList) {
            placeEntityList.forEach((placeEntity) => {
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    raceEntityList.push(
                        JraRaceEntity.createWithoutId(
                            JraRaceData.create(
                                `${placeEntity.placeData.location}第${i.toString()}R`,
                                new Date(
                                    placeEntity.placeData.dateTime.getFullYear(),
                                    placeEntity.placeData.dateTime.getMonth(),
                                    placeEntity.placeData.dateTime.getDate(),
                                    i + 9,
                                ),
                                placeEntity.placeData.location,
                                '芝',
                                2000,
                                'GⅠ',
                                i,
                                1,
                                1,
                            ),
                            getJSTDate(new Date()),
                        ),
                    );
                }
            });
        }
        return Promise.resolve(raceEntityList);
    }

    @Logger
    registerRaceEntityList(raceEntityList: JraRaceEntity[]): Promise<void> {
        console.debug(raceEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
