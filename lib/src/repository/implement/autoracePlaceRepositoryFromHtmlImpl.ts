import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../domain/placeData';
import { IPlaceDataHtmlGateway } from '../../gateway/interface/iPlaceDataHtmlGateway';
import { GradeType } from '../../utility/data/common/gradeType';
import { RaceCourse } from '../../utility/data/common/raceCourse';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';


@injectable()
export class AutoracePlaceRepositoryFromHtmlImpl
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
        
        const monthList = [
            ...this.generateMonthList(
                searchFilter.startDate,
                searchFilter.finishDate,
            ),
        ];

        
        const monthPlaceEntityLists = await Promise.all(
            monthList.map(async (month) =>
                this.fetchMonthPlaceEntityList(searchFilter.raceType, month),
            ),
        );

        const placeEntityList = monthPlaceEntityLists.flat();

        
        return placeEntityList.filter(
            (placeEntity) =>
                placeEntity.placeData.dateTime >= searchFilter.startDate &&
                placeEntity.placeData.dateTime <= searchFilter.finishDate,
        );
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
        const autoracePlaceEntityList: MechanicalRacingPlaceEntity[] = [];
        
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(raceType, date);

        const $ = cheerio.load(htmlText);

        const chartWrapprer = $('#content');

        
        const tables = chartWrapprer.find('table');

        tables.each((_: number, element) => {
            
            const tbody = $(element).find('tbody');
            
            const trs = tbody.find('tr');
            trs.each((__: number, trElement) => {
                
                const th = $(trElement).find('th');

                
                if (!th.text()) {
                    return;
                }

                
                
                const place: RaceCourse = th.text().replace('２', '');

                const tds = $(trElement).find('td');
                
                
                
                
                tds.each((index: number, tdElement) => {
                    const div = $(tdElement).find('div');
                    let grade: GradeType | undefined;
                    
                    switch (div.attr('class')) {
                        case 'ico-kaisai': {
                            grade = '開催';
                            break;
                        }
                        case 'ico-sg': {
                            grade = 'SG';
                            break;
                        }
                        case 'ico-g1': {
                            grade = 'GⅠ';
                            break;
                        }
                        case 'ico-g2': {
                            grade = 'GⅡ';
                            break;
                        }
                        case undefined: {
                            break;
                        }
                    }
                    const datetime = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        index + 1,
                    );
                    
                    if (grade) {
                        autoracePlaceEntityList.push(
                            MechanicalRacingPlaceEntity.createWithoutId(
                                PlaceData.create(raceType, datetime, place),
                                grade,
                                getJSTDate(new Date()),
                            ),
                        );
                    }
                });
            });
        });
        return autoracePlaceEntityList;
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
