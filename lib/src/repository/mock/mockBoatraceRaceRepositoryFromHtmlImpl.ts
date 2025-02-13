import { baseBoatraceRacePlayerDataList } from '../../../../test/src/mock/common/baseBoatraceData';
import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../entity/boatraceRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';

// BoatraceRaceRepositoryFromHtmlImplのモックを作成
export class MockBoatraceRaceRepositoryFromHtmlImpl
    implements IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
{
    @Logger
    fetchRaceEntityList(
        request: FetchRaceListRequest<BoatracePlaceEntity>,
    ): Promise<BoatraceRaceEntity[]> {
        const placeEntityList = request.placeEntityList;
        const raceEntityList: BoatraceRaceEntity[] = [];
        if (placeEntityList) {
            placeEntityList.forEach((placeEntity) => {
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
            });
        }
        return Promise.resolve(raceEntityList);
    }

    @Logger
    registerRaceEntityList(
        raceEntityList: BoatraceRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
