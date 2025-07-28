import { inject, injectable } from 'tsyringe';

import { NarRaceData } from '../../domain/narRaceData';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { IOldRaceDataService } from '../../service/interface/IOldRaceDataService';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { NarGradeType } from '../../utility/data/nar/narGradeType';
import { NarRaceCourse } from '../../utility/data/nar/narRaceCourse';
import { DataLocation } from '../../utility/dataType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';

/**
 * Narレース開催データユースケース
 */
@injectable()
export class NarRaceDataUseCase
    implements
        IRaceDataUseCase<NarRaceData, NarGradeType, NarRaceCourse, undefined>
{
    public constructor(
        @inject('PublicGamblingPlaceDataService')
        private readonly placeDataService: IPlaceDataService,
        @inject('PublicGamblingRaceDataService')
        private readonly raceDataService: IRaceDataService,
        @inject('NarRaceDataService')
        private readonly oldRaceDataService: IOldRaceDataService<
            NarRaceEntity,
            NarPlaceEntity
        >,
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
            gradeList?: NarGradeType[];
            locationList?: NarRaceCourse[];
        },
    ): Promise<NarRaceData[]> {
        const _placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                ['nar'],
                DataLocation.Storage,
            );
        const placeEntityList: NarPlaceEntity[] = _placeEntityList.nar;

        const _raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            DataLocation.Storage,
            { nar: placeEntityList },
        );
        const raceEntityList: NarRaceEntity[] = _raceEntityList.nar;

        const raceDataList: NarRaceData[] = raceEntityList.map(
            ({ raceData }) => raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: NarRaceData[] = raceDataList
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
        const _placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                ['nar'],
                DataLocation.Storage,
            );
        const placeEntityList: NarPlaceEntity[] = _placeEntityList.nar;

        const _raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            DataLocation.Web,
            { nar: placeEntityList },
        );
        const raceEntityList: NarRaceEntity[] = _raceEntityList.nar;

        await this.oldRaceDataService.updateRaceEntityList(raceEntityList);
    }

    /**
     * レース開催データを更新する
     * @param raceDataList
     */
    @Logger
    public async upsertRaceDataList(
        raceDataList: NarRaceData[],
    ): Promise<void> {
        const raceEntityList: NarRaceEntity[] = raceDataList.map((raceData) =>
            NarRaceEntity.createWithoutId(raceData, getJSTDate(new Date())),
        );
        await this.oldRaceDataService.updateRaceEntityList(raceEntityList);
    }
}
