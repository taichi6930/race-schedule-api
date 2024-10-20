import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

// KeirinRaceRepositoryFromHtmlImplのモックを作成
export class MockKeirinPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<KeirinPlaceEntity>
{
    fetchPlaceList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<KeirinPlaceEntity>> {
        // request.startDateからrequest.finishDateまでの競輪場データを取得する
        const fetchPlaceEntityList = [];
        const currentDate = new Date(request.startDate);

        while (currentDate <= request.finishDate) {
            // 競輪場データを作成
            const placeData = new KeirinPlaceData(currentDate, '川崎', 'GⅠ');
            const keirinPlaceEntity = new KeirinPlaceEntity(null, placeData);
            fetchPlaceEntityList.push(keirinPlaceEntity);
            // 日付を1日進める
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return Promise.resolve(
            new FetchPlaceListResponse(fetchPlaceEntityList),
        );
    }

    registerPlaceList(
        request: RegisterPlaceListRequest<KeirinPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        console.debug(request);
        return Promise.resolve(new RegisterRaceListResponse(200));
    }
}
