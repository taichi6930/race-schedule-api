import type { PlaceService } from '../service/placeService';

export class PlaceUsecase {
    private readonly placeService: PlaceService;

    public constructor(placeService: PlaceService) {
        this.placeService = placeService;
    }

    public async getAllPlaces(): Promise<unknown> {
        // 仮でJRA・今日の日付でfetch
        // 実際はリクエストパラメータ等でraceType/dateを受け取る設計に
        return this.placeService.fetch('JRA' as any, new Date());
    }
}
