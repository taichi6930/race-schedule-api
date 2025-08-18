import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../domain/placeData';
import { IPlaceDataHtmlGateway } from '../../gateway/interface/iPlaceDataHtmlGateway';
import { GradeType } from '../../utility/data/common/gradeType';
import {
    RaceCourse,
    validateRaceCourse,
} from '../../utility/data/common/raceCourse';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';


@injectable()
export class KeirinPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<MechanicalRacingPlaceEntity>
{
    public constructor(
        @inject('PlaceDataHtmlGateway')
        private readonly placeDataHtmlGateway: IPlaceDataHtmlGateway,
    ) {}

    
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<MechanicalRacingPlaceEntity[]> {
        const monthList: Date[] = this.generateMonthList(
            searchFilter.startDate,
            searchFilter.finishDate,
        );
        const monthPlaceEntityLists = await Promise.all(
            monthList.map(async (month) =>
                this.fetchMonthPlaceEntityList(searchFilter.raceType, month),
            ),
        );
        const placeEntityList: MechanicalRacingPlaceEntity[] =
            monthPlaceEntityLists.flat();

        
        const filteredPlaceEntityList: MechanicalRacingPlaceEntity[] =
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
        return monthList;
    }

    
    @Logger
    private async fetchMonthPlaceEntityList(
        raceType: RaceType,
        date: Date,
    ): Promise<MechanicalRacingPlaceEntity[]> {
        const keirinPlaceEntityList: MechanicalRacingPlaceEntity[] = [];
        
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(raceType, date);

        const $ = cheerio.load(htmlText);

        const chartWrapper = $('#content');

        
        const tables = chartWrapper.find('table');

        tables.each((_: number, element) => {
            
            const tbody = $(element).find('tbody');
            
            const trs = tbody.find('tr');
            trs.each((__: number, trElement) => {
                try {
                    
                    const th = $(trElement).find('th');

                    
                    if (!th.text()) {
                        return;
                    }
                    const place: RaceCourse = validateRaceCourse(
                        raceType,
                        th.text(),
                    );

                    const tds = $(trElement).find('td');
                    tds.each((index: number, tdElement) => {
                        const imgs = $(tdElement).find('img');
                        let grade: GradeType | undefined;
                        imgs.each((___, img) => {
                            const alt = $(img).attr('alt');
                            if (alt !== undefined && alt.trim() !== '') {
                                grade = alt
                                    .replace('1', 'Ⅰ')
                                    .replace('2', 'Ⅱ')
                                    .replace('3', 'Ⅲ');
                            }
                        });
                        const datetime = new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            index + 1,
                        );
                        
                        if (grade) {
                            keirinPlaceEntityList.push(
                                MechanicalRacingPlaceEntity.createWithoutId(
                                    PlaceData.create(raceType, datetime, place),
                                    grade,
                                    getJSTDate(new Date()),
                                ),
                            );
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            });
        });
        return keirinPlaceEntityList;
    }

    
    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: MechanicalRacingPlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: MechanicalRacingPlaceEntity[];
        failureData: MechanicalRacingPlaceEntity[];
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
