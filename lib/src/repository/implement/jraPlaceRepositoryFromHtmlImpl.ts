import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { HeldDayData } from '../../domain/heldDayData';
import { PlaceData } from '../../domain/placeData';
import { IPlaceDataHtmlGateway } from '../../gateway/interface/iPlaceDataHtmlGateway';
import { HeldDayRecord } from '../../gateway/record/heldDayRecord';
import { PlaceRecord } from '../../gateway/record/placeRecord';
import { generatePlaceId } from '../../utility/data/common/placeId';
import { RaceCourse } from '../../utility/data/common/raceCourse';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

@injectable()
export class JraPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<JraPlaceEntity>
{
    public constructor(
        @inject('PlaceDataHtmlGateway')
        private readonly placeDataHtmlGateway: IPlaceDataHtmlGateway,
    ) {}

    
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<JraPlaceEntity[]> {
        
        const yearList: Date[] = this.generateYearList(
            searchFilter.startDate,
            searchFilter.finishDate,
        );

        
        const placeRecordPromises = yearList.map(async (year) =>
            this.fetchYearPlaceRecordList(searchFilter.raceType, year),
        );
        const placeRecordResults = await Promise.all(placeRecordPromises);
        const placeRecordList: {
            horseRacingPlaceRecord: PlaceRecord;
            jraHeldDayRecord: HeldDayRecord;
        }[] = placeRecordResults.flat();

        
        const placeEntityList: JraPlaceEntity[] = placeRecordList.map(
            ({ horseRacingPlaceRecord, jraHeldDayRecord }) => {
                return JraPlaceEntity.create(
                    horseRacingPlaceRecord.id,
                    PlaceData.create(
                        horseRacingPlaceRecord.raceType,
                        horseRacingPlaceRecord.dateTime,
                        horseRacingPlaceRecord.location,
                    ),
                    HeldDayData.create(
                        jraHeldDayRecord.heldTimes,
                        jraHeldDayRecord.heldDayTimes,
                    ),
                    new Date(
                        Math.min(
                            horseRacingPlaceRecord.updateDate.getTime(),
                            jraHeldDayRecord.updateDate.getTime(),
                        ),
                    ),
                );
            },
        );

        
        const filteredPlaceEntityList: JraPlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= searchFilter.startDate &&
                    placeEntity.placeData.dateTime <= searchFilter.finishDate,
            );

        return filteredPlaceEntityList;
    }

    
    private generateYearList(startDate: Date, finishDate: Date): Date[] {
        const yearList: Date[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            yearList.push(new Date(currentDate.getFullYear(), 0, 1));
            currentDate.setFullYear(currentDate.getFullYear() + 1);
        }

        console.debug(
            `年リストを生成しました: ${yearList.map((year) => year.toISOString().split('T')[0]).join(', ')}`,
        );
        return yearList;
    }

    
    @Logger
    private async fetchYearPlaceRecordList(
        raceType: RaceType,
        date: Date,
    ): Promise<
        {
            horseRacingPlaceRecord: PlaceRecord;
            jraHeldDayRecord: HeldDayRecord;
        }[]
    > {
        
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(raceType, date);

        
        const jraRecordList: {
            horseRacingPlaceRecord: PlaceRecord;
            jraHeldDayRecord: HeldDayRecord;
        }[] = [];

        
        const placeMap: Record<string, RaceCourse> = {
            札: '札幌',
            函: '函館',
            福: '福島',
            新: '新潟',
            東: '東京',
            中: '中山',
            名: '中京',
            京: '京都',
            阪: '阪神',
            小: '小倉',
        };

        
        const getPlaceName = (placeInitial: string): RaceCourse =>
            placeMap[placeInitial];

        
        
        const placeHeldDayTimesCountMap: Record<
            string,
            Record<string, number>
        > = {};

        
        const $ = cheerio.load(htmlText);

        for (const month of Array.from({ length: 12 }, (_, k) => k + 1)) {
            const monthData = $(`#mon_${month.toString()}`);
            for (const day of Array.from({ length: 31 }, (_, k) => k + 1)) {
                monthData
                    .find(`.d${day.toString()}`)
                    .each((_: number, element) => {
                        
                        const placeInitial: string = $(element)
                            .find('span')
                            .text();
                        const place: RaceCourse = getPlaceName(placeInitial);
                        
                        if (!place) return;

                        
                        const heldTimesInitial = $(element).text();
                        
                        const heldTimes: number = Number.parseInt(
                            heldTimesInitial.replace(placeInitial, ''),
                        );
                        
                        if (!(place in placeHeldDayTimesCountMap)) {
                            placeHeldDayTimesCountMap[place] = {};
                        }
                        
                        if (!(heldTimes in placeHeldDayTimesCountMap[place])) {
                            placeHeldDayTimesCountMap[place][heldTimes] = 0;
                        }
                        
                        placeHeldDayTimesCountMap[place][heldTimes] += 1;

                        
                        const heldDayTimes: number =
                            placeHeldDayTimesCountMap[place][heldTimes];

                        const jraPlaceRecord = PlaceRecord.create(
                            generatePlaceId(
                                raceType,
                                new Date(date.getFullYear(), month - 1, day),
                                place,
                            ),
                            raceType,
                            new Date(date.getFullYear(), month - 1, day),
                            getPlaceName(placeInitial),
                            getJSTDate(new Date()),
                        );
                        const jraHeldDayRecord = HeldDayRecord.create(
                            generatePlaceId(
                                raceType,
                                new Date(date.getFullYear(), month - 1, day),
                                place,
                            ),
                            raceType,
                            heldTimes,
                            heldDayTimes,
                            getJSTDate(new Date()),
                        );
                        jraRecordList.push({
                            horseRacingPlaceRecord: jraPlaceRecord,
                            jraHeldDayRecord: jraHeldDayRecord,
                        });
                    });
            }
        }
        return jraRecordList;
    }

    
    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: JraPlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: JraPlaceEntity[];
        failureData: JraPlaceEntity[];
    }> {
        console.debug(placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        return {
            code: 500,
            message: 'HTMLにはデータを登録出来ません',
            successData: [],
            failureData: placeEntityList,
        };
    }
}
