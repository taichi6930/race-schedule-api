import { inject, injectable } from 'tsyringe';

import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { AutoraceGradeType } from '../../utility/data/autorace/autoraceGradeType';
import { AutoraceRaceCourse } from '../../utility/data/autorace/autoraceRaceCourse';
import { AutoraceRaceStage } from '../../utility/data/autorace/autoraceRaceStage';
import { DataLocation } from '../../utility/dataType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * Autoraceレース開催データユースケース
 */
@injectable()
export class AutoraceRaceDataUseCase
    implements
        IRaceDataUseCase<
            AutoraceRaceData,
            AutoraceGradeType,
            AutoraceRaceCourse,
            AutoraceRaceStage
        >
{
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
     * @param searchList
     * @param searchList.gradeList
     * @param searchList.locationList
     * @param searchList.stageList
     */
    public async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: AutoraceGradeType[];
            locationList?: AutoraceRaceCourse[];
            stageList?: AutoraceRaceStage[];
        },
    ): Promise<AutoraceRaceData[]> {
        const _placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                ['autorace'],
                DataLocation.Storage,
            );
        const placeEntityList: AutoracePlaceEntity[] =
            _placeEntityList.autorace;

        const _raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            ['autorace'],
            DataLocation.Storage,
            {
                autorace: placeEntityList,
            },
        );
        const raceEntityList: AutoraceRaceEntity[] = _raceEntityList.autorace;

        const raceDataList: AutoraceRaceData[] = raceEntityList.map(
            ({ raceData }) => raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: AutoraceRaceData[] = raceDataList
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
     * @param searchList.gradeList
     * @param searchList.locationList
     */
    @Logger
    public async updateRaceEntityList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: AutoraceGradeType[];
            locationList?: AutoraceRaceCourse[];
        },
    ): Promise<void> {
        // フィルタリング処理
        const _placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                ['autorace'],
                DataLocation.Storage,
            );
        const fetchedPlaceEntityList: AutoracePlaceEntity[] =
            _placeEntityList.autorace;
        const placeEntityList: AutoracePlaceEntity[] = fetchedPlaceEntityList
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

        const raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            ['autorace'],
            DataLocation.Web,
            {
                autorace: placeEntityList,
            },
        );

        await this.raceDataService.updateRaceEntityList(raceEntityList);
    }

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    @Logger
    public async upsertRaceDataList(
        raceDataList: AutoraceRaceData[],
    ): Promise<void> {
        const raceEntityList: AutoraceRaceEntity[] = raceDataList.map(
            (raceData) =>
                AutoraceRaceEntity.createWithoutId(
                    raceData,
                    [],
                    getJSTDate(new Date()),
                ),
        );
        await this.raceDataService.updateRaceEntityList({
            autorace: raceEntityList,
        });
    }
}
