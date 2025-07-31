import { inject, injectable } from 'tsyringe';

import { JraRaceData } from '../../domain/jraRaceData';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { JraGradeType } from '../../utility/data/jra/jraGradeType';
import { JraRaceCourse } from '../../utility/data/jra/jraRaceCourse';
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
     * @param searchList
     * @param searchList.gradeList
     * @param searchList.locationList
     * @param searchList.jra
     * @param searchList.jra.gradeList
     * @param searchList.jra.locationList
     */
    @Logger
    public async fetchRaceDataList(
        startDate: Date,
        finishDate: Date,
        searchList?: {
            jra: { gradeList?: JraGradeType[]; locationList?: JraRaceCourse[] };
        },
    ): Promise<{
        jra: JraRaceData[];
    }> {
        const _placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                ['jra'],
                DataLocation.Storage,
            );
        const placeEntityList: JraPlaceEntity[] = _placeEntityList.jra;

        const _raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            ['jra'],
            DataLocation.Storage,
            { jra: placeEntityList },
        );
        const raceEntityList: JraRaceEntity[] = _raceEntityList.jra;

        const raceDataList: JraRaceData[] = raceEntityList.map(
            ({ raceData }) => raceData,
        );

        // フィルタリング処理
        const filteredRaceDataList: JraRaceData[] = raceDataList
            // グレードリストが指定されている場合は、指定されたグレードのレースのみを取得する
            .filter((raceData) => {
                if (searchList?.jra.gradeList) {
                    return searchList.jra.gradeList.includes(raceData.grade);
                }
                return true;
            })
            // 開催場が指定されている場合は、指定された開催場のレースのみを取得する
            .filter((raceData) => {
                if (searchList?.jra.locationList) {
                    return searchList.jra.locationList.includes(
                        raceData.location,
                    );
                }
                return true;
            });

        return {
            jra: filteredRaceDataList,
        };
    }
}
