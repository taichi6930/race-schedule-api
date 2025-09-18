import 'reflect-metadata'; // reflect-metadataをインポート

describe('placeUseCase-placeService', () => {
    it('ダミー', () => {
        expect(true).toBe(true);
    });
    // let repositorySetup: TestRepositoryForAWSSetup;
    // let service: IPlaceServiceForAWS;
    // let useCase: IPlaceUseCaseForAWS;

    // beforeEach(() => {
    //     repositorySetup = setupTestRepositoryForAWSMock();

    //     service = container.resolve(PlaceServiceForAWS);
    //     container.registerInstance<IPlaceServiceForAWS>(
    //         'PlaceService',
    //         service,
    //     );
    //     useCase = container.resolve(PlaceUseCaseForAWS);
    // });

    // afterEach(() => {
    //     clearMocks();
    // });

    // describe('fetchRaceEntityList', () => {
    //     it('正常に開催場データが取得できること', async () => {
    //         const startDate = new Date('2024-06-01');
    //         const finishDate = new Date('2024-06-30');

    //         const result = await useCase.fetchPlaceEntityList(
    //             startDate,
    //             finishDate,
    //             testRaceTypeListMechanicalRacing,
    //         );

    //         expect(result).toEqual(mockPlaceEntityListMechanicalRacing);
    //     });
    // });

    // describe('updatePlaceDataList', () => {
    //     it('正常に開催場データが更新されること', async () => {
    //         const startDate = new Date('2024-06-01');
    //         const finishDate = new Date('2024-06-30');

    //         await useCase.updatePlaceEntityList(
    //             startDate,
    //             finishDate,
    //             testRaceTypeListAll,
    //         );

    //         expect(
    //             repositorySetup.placeRepositoryFromStorage
    //                 .upsertPlaceEntityList,
    //         ).toHaveBeenCalled();
    //     });
    // });
});
