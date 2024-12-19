import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../entity/autoraceRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import type { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// AutoraceRaceRepositoryFromHtmlImplのモックを作成
export class MockAutoraceRaceRepositoryFromHtmlImpl
    implements IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
{
    @Logger
    fetchRaceEntityList(
        request: FetchRaceListRequest<AutoracePlaceEntity>,
    ): Promise<FetchRaceListResponse<AutoraceRaceEntity>> {
        const placeEntityList = request.placeEntityList;
        const raceEntityList: AutoraceRaceEntity[] = [];
        if (placeEntityList) {
            placeEntityList.forEach((placeEntity) => {
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    const raceStage = i === 12 ? '優勝戦' : '予選';
                    raceEntityList.push(
                        new AutoraceRaceEntity(
                            null,
                            new AutoraceRaceData(
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
            });
        }
        return Promise.resolve(new FetchRaceListResponse(raceEntityList));
    }

    @Logger
    registerRaceEntityList(
        request: RegisterRaceListRequest<AutoraceRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
