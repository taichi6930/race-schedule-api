import { inject, injectable } from 'tsyringe';

import { MechanicalRacingRaceData } from '../../domain/mechanicalRacingRaceData';
import { RaceData } from '../../domain/raceData';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { GradeType } from '../../utility/data/common/gradeType';
import { RaceCourse } from '../../utility/data/common/raceCourse';
import { RaceStage } from '../../utility/data/common/raceStage';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * 公営競技レース開催データユースケース
 */
@injectable()
export class PublicGamblingRaceDataUseCase implements IRaceDataUseCase {
    public constructor(
        @inject('PublicGamblingPlaceDataService')
        private readonly placeDataService: IPlaceDataService,
        @inject('PublicGamblingRaceDataService')
        private readonly raceDataService: IRaceDataService,
    ) {}

    /**
     * レース開催データを取得する
     * @param startDate
     * @param finishDate
     * @param searchList.gradeList
     * @param searchList.locationList
     * @param searchList.jra
     * @param searchList.jra.gradeList
     * @param searchList.jra.locationList
     * @param searchList.nar
     * @param searchList.nar.gradeList
     * @param searchList.nar.locationList
     * @param searchList.world
     * @param searchList.world.gradeList
     * @param searchList.world.locationList
     * @param searchList.keirin
     * @param searchList.keirin.gradeList
     * @param searchList.keirin.locationList
     * @param searchList.keirin.stageList
     * @param searchList.autorace
     * @param searchList.autorace.gradeList
     * @param searchList.autorace.locationList
     * @param searchList.autorace.stageList
     * @param searchList.boatrace
     * @param searchList.boatrace.gradeList
     * @param searchList.boatrace.locationList
     * @param searchList.boatrace.stageList
     * @param raceTypeList
     * @param searchList
     */
    @Logger
    public async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: string[],
        searchList?: {
            jra?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            nar?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            world?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            keirin?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
            autorace?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
            boatrace?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
        },
    ): Promise<{
        jra: RaceData[];
        nar: RaceData[];
        world: RaceData[];
        keirin: MechanicalRacingRaceData[];
        autorace: MechanicalRacingRaceData[];
        boatrace: MechanicalRacingRaceData[];
    }> {
        const placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                raceTypeList,
                DataLocation.Storage,
            );

        const raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            raceTypeList,
            DataLocation.Storage,
            placeEntityList,
        );

        // フィルタリング処理
        return {
            jra: raceEntityList.jra
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.jra?.gradeList) {
                        return searchList.jra.gradeList.includes(
                            raceEntity.raceData.grade,
                        );
                    }
                    return true;
                })
                // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.jra?.locationList) {
                        return searchList.jra.locationList.includes(
                            raceEntity.raceData.location,
                        );
                    }
                    return true;
                })
                .map(({ raceData }) => raceData),
            nar: raceEntityList.nar
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.nar?.gradeList) {
                        return searchList.nar.gradeList.includes(
                            raceEntity.raceData.grade,
                        );
                    }
                    return true;
                })
                // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.nar?.locationList) {
                        return searchList.nar.locationList.includes(
                            raceEntity.raceData.location,
                        );
                    }
                    return true;
                })
                .map(({ raceData }) => raceData),
            world: raceEntityList.world
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.world?.gradeList) {
                        return searchList.world.gradeList.includes(
                            raceEntity.raceData.grade,
                        );
                    }
                    return true;
                })
                // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.world?.locationList) {
                        return searchList.world.locationList.includes(
                            raceEntity.raceData.location,
                        );
                    }
                    return true;
                })
                .map(({ raceData }) => raceData),
            keirin: raceEntityList.keirin
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.keirin?.gradeList) {
                        return searchList.keirin.gradeList.includes(
                            raceEntity.raceData.grade,
                        );
                    }
                    return true;
                })
                // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.keirin?.locationList) {
                        return searchList.keirin.locationList.includes(
                            raceEntity.raceData.location,
                        );
                    }
                    return true;
                })
                // レースステージが指定されている場合は、指定されたレースステージのレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.keirin?.stageList) {
                        return searchList.keirin.stageList.includes(
                            raceEntity.raceData.stage,
                        );
                    }
                    return true;
                })
                .map(({ raceData }) => raceData),
            autorace: raceEntityList.autorace
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.autorace?.gradeList) {
                        return searchList.autorace.gradeList.includes(
                            raceEntity.raceData.grade,
                        );
                    }
                    return true;
                })
                // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.autorace?.locationList) {
                        return searchList.autorace.locationList.includes(
                            raceEntity.raceData.location,
                        );
                    }
                    return true;
                })
                // レースステージが指定されている場合は、指定されたレースステージのレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.autorace?.stageList) {
                        return searchList.autorace.stageList.includes(
                            raceEntity.raceData.stage,
                        );
                    }
                    return true;
                })
                .map(({ raceData }) => raceData),
            boatrace: raceEntityList.boatrace
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.boatrace?.gradeList) {
                        return searchList.boatrace.gradeList.includes(
                            raceEntity.raceData.grade,
                        );
                    }
                    return true;
                })
                // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.boatrace?.locationList) {
                        return searchList.boatrace.locationList.includes(
                            raceEntity.raceData.location,
                        );
                    }
                    return true;
                })
                // レースステージが指定されている場合は、指定されたレースステージのレースのみを取得する
                .filter((raceEntity) => {
                    if (searchList?.boatrace?.stageList) {
                        return searchList.boatrace.stageList.includes(
                            raceEntity.raceData.stage,
                        );
                    }
                    return true;
                })
                .map(({ raceData }) => raceData),
        };
    }

    /**
     * レース開催データを更新する
     * @param startDate
     * @param finishDate
     * @param searchList.gradeList
     * @param searchList.locationList
     * @param searchList.jra
     * @param searchList.jra.gradeList
     * @param searchList.jra.locationList
     * @param searchList.nar
     * @param searchList.nar.gradeList
     * @param searchList.nar.locationList
     * @param searchList.world
     * @param searchList.world.gradeList
     * @param searchList.world.locationList
     * @param searchList.keirin
     * @param searchList.keirin.gradeList
     * @param searchList.keirin.locationList
     * @param searchList.keirin.stageList
     * @param searchList.autorace
     * @param searchList.autorace.gradeList
     * @param searchList.autorace.locationList
     * @param searchList.autorace.stageList
     * @param searchList.boatrace
     * @param searchList.boatrace.gradeList
     * @param searchList.boatrace.locationList
     * @param searchList.boatrace.stageList
     * @param raceTypeList
     * @param searchList
     */
    @Logger
    public async updateRaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: string[],
        searchList?: {
            jra?: {
                locationList?: RaceCourse[];
            };
            nar?: {
                locationList?: RaceCourse[];
            };
            world?: {
                locationList?: RaceCourse[];
            };
            keirin?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            autorace?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            boatrace?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
        },
    ): Promise<void> {
        // フィルタリング処理
        const placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                raceTypeList,
                DataLocation.Storage,
            );

        const filteredPlaceEntityList = {
            jra: placeEntityList.jra.filter((placeEntity) => {
                if (searchList?.jra?.locationList) {
                    return searchList.jra.locationList.includes(
                        placeEntity.placeData.location,
                    );
                }
                return true;
            }),
            nar: placeEntityList.nar.filter((placeEntity) => {
                if (searchList?.nar?.locationList) {
                    return searchList.nar.locationList.includes(
                        placeEntity.placeData.location,
                    );
                }
                return true;
            }),
            keirin: placeEntityList.keirin
                .filter((placeEntity) => {
                    if (searchList?.keirin?.gradeList) {
                        return searchList.keirin.gradeList.includes(
                            placeEntity.grade,
                        );
                    }
                    return true;
                })
                .filter((placeEntity) => {
                    if (searchList?.keirin?.locationList) {
                        return searchList.keirin.locationList.includes(
                            placeEntity.placeData.location,
                        );
                    }
                    return true;
                }),
            autorace: placeEntityList.autorace
                .filter((placeEntity) => {
                    if (searchList?.autorace?.gradeList) {
                        return searchList.autorace.gradeList.includes(
                            placeEntity.grade,
                        );
                    }
                    return true;
                })
                .filter((placeEntity) => {
                    if (searchList?.autorace?.locationList) {
                        return searchList.autorace.locationList.includes(
                            placeEntity.placeData.location,
                        );
                    }
                    return true;
                }),
            boatrace: placeEntityList.boatrace
                .filter((placeEntity) => {
                    if (searchList?.boatrace?.gradeList) {
                        return searchList.boatrace.gradeList.includes(
                            placeEntity.grade,
                        );
                    }
                    return true;
                })
                .filter((placeEntity) => {
                    if (searchList?.boatrace?.locationList) {
                        return searchList.boatrace.locationList.includes(
                            placeEntity.placeData.location,
                        );
                    }
                    return true;
                }),
        };

        // placeEntityListが空の場合は処理を終了する
        if (
            !raceTypeList.includes('world') &&
            filteredPlaceEntityList.jra.length === 0 &&
            filteredPlaceEntityList.nar.length === 0 &&
            filteredPlaceEntityList.keirin.length === 0 &&
            filteredPlaceEntityList.autorace.length === 0 &&
            filteredPlaceEntityList.boatrace.length === 0
        ) {
            console.log(
                '指定された条件に合致する開催場所が存在しません。レースデータの更新をスキップします。',
            );
            return;
        }

        const raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            raceTypeList,
            DataLocation.Web,
            {
                jra: filteredPlaceEntityList.jra,
                nar: filteredPlaceEntityList.nar,
                keirin: filteredPlaceEntityList.keirin,
                autorace: filteredPlaceEntityList.autorace,
                boatrace: filteredPlaceEntityList.boatrace,
            },
        );

        await this.raceDataService.updateRaceEntityList({
            jra: raceEntityList.jra,
            nar: raceEntityList.nar,
            world: raceEntityList.world,
            keirin: raceEntityList.keirin,
            autorace: raceEntityList.autorace,
            boatrace: raceEntityList.boatrace,
        });
    }

    // @Logger
    // public async upsertRaceDataList(raceDataList: {
    //     jra?: RaceData[];
    //     nar?: RaceData[];
    //     world?: RaceData[];
    //     keirin?: MechanicalRacingRaceData[];
    //     autorace?: MechanicalRacingRaceData[];
    //     boatrace?: MechanicalRacingRaceData[];
    // }): Promise<void> {
    //     const raceEntityList = {
    //         jra: [],
    //         nar: (raceDataList.nar ?? []).map((raceData) =>
    //             NarRaceEntity.createWithoutId(raceData, getJSTDate(new Date())),
    //         ),
    //         world: (raceDataList.world ?? []).map((raceData) =>
    //             WorldRaceEntity.createWithoutId(
    //                 raceData,
    //                 getJSTDate(new Date()),
    //             ),
    //         ),
    //         keirin: (raceDataList.keirin ?? []).map((raceData) =>
    //             KeirinRaceEntity.createWithoutId(
    //                 raceData,
    //                 [],
    //                 getJSTDate(new Date()),
    //             ),
    //         ),
    //         autorace: (raceDataList.autorace ?? []).map((raceData) =>
    //             AutoraceRaceEntity.createWithoutId(
    //                 raceData,
    //                 [],
    //                 getJSTDate(new Date()),
    //             ),
    //         ),
    //         boatrace: (raceDataList.boatrace ?? []).map((raceData) =>
    //             BoatraceRaceEntity.createWithoutId(
    //                 raceData,
    //                 [],
    //                 getJSTDate(new Date()),
    //             ),
    //         ),
    //     };
    //     await this.raceDataService.updateRaceEntityList(raceEntityList);
    // }
}
