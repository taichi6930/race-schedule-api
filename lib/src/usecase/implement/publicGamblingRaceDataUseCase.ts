import { inject, injectable } from 'tsyringe';

import { HorseRacingRaceEntity } from '../../repository/entity/horseRacingRaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { MechanicalRacingRaceEntity } from '../../repository/entity/mechanicalRacingRaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { IRaceDataService } from '../../service/interface/IRaceDataService';
import { GradeType } from '../../utility/data/common/gradeType';
import { RaceCourse } from '../../utility/data/common/raceCourse';
import { RaceStage } from '../../utility/data/common/raceStage';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { IRaceDataUseCase } from '../interface/IRaceDataUseCase';


@injectable()
export class PublicGamblingRaceDataUseCase implements IRaceDataUseCase {
    public constructor(
        @inject('PublicGamblingPlaceDataService')
        private readonly placeDataService: IPlaceDataService,
        @inject('PublicGamblingRaceDataService')
        private readonly raceDataService: IRaceDataService,
    ) {}

    
    @Logger
    public async fetchRaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        searchList?: {
            [RaceType.JRA]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            [RaceType.NAR]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            [RaceType.OVERSEAS]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            [RaceType.KEIRIN]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
            [RaceType.AUTORACE]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
            [RaceType.BOATRACE]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
            [RaceType.BOATRACE]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
                stageList?: RaceStage[];
            };
        },
    ): Promise<{
        [RaceType.JRA]: JraRaceEntity[];
        [RaceType.NAR]: HorseRacingRaceEntity[];
        [RaceType.OVERSEAS]: HorseRacingRaceEntity[];
        [RaceType.KEIRIN]: MechanicalRacingRaceEntity[];
        [RaceType.AUTORACE]: MechanicalRacingRaceEntity[];
        [RaceType.BOATRACE]: MechanicalRacingRaceEntity[];
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
            {
                [RaceType.JRA]: placeEntityList[RaceType.JRA],
                [RaceType.NAR]: placeEntityList[RaceType.NAR],
                [RaceType.OVERSEAS]: placeEntityList[RaceType.OVERSEAS],
                [RaceType.KEIRIN]: placeEntityList[RaceType.KEIRIN],
                [RaceType.AUTORACE]: placeEntityList[RaceType.AUTORACE],
                [RaceType.BOATRACE]: placeEntityList[RaceType.BOATRACE],
            },
        );

        
        return {
            [RaceType.JRA]: this.filterRaceEntityList(
                raceEntityList[RaceType.JRA],
                searchList?.[RaceType.JRA],
            ),
            [RaceType.NAR]: this.filterRaceEntityList(
                raceEntityList[RaceType.NAR],
                searchList?.[RaceType.NAR],
            ),
            [RaceType.OVERSEAS]: this.filterRaceEntityList(
                raceEntityList[RaceType.OVERSEAS],
                searchList?.[RaceType.OVERSEAS],
            ),
            [RaceType.KEIRIN]: this.filterRaceEntityList(
                raceEntityList[RaceType.KEIRIN],
                searchList?.[RaceType.KEIRIN],
            ),
            [RaceType.AUTORACE]: this.filterRaceEntityList(
                raceEntityList[RaceType.AUTORACE],
                searchList?.[RaceType.AUTORACE],
            ),
            [RaceType.BOATRACE]: this.filterRaceEntityList(
                raceEntityList[RaceType.BOATRACE],
                searchList?.[RaceType.BOATRACE],
            ),
        };
    }

    
    @Logger
    public async updateRaceEntityList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: RaceType[],
        searchList?: {
            [RaceType.JRA]?: {
                locationList?: RaceCourse[];
            };
            [RaceType.NAR]?: {
                locationList?: RaceCourse[];
            };
            [RaceType.OVERSEAS]?: {
                locationList?: RaceCourse[];
            };
            [RaceType.KEIRIN]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            [RaceType.AUTORACE]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
            [RaceType.BOATRACE]?: {
                gradeList?: GradeType[];
                locationList?: RaceCourse[];
            };
        },
    ): Promise<{
        code: number;
        message: string;
        successDataCount: number;
        failureDataCount: number;
    }> {
        
        const placeEntityList =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                raceTypeList,
                DataLocation.Storage,
            );

        const filteredPlaceEntityList = {
            [RaceType.JRA]: this.filterPlaceEntityList(
                placeEntityList[RaceType.JRA].filter(
                    (item) => item.placeData.raceType === RaceType.JRA,
                ),
                searchList?.[RaceType.JRA],
            ),
            [RaceType.NAR]: this.filterPlaceEntityList(
                placeEntityList[RaceType.NAR].filter(
                    (item) => item.placeData.raceType === RaceType.NAR,
                ),
                searchList?.[RaceType.NAR],
            ),
            [RaceType.KEIRIN]: this.filterPlaceEntityList(
                placeEntityList[RaceType.KEIRIN].filter(
                    (item) => item.placeData.raceType === RaceType.KEIRIN,
                ),
                searchList?.[RaceType.KEIRIN],
            ),
            [RaceType.AUTORACE]: this.filterPlaceEntityList(
                placeEntityList[RaceType.AUTORACE].filter(
                    (item) => item.placeData.raceType === RaceType.AUTORACE,
                ),
                searchList?.[RaceType.AUTORACE],
            ),
            [RaceType.BOATRACE]: this.filterPlaceEntityList(
                placeEntityList[RaceType.BOATRACE].filter(
                    (item) => item.placeData.raceType === RaceType.BOATRACE,
                ),
                searchList?.[RaceType.BOATRACE],
            ),
        };

        
        if (
            !raceTypeList.includes(RaceType.OVERSEAS) &&
            filteredPlaceEntityList[RaceType.JRA].length === 0 &&
            filteredPlaceEntityList[RaceType.NAR].length === 0 &&
            filteredPlaceEntityList[RaceType.KEIRIN].length === 0 &&
            filteredPlaceEntityList[RaceType.AUTORACE].length === 0 &&
            filteredPlaceEntityList[RaceType.BOATRACE].length === 0
        ) {
            console.log(
                '指定された条件に合致する開催場所が存在しません。レースデータの更新をスキップします。',
            );
            return {
                code: 404,
                message: '指定された条件に合致する開催場所が存在しません。',
                successDataCount: 0,
                failureDataCount: 0,
            };
        }

        const raceEntityList = await this.raceDataService.fetchRaceEntityList(
            startDate,
            finishDate,
            raceTypeList,
            DataLocation.Web,
            {
                [RaceType.JRA]: filteredPlaceEntityList[RaceType.JRA],
                [RaceType.NAR]: filteredPlaceEntityList[RaceType.NAR],
                [RaceType.KEIRIN]: filteredPlaceEntityList[RaceType.KEIRIN],
                [RaceType.AUTORACE]: filteredPlaceEntityList[RaceType.AUTORACE],
                [RaceType.BOATRACE]: filteredPlaceEntityList[RaceType.BOATRACE],
            },
        );

        await this.raceDataService.updateRaceEntityList({
            [RaceType.JRA]: raceEntityList[RaceType.JRA],
            [RaceType.NAR]: raceEntityList[RaceType.NAR],
            [RaceType.OVERSEAS]: raceEntityList[RaceType.OVERSEAS],
            [RaceType.KEIRIN]: raceEntityList[RaceType.KEIRIN],
            [RaceType.AUTORACE]: raceEntityList[RaceType.AUTORACE],
            [RaceType.BOATRACE]: raceEntityList[RaceType.BOATRACE],
        });

        return {
            code: 200,
            message: 'レースデータの更新が完了しました。',
            successDataCount: Object.values(raceEntityList)
                .map((list) => list.length)
                .reduce((acc, cur) => acc + cur, 0),
            failureDataCount: 0,
        };
    }

    
    private filterByGrade<
        T extends { raceData?: { grade?: GradeType }; grade?: GradeType },
    >(list: T[], gradeList?: GradeType[]): T[] {
        if (!gradeList) return list;
        return list.filter((item) => {
            const grade = item.raceData?.grade ?? item.grade;
            return grade !== undefined && gradeList.includes(grade);
        });
    }

    private filterByLocation<
        T extends {
            raceData?: { location?: RaceCourse };
            placeData?: { location?: RaceCourse };
        },
    >(list: T[], locationList?: RaceCourse[]): T[] {
        if (!locationList) return list;
        return list.filter((item) => {
            const location =
                item.raceData?.location ?? item.placeData?.location;
            return location !== undefined && locationList.includes(location);
        });
    }

    private filterByStage<T extends { stage?: RaceStage }>(
        list: T[],
        stageList?: RaceStage[],
    ): T[] {
        if (!stageList) return list;
        return list.filter(
            (item) =>
                item.stage !== undefined && stageList.includes(item.stage),
        );
    }

    private filterRaceEntityList<
        T extends {
            raceData?: { grade?: GradeType; location?: RaceCourse };
            stage?: RaceStage;
        },
    >(
        list: T[],
        filter: {
            gradeList?: GradeType[];
            locationList?: RaceCourse[];
            stageList?: RaceStage[];
        } = {},
    ): T[] {
        let result = this.filterByGrade(list, filter.gradeList);
        result = this.filterByLocation(result, filter.locationList);
        result = this.filterByStage(result, filter.stageList);
        return result;
    }

    private filterPlaceEntityList<
        T extends { grade?: GradeType; placeData?: { location?: RaceCourse } },
    >(
        list: T[],
        filter: {
            gradeList?: GradeType[];
            locationList?: RaceCourse[];
        } = {},
    ): T[] {
        let result = this.filterByGrade(list, filter.gradeList);
        result = this.filterByLocation(result, filter.locationList);
        return result;
    }
}
