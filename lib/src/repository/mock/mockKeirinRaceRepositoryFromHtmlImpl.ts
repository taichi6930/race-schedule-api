import { baseKeirinRacePlayerDataList } from '../../../../test/src/mock/common/baseKeirinData';
import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinRaceData } from '../../domain/keirinRaceData';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../entity/keirinRaceEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';
import type { FetchRaceListRequest } from '../request/fetchRaceListRequest';

// KeirinRaceRepositoryFromHtmlImplのモックを作成
export class MockKeirinRaceRepositoryFromHtmlImpl
    implements IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
{
    @Logger
    fetchRaceEntityList(
        request: FetchRaceListRequest<KeirinPlaceEntity>,
    ): Promise<KeirinRaceEntity[]> {
        const placeEntityList = request.placeEntityList;
        const raceEntityList: KeirinRaceEntity[] = [];
        if (placeEntityList) {
            placeEntityList.forEach((placeEntity) => {
                const placeData: KeirinPlaceData = placeEntity.placeData;
                // 1から12までのレースを作成
                for (let i = 1; i <= 12; i++) {
                    const raceStage = i === 12 ? 'S級決勝' : 'S級予選';
                    raceEntityList.push(
                        KeirinRaceEntity.createWithoutId(
                            KeirinRaceData.create(
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
            });
        }
        return Promise.resolve(raceEntityList);
    }

    @Logger
    registerRaceEntityList(raceEntityList: KeirinRaceEntity[]): Promise<void> {
        console.debug(raceEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
