import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { IRaceDataHtmlGateway } from '../../gateway/interface/iRaceDataHtmlGateway';
import { processOverseasRaceName } from '../../utility/createRaceName';
import { GradeType } from '../../utility/data/common/gradeType';
import {
    RaceCourse,
    validateRaceCourse,
} from '../../utility/data/common/raceCourse';
import type { RaceCourseType } from '../../utility/data/common/raceCourseType';
import { validateRaceDistance } from '../../utility/data/common/raceDistance';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { HorseRacingPlaceEntity } from '../entity/horseRacingPlaceEntity';
import { HorseRacingRaceEntity } from '../entity/horseRacingRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';


@injectable()
export class OverseasRaceRepositoryFromHtmlImpl
    implements IRaceRepository<HorseRacingRaceEntity, HorseRacingPlaceEntity>
{
    public constructor(
        @inject('RaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IRaceDataHtmlGateway,
    ) {}

    
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<HorseRacingPlaceEntity>,
    ): Promise<HorseRacingRaceEntity[]> {
        const monthList: Date[] = this.generateMonthList(
            searchFilter.startDate,
            searchFilter.finishDate,
        );
        const overseasRaceDataList: HorseRacingRaceEntity[] = [];
        for (const month of monthList) {
            overseasRaceDataList.push(
                ...(await this.fetchRaceListFromHtml(
                    searchFilter.raceType,
                    month,
                )),
            );
            console.debug('0.8秒待ちます');
            await new Promise((resolve) => setTimeout(resolve, 800));
            console.debug('0.8秒経ちました');
        }
        return overseasRaceDataList;
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
    public async fetchRaceListFromHtml(
        raceType: RaceType,
        date: Date,
    ): Promise<HorseRacingRaceEntity[]> {
        try {
            const htmlText = await this.raceDataHtmlGateway.getRaceDataHtml(
                raceType,
                date,
            );
            const overseasRaceDataList: HorseRacingRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            const content = $('.racelist');
            
            content.find('.racelist__day').each((__, element) => {
                
                if ($(element).find('.un-trigger').length > 0) {
                    return;
                }
                const dayElement = $(element);
                const dataTarget = dayElement.attr('data-target'); 
                const [year, month, day] = [
                    dataTarget?.slice(0, 4),
                    dataTarget?.slice(4, 6),
                    dataTarget?.slice(6, 8),
                ].map(Number);

                
                let recordHour = -1;
                let recordDay = 0;
                let recordPlace = '';
                let recordNumber = 0;

                $(dayElement)
                    .find('.racelist__race')
                    .each((_, raceElement) => {
                        try {
                            
                            if (
                                $(raceElement).find('.nolink').text().length > 0
                            ) {
                                return;
                            }

                            const rowRaceName = $(raceElement)
                                .find('.racelist__race__title')
                                .find('.name')
                                .text();

                            const location: RaceCourse = validateRaceCourse(
                                raceType,
                                $(raceElement)
                                    .find('.racelist__race__sub')
                                    .find('.course')
                                    .text()
                                    .trim(),
                            );
                            
                            
                            const surfaceTypeAndDistanceText = $(raceElement)
                                .find('.racelist__race__sub')
                                .find('.type')
                                .text()
                                .trim(); 

                            const surfaceType: string = this.extractSurfaceType(
                                ['芝', 'ダート', '障害', 'AW'].filter((type) =>
                                    surfaceTypeAndDistanceText.includes(type),
                                ),
                            );
                            const distanceMatch = /\d+/.exec(
                                surfaceTypeAndDistanceText,
                            );
                            const distance: number = validateRaceDistance(
                                distanceMatch ? Number(distanceMatch[0]) : -1,
                            );
                            const gradeText: string = rowRaceName.includes(
                                '（L）',
                            )
                                ? 'Listed'
                                : $(raceElement)
                                      .find('.racelist__race__title')
                                      .find('.grade')
                                      .find('span')
                                      .text()
                                      .replace('G1', 'GⅠ')
                                      .replace('G2', 'GⅡ')
                                      .replace('G3', 'GⅢ');
                            const grade: GradeType =
                                gradeText === '' ? '格付けなし' : gradeText;

                            
                            const timeText = $(raceElement)
                                .find('.racelist__race__sub')
                                .find('.time')
                                .text()
                                .trim();

                            const timeMatch = /\d{2}:\d{2}/.exec(timeText);
                            const time = timeMatch ? timeMatch[0] : '';
                            const [hour, minute] = time.split(':').map(Number);

                            
                            if (recordPlace !== location) {
                                recordHour = -1;
                                recordDay = 0;
                                recordNumber = 0;
                            }
                            recordPlace = location;

                            
                            if (recordHour > hour) {
                                recordDay++;
                            }
                            recordHour = hour;

                            recordNumber++;
                            const number = recordNumber;
                            const raceDate = new Date(
                                year,
                                month - 1,
                                day + recordDay,
                                hour,
                                minute,
                            );

                            const raceName = processOverseasRaceName({
                                name: rowRaceName,
                                location,
                                grade,
                                date: raceDate,
                                surfaceType,
                                distance,
                            });
                            overseasRaceDataList.push(
                                HorseRacingRaceEntity.createWithoutId(
                                    RaceData.create(
                                        raceType,
                                        raceName,
                                        raceDate,
                                        location,
                                        grade,
                                        number,
                                    ),
                                    HorseRaceConditionData.create(
                                        surfaceType,
                                        distance,
                                    ),
                                    getJSTDate(new Date()),
                                ),
                            );
                        } catch (error) {
                            console.error(
                                'レースデータ加工中にエラーが発生しました',
                                error,
                            );
                        }
                    });
            });
            return overseasRaceDataList;
        } catch (error) {
            console.error('HTMLの取得に失敗しました', error);
            return [];
        }
    }

    private extractSurfaceType(race: string[]): RaceCourseType {
        const types = ['芝', 'ダート', '障害', 'AW'];
        const found = types.find((type) =>
            race.some((item) => item.includes(type)),
        );
        return found ?? '芝';
    }

    
    @Logger
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: HorseRacingRaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: HorseRacingRaceEntity[];
        failureData: HorseRacingRaceEntity[];
    }> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
