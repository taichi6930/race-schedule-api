import { HeldDayData } from '../../domain/heldDayData';
import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { PlaceEntity } from '../entity/placeEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// JraRaceRepositoryFromHtmlImplのモックを作成
export class MockJraRaceRepositoryFromHtmlImpl
    implements IRaceRepository<JraRaceEntity, PlaceEntity>
{
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<PlaceEntity>,
    ): Promise<JraRaceEntity[]> {
        const { placeEntityList } = searchFilter;
        const raceEntityList: JraRaceEntity[] = [];
        if (placeEntityList) {
            const { raceType } = searchFilter;
            for (const placeEntity of placeEntityList) {
                // 1から12までのレースを作成
                for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                    const raceDate = new Date(placeEntity.placeData.dateTime);
                    raceDate.setHours(raceNumber + 9, 0, 0, 0);
                    raceEntityList.push(
                        JraRaceEntity.createWithoutId(
                            RaceData.create(
                                raceType,
                                `${placeEntity.placeData.location}第${raceNumber.toString()}R`,
                                raceDate,
                                placeEntity.placeData.location,
                                'GⅠ',
                                raceNumber,
                            ),
                            HeldDayData.create(1, 1),
                            HorseRaceConditionData.create('芝', 2000),
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
        raceType: RaceType,
        raceEntityList: JraRaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: JraRaceEntity[];
        failureData: JraRaceEntity[];
    }> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }

    private readonly defaultHeldDayData = {
        [RaceType.JRA]: HeldDayData.create(1, 1),
        [RaceType.NAR]: undefined,
        [RaceType.OVERSEAS]: undefined,
        [RaceType.KEIRIN]: undefined,
        [RaceType.AUTORACE]: undefined,
        [RaceType.BOATRACE]: undefined,
    };
}
