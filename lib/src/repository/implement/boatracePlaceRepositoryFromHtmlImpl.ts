import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../domain/placeData';
import { IPlaceDataHtmlGateway } from '../../gateway/interface/iPlaceDataHtmlGateway';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';


@injectable()
export class BoatracePlaceRepositoryFromHtmlImpl
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
        const quarters: Date[] = this.generateQuarterList(
            searchFilter.startDate,
            searchFilter.finishDate,
        );

        
        const placeEntityArray = await Promise.all(
            quarters.map(async (quarterDate) =>
                this.fetchMonthPlaceEntityList(
                    searchFilter.raceType,
                    quarterDate,
                ),
            ),
        );
        const placeEntityList: MechanicalRacingPlaceEntity[] =
            placeEntityArray.flat();

        
        const filteredPlaceEntityList: MechanicalRacingPlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= searchFilter.startDate &&
                    placeEntity.placeData.dateTime <= searchFilter.finishDate,
            );

        return filteredPlaceEntityList;
    }

    
    private generateQuarterList(startDate: Date, finishDate: Date): Date[] {
        const quarterList: Date[] = [];

        const qStartDate = new Date(
            startDate.getFullYear(),
            Math.floor(startDate.getMonth() / 3) * 3,
            1,
        );

        const qFinishDate = new Date(
            finishDate.getFullYear(),
            Math.floor(finishDate.getMonth() / 3) * 3,
            1,
        );

        for (
            let currentDate = new Date(qStartDate);
            currentDate <= qFinishDate;
            currentDate.setMonth(currentDate.getMonth() + 3)
        ) {
            quarterList.push(new Date(currentDate));
        }

        return quarterList;
    }

    
    @Logger
    private async fetchMonthPlaceEntityList(
        raceType: RaceType,
        date: Date,
    ): Promise<MechanicalRacingPlaceEntity[]> {
        const boatracePlaceEntityList: MechanicalRacingPlaceEntity[] = [];
        
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(raceType, date);

        const $ = cheerio.load(htmlText);

        
        const rList = $('#r_list');

        
        const trs = rList.find('tr.br-tableSchedule__row');
        trs.each((_: number, element) => {
            
            const dateText = $(element)
                .find('td.br-tableSchedule__data')
                .eq(0)
                .text()
                .trim();
            
            const startDateString: string = dateText.split('～')[0];
            const [, finishDateString] = dateText.split('～');
            const startDate = new Date(
                date.getFullYear(),
                Number.parseInt(startDateString.split('/')[0]) - 1,
                Number.parseInt(startDateString.split('/')[1].split('(')[0]),
            );

            const finishDate = new Date(
                date.getFullYear(),
                Number.parseInt(finishDateString.split('/')[0]) - 1,
                Number.parseInt(finishDateString.split('/')[1].split('(')[0]),
            );

            
            const grade = $(element).find('.br-label').text().trim();

            
            const place = $(element)
                .find('td.br-tableSchedule__data')
                .eq(2)
                .text()
                .trim()
                .replace(/\s+/g, '');

            
            
            for (
                let currentDate = new Date(startDate);
                currentDate <= finishDate;
                currentDate.setDate(currentDate.getDate() + 1)
            ) {
                const boatracePlaceEntity =
                    MechanicalRacingPlaceEntity.createWithoutId(
                        PlaceData.create(
                            raceType,
                            new Date(currentDate),
                            place,
                        ),
                        grade,
                        getJSTDate(new Date()),
                    );
                boatracePlaceEntityList.push(boatracePlaceEntity);
            }
        });
        return boatracePlaceEntityList;
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
