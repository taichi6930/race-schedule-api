import { inject, injectable } from 'tsyringe';

import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { BoatraceGradeType } from '../../utility/data/boatrace/boatraceGradeType';
import { BoatraceRaceCourse } from '../../utility/data/boatrace/boatraceRaceCourse';
import { BoatraceRaceStage } from '../../utility/data/boatrace/boatraceRaceStage';
import { DataLocation } from '../../utility/dataType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * Boatraceレース開催データユースケース
 */
@injectable()
export class BoatraceRaceDataUseCase
    implements
        IRaceDataUseCase<
            BoatraceRaceData,
            BoatraceGradeType,
            BoatraceRaceCourse,
            BoatraceRaceStage
        >
{
    constructor(
        @inject('BoatracePlaceDataService')
        private readonly placeDataService: IPlaceDataService<BoatracePlaceEntity>,
        @inject('BoatraceRaceDataService')
        private readonly raceDataService: IRaceDataService<
            BoatraceRaceEntity,
            BoatracePlaceEntity
        >,
    ) {}

    /**
     * レース開催データを取得する
     * @param startDate
     * @param finishDate
     * @param searchList
     */
    async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: BoatraceGradeType[];
            locationList?: BoatraceRaceCourse[];
            stageList?: BoatraceRaceStage[];
        },
    ): Promise<BoatraceRaceData[]> {
        const placeEntityList: BoatracePlaceEntity[] =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );

        const raceEntityList: BoatraceRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
                placeEntityList,
            );

        const raceDataList: BoatraceRaceData[] = raceEntityList.map(
            ({ raceData }) => raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: BoatraceRaceData[] = raceDataList
            // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(raceData.grade);
                }
                return true;
            })
            // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
            .filter((raceData) => {
                if (searchList?.locationList) {
                    return searchList.locationList.includes(raceData.location);
                }
                return true;
            })
            // レースステージが指定されている場合は、指定されたレースステージのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.stageList) {
                    return searchList.stageList.includes(raceData.stage);
                }
                return true;
            });

        return filteredRaceDataList;
    }

    /**
     * レース開催データを更新する
     * @param startDate
     * @param finishDate
     * @param searchList
     */
    @Logger
    async updateRaceEntityList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: BoatraceGradeType[];
            locationList?: BoatraceRaceCourse[];
        },
    ): Promise<void> {
        // フィルタリング処理
        const fetchedPlaceEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );
        const placeEntityList: BoatracePlaceEntity[] = fetchedPlaceEntityList
            .filter((placeEntity) => {
                if (searchList?.gradeList) {
                    return searchList.gradeList.includes(
                        placeEntity.placeData.grade,
                    );
                }
                return true;
            })
            .filter((placeEntity) => {
                if (searchList?.locationList) {
                    return searchList.locationList.includes(
                        placeEntity.placeData.location,
                    );
                }
                return true;
            });

        // placeEntityListが空の場合は処理を終了する
        if (placeEntityList.length === 0) {
            return;
        }

        const raceEntityList: BoatraceRaceEntity[] =
            await this.raceDataService.fetchRaceEntityList(
                startDate,
                finishDate,
                DataLocation.Web,
                placeEntityList,
            );

        await this.raceDataService.updateRaceEntityList(raceEntityList);
    }

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    @Logger
    async upsertRaceDataList(raceDataList: BoatraceRaceData[]): Promise<void> {
        const raceEntityList: BoatraceRaceEntity[] = raceDataList.map(
            (raceData) =>
                BoatraceRaceEntity.createWithoutId(
                    raceData,
                    [],
                    getJSTDate(new Date()),
                ),
        );
        await this.raceDataService.updateRaceEntityList(raceEntityList);
    }
}
