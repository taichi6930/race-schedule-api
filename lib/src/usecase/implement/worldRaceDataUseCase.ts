import { inject, injectable } from 'tsyringe';

import { WorldRaceData } from '../../domain/worldRaceData';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { WorldGradeType } from '../../utility/data/world/worldGradeType';
import { WorldRaceCourse } from '../../utility/data/world/worldRaceCourse';
import { DataLocation } from '../../utility/dataType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IOldRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * Worldレース開催データユースケース
 */
@injectable()
export class WorldRaceDataUseCase
    implements
        IOldRaceDataUseCase<
            WorldRaceData,
            WorldGradeType,
            WorldRaceCourse,
            undefined
        >
{
    public constructor(
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
     */
    public async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            gradeList?: WorldGradeType[];
            locationList?: WorldRaceCourse[];
        },
    ): Promise<WorldRaceData[]> {
        const _raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            ['world'],
            DataLocation.Storage,
        );
        const raceEntityList: WorldRaceEntity[] = _raceEntityList.world;

        const raceDataList: WorldRaceData[] = raceEntityList.map(
            ({ raceData }) => raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: WorldRaceData[] = raceDataList
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
            });

        return filteredRaceDataList;
    }

    /**
     * レース開催データを更新する
     * @param startDate
     * @param finishDate
     */
    @Logger
    public async updateRaceEntityList(
        startDate: Date,
        finishDate: Date,
    ): Promise<void> {
        const raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            ['world'],
            DataLocation.Web,
        );
        await this.raceDataService.updateRaceEntityList(raceEntityList);
    }

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    @Logger
    public async upsertRaceDataList(
        raceDataList: WorldRaceData[],
    ): Promise<void> {
        const raceEntityList: WorldRaceEntity[] = raceDataList.map((raceData) =>
            WorldRaceEntity.createWithoutId(raceData, getJSTDate(new Date())),
        );
        await this.raceDataService.updateRaceEntityList({
            world: raceEntityList,
            jra: [],
            nar: [],
            keirin: [],
            boatrace: [],
            autorace: [],
        });
    }
}
