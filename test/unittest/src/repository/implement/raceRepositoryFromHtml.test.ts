import 'reflect-metadata';

// テーブル駆動型テスト
// const testCases = {
//     [RaceType.JRA]: [],
//     [RaceType.NAR]: [],
//     [RaceType.OVERSEAS]: [],
//     [RaceType.KEIRIN]: [],
//     [RaceType.AUTORACE]: [],
//     [RaceType.BOATRACE]: [],
// };

it('ダミーテスト', () => {
    expect(true).toBe(true);
});

// describe.each(testRaceTypeListMechanicalRacing)(
//     'RaceRepositoryFromHtml(%s)',
//     (raceType) => {
//         for (const {
//             name,
//             repositoryClass,
//             startDate,
//             endDate,
//             placeName,
//             placeDate,
//             expectedLength,
//         } of testCases[raceType]) {
//             console.log(
//                 name,
//                 raceType,
//                 repositoryClass,
//                 startDate,
//                 endDate,
//                 placeName,
//                 placeDate,
//                 expectedLength,
//             );
//             expect(true).toBe(true);
//             // describe(name, () => {
//             //     let raceDataHtmlGateway: IRaceDataHtmlGateway;
//             //     let repository: IRaceRepository;

//             //     beforeEach(() => {
//             //         raceDataHtmlGateway = new MockRaceDataHtmlGateway();
//             //         container.registerInstance(
//             //             'RaceDataHtmlGateway',
//             //             raceDataHtmlGateway,
//             //         );
//             //         repository =
//             //             container.resolve<IRaceRepository>(
//             //                 repositoryClass,
//             //             );
//             //     });

//             //     afterEach(() => {
//             //         clearMocks();
//             //     });

//             //     describe('fetchRaceList', () => {
//             //         SkipEnv(
//             //             `正しいレース開催データを取得できる(${raceType})`,
//             //             [allowedEnvs.githubActionsCi],
//             //             async () => {
//             //                 const raceEntityList =
//             //                     await repository.fetchRaceEntityList(
//             //                         new SearchRaceFilterEntity(
//             //                             startDate,
//             //                             endDate,
//             //                             raceType,
//             //                             [
//             //                                 PlaceEntity.createWithoutId(
//             //                                     PlaceData.create(
//             //                                         raceType,
//             //                                         placeDate,
//             //                                         placeName,
//             //                                     ),
//             //                                     defaultHeldDayData[raceType],
//             //                                     defaultPlaceGrade[raceType],
//             //                                 ),
//             //                             ],
//             //                         ),
//             //                     );
//             //                 expect(raceEntityList).toHaveLength(expectedLength);
//             //             },
//             //         );
//             //     });

//             //     describe('upsertRaceList', () => {
//             //         it('HTMLにはデータを登録できない', async () => {
//             //             await expect(
//             //                 repository.upsertRaceEntityList(raceType, []),
//             //             ).rejects.toThrow('HTMLにはデータを登録出来ません');
//             //         });
//             //     });
//             // });
//         }
//     },
// );
