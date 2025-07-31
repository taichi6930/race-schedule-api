import { inject, injectable } from 'tsyringe';

import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { JraRaceData } from '../../domain/jraRaceData';
import { KeirinRaceData } from '../../domain/keirinRaceData';
import { NarRaceData } from '../../domain/narRaceData';
import { WorldRaceData } from '../../domain/worldRaceData';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { AutoraceGradeType } from '../../utility/data/autorace/autoraceGradeType';
import { AutoraceRaceCourse } from '../../utility/data/autorace/autoraceRaceCourse';
import { AutoraceRaceStage } from '../../utility/data/autorace/autoraceRaceStage';
import { BoatraceGradeType } from '../../utility/data/boatrace/boatraceGradeType';
import { BoatraceRaceCourse } from '../../utility/data/boatrace/boatraceRaceCourse';
import { BoatraceRaceStage } from '../../utility/data/boatrace/boatraceRaceStage';
import { JraGradeType } from '../../utility/data/jra/jraGradeType';
import { JraRaceCourse } from '../../utility/data/jra/jraRaceCourse';
import { KeirinGradeType } from '../../utility/data/keirin/keirinGradeType';
import { KeirinRaceCourse } from '../../utility/data/keirin/keirinRaceCourse';
import { KeirinRaceStage } from '../../utility/data/keirin/keirinRaceStage';
import { NarGradeType } from '../../utility/data/nar/narGradeType';
import { NarRaceCourse } from '../../utility/data/nar/narRaceCourse';
import { WorldGradeType } from '../../utility/data/world/worldGradeType';
import { WorldRaceCourse } from '../../utility/data/world/worldRaceCourse';
import { DataLocation } from '../../utility/dataType';
import { getJSTDate } from '../../utility/date';
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
                gradeList?: JraGradeType[];
                locationList?: JraRaceCourse[];
            };
            nar?: {
                gradeList?: NarGradeType[];
                locationList?: NarRaceCourse[];
            };
            world?: {
                gradeList?: WorldGradeType[];
                locationList?: WorldRaceCourse[];
            };
            keirin?: {
                gradeList?: KeirinGradeType[];
                locationList?: KeirinRaceCourse[];
                stageList?: KeirinRaceStage[];
            };
            autorace?: {
                gradeList?: AutoraceGradeType[];
                locationList?: AutoraceRaceCourse[];
                stageList?: AutoraceRaceStage[];
            };
            boatrace?: {
                gradeList?: BoatraceGradeType[];
                locationList?: BoatraceRaceCourse[];
                stageList?: BoatraceRaceStage[];
            };
        },
    ): Promise<{
        jra: JraRaceData[];
        nar: NarRaceData[];
        world: WorldRaceData[];
        keirin: KeirinRaceData[];
        autorace: AutoraceRaceData[];
        boatrace: BoatraceRaceData[];
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

        const raceDataList = {
            jra: raceEntityList.jra.map(({ raceData }) => raceData),
            nar: raceEntityList.nar.map(({ raceData }) => raceData),
            world: raceEntityList.world.map(({ raceData }) => raceData),
            keirin: raceEntityList.keirin.map(({ raceData }) => raceData),
            autorace: raceEntityList.autorace.map(({ raceData }) => raceData),
            boatrace: raceEntityList.boatrace.map(({ raceData }) => raceData),
        };

        // フィルタリング処理
        return {
            jra: raceDataList.jra
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.jra?.gradeList) {
                        return searchList.jra.gradeList.includes(
                            raceData.grade,
                        );
                    }
                    return true;
                })
                // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.jra?.locationList) {
                        return searchList.jra.locationList.includes(
                            raceData.location,
                        );
                    }
                    return true;
                }),
            nar: raceDataList.nar
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.nar?.gradeList) {
                        return searchList.nar.gradeList.includes(
                            raceData.grade,
                        );
                    }
                    return true;
                })
                // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.nar?.locationList) {
                        return searchList.nar.locationList.includes(
                            raceData.location,
                        );
                    }
                    return true;
                }),
            world: raceDataList.world
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.world?.gradeList) {
                        return searchList.world.gradeList.includes(
                            raceData.grade,
                        );
                    }
                    return true;
                })
                // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.world?.locationList) {
                        return searchList.world.locationList.includes(
                            raceData.location,
                        );
                    }
                    return true;
                }),
            keirin: raceDataList.keirin
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.keirin?.gradeList) {
                        return searchList.keirin.gradeList.includes(
                            raceData.grade,
                        );
                    }
                    return true;
                })
                // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.keirin?.locationList) {
                        return searchList.keirin.locationList.includes(
                            raceData.location,
                        );
                    }
                    return true;
                })
                // レースステージが指定されている場合は、指定されたレースステージのレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.keirin?.stageList) {
                        return searchList.keirin.stageList.includes(
                            raceData.stage,
                        );
                    }
                    return true;
                }),
            autorace: raceDataList.autorace
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.autorace?.gradeList) {
                        return searchList.autorace.gradeList.includes(
                            raceData.grade,
                        );
                    }
                    return true;
                })
                // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.autorace?.locationList) {
                        return searchList.autorace.locationList.includes(
                            raceData.location,
                        );
                    }
                    return true;
                })
                // レースステージが指定されている場合は、指定されたレースステージのレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.autorace?.stageList) {
                        return searchList.autorace.stageList.includes(
                            raceData.stage,
                        );
                    }
                    return true;
                }),
            boatrace: raceDataList.boatrace
                // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.boatrace?.gradeList) {
                        return searchList.boatrace.gradeList.includes(
                            raceData.grade,
                        );
                    }
                    return true;
                })
                // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.boatrace?.locationList) {
                        return searchList.boatrace.locationList.includes(
                            raceData.location,
                        );
                    }
                    return true;
                })
                // レースステージが指定されている場合は、指定されたレースステージのレースのみを取得する
                .filter((raceData) => {
                    if (searchList?.boatrace?.stageList) {
                        return searchList.boatrace.stageList.includes(
                            raceData.stage,
                        );
                    }
                    return true;
                }),
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
                locationList?: JraRaceCourse[];
            };
            nar?: {
                locationList?: NarRaceCourse[];
            };
            world?: {
                locationList?: WorldRaceCourse[];
            };
            keirin?: {
                gradeList?: KeirinGradeType[];
                locationList?: KeirinRaceCourse[];
            };
            autorace?: {
                gradeList?: AutoraceGradeType[];
                locationList?: AutoraceRaceCourse[];
            };
            boatrace?: {
                gradeList?: BoatraceGradeType[];
                locationList?: BoatraceRaceCourse[];
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
            world: placeEntityList.world.filter((placeEntity) => {
                if (searchList?.world?.locationList) {
                    return searchList.world.locationList.includes(
                        placeEntity.placeData.location,
                    );
                }
                return true;
            }),
            keirin: placeEntityList.keirin
                .filter((placeEntity) => {
                    if (searchList?.keirin?.gradeList) {
                        return searchList.keirin.gradeList.includes(
                            placeEntity.placeData.grade,
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
                            placeEntity.placeData.grade,
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
                            placeEntity.placeData.grade,
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
            filteredPlaceEntityList.jra.length === 0 &&
            filteredPlaceEntityList.nar.length === 0 &&
            filteredPlaceEntityList.world.length === 0 &&
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
                world: filteredPlaceEntityList.world,
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

    @Logger
    public async upsertRaceDataList(raceDataList: {
        jra?: JraRaceData[];
        nar?: NarRaceData[];
        world?: WorldRaceData[];
        keirin?: KeirinRaceData[];
        autorace?: AutoraceRaceData[];
        boatrace?: BoatraceRaceData[];
    }): Promise<void> {
        const raceEntityList = {
            jra: (raceDataList.jra ?? []).map((raceData) =>
                JraRaceEntity.createWithoutId(raceData, getJSTDate(new Date())),
            ),
            nar: (raceDataList.nar ?? []).map((raceData) =>
                NarRaceEntity.createWithoutId(raceData, getJSTDate(new Date())),
            ),
            world: (raceDataList.world ?? []).map((raceData) =>
                WorldRaceEntity.createWithoutId(
                    raceData,
                    getJSTDate(new Date()),
                ),
            ),
            keirin: (raceDataList.keirin ?? []).map((raceData) =>
                KeirinRaceEntity.createWithoutId(
                    raceData,
                    [],
                    getJSTDate(new Date()),
                ),
            ),
            autorace: (raceDataList.autorace ?? []).map((raceData) =>
                AutoraceRaceEntity.createWithoutId(
                    raceData,
                    [],
                    getJSTDate(new Date()),
                ),
            ),
            boatrace: (raceDataList.boatrace ?? []).map((raceData) =>
                BoatraceRaceEntity.createWithoutId(
                    raceData,
                    [],
                    getJSTDate(new Date()),
                ),
            ),
        };
        await this.raceDataService.updateRaceEntityList(raceEntityList);
    }
}
