import type { PlaceService } from '../service/placeService';

export class PlaceUsecase {
    private readonly placeService: PlaceService;

    public constructor(placeService: PlaceService) {
        this.placeService = placeService;
    }

    public async getAllPlaces(): Promise<unknown> {
        // PlaceServiceにgetAllPlacesがなければfetch等に修正
        return this.placeService.getAllPlaces?.() ?? [];
    }
}
