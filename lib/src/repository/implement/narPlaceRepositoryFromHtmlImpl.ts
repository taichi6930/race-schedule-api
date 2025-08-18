import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../domain/placeData';
import { IPlaceDataHtmlGateway } from '../../gateway/interface/iPlaceDataHtmlGateway';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { HorseRacingPlaceEntity } from '../entity/horseRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';


@injectable()
export class NarPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<HorseRacingPlaceEntity>
{
    public constructor(
        @inject('PlaceDataHtmlGateway')
        private readonly placeDataHtmlGateway: IPlaceDataHtmlGateway,
    ) {}

    
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<HorseRacingPlaceEntity[]> {
        const monthList: Date[] = this.generateMonthList(
            searchFilter.startDate,
            searchFilter.finishDate,
        );
        const monthPlaceEntityLists = await Promise.all(
            monthList.map(async (month) =>
                this.fetchMonthPlaceEntityList(searchFilter.raceType, month),
            ),
        );
        const placeEntityList: HorseRacingPlaceEntity[] =
            monthPlaceEntityLists.flat();

        
        const filteredPlaceEntityList: HorseRacingPlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= searchFilter.startDate &&
                    placeEntity.placeData.dateTime <= searchFilter.finishDate,
            );

        return filteredPlaceEntityList;
    }

    
    private generateMonthList(startDate: Date, finishDate: Date): Date[] {
        const monthList: Date[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            monthList.push(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            );
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        console.debug(
            `月リストを生成しました: ${monthList.map((month) => formatDate(month, 'yyyy-MM-dd')).join(', ')}`,
        );
        return monthList;
    }

    
    @Logger
    private async fetchMonthPlaceEntityList(
        raceType: RaceType,
        date: Date,
    ): Promise<HorseRacingPlaceEntity[]> {
        
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(raceType, date);

        const $ = cheerio.load(htmlText);
        
        const chartWrapprer = $('.chartWrapprer');
        
        const table = chartWrapprer.find('table');
        
        const tbody = table.find('tbody');
        
        
        
        
        const trs = tbody.find('tr');
        const narPlaceDataDict: Record<string, number[]> = {};

        trs.each((index: number, element) => {
            if (index < 2) {
                return;
            }
            const tds = $(element).find('td');
            const place = $(tds[0]).text();
            tds.each((tdIndex: number, tdElement) => {
                if (tdIndex === 0) {
                    if (!(place in narPlaceDataDict)) {
                        narPlaceDataDict[place] = [];
                    }
                    return;
                }
                if (
                    $(tdElement).text().includes('●') ||
                    $(tdElement).text().includes('☆') ||
                    $(tdElement).text().includes('Ｄ')
                ) {
                    narPlaceDataDict[place].push(tdIndex);
                }
            });
        });

        const narPlaceDataList: HorseRacingPlaceEntity[] = [];
        for (const [place, raceDays] of Object.entries(narPlaceDataDict)) {
            for (const raceDay of raceDays) {
                narPlaceDataList.push(
                    HorseRacingPlaceEntity.createWithoutId(
                        PlaceData.create(
                            raceType,
                            new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                raceDay,
                            ),
                            place,
                        ),
                        getJSTDate(new Date()),
                    ),
                );
            }
        }
        return narPlaceDataList;
    }

    
    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: HorseRacingPlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: HorseRacingPlaceEntity[];
        failureData: HorseRacingPlaceEntity[];
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
