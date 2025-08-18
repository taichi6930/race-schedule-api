import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { HeldDayData } from '../../domain/heldDayData';
import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { IRaceDataHtmlGateway } from '../../gateway/interface/iRaceDataHtmlGateway';
import { processJraRaceName } from '../../utility/createRaceName';
import { GradeType } from '../../utility/data/common/gradeType';
import {
    RaceCourse,
    validateRaceCourse,
} from '../../utility/data/common/raceCourse';
import { RaceCourseType } from '../../utility/data/common/raceCourseType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { JraRaceEntity } from '../entity/jraRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

@injectable()
export class JraRaceRepositoryFromHtmlImpl
    implements IRaceRepository<JraRaceEntity, JraPlaceEntity>
{
    public constructor(
        @inject('RaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IRaceDataHtmlGateway,
    ) {}

    
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<JraPlaceEntity>,
    ): Promise<JraRaceEntity[]> {
        const jraRaceEntityList: JraRaceEntity[] = [];
        const { placeEntityList, raceType } = searchFilter;
        
        const dateList = placeEntityList
            ?.map((place) => place.placeData.dateTime)
            .filter((x, i, self) => self.indexOf(x) === i);
        if (dateList) {
            for (const date of dateList) {
                jraRaceEntityList.push(
                    ...(await this.fetchRaceListFromHtmlWithJraPlace(
                        raceType,
                        date,
                    )),
                );
            }
        }
        return jraRaceEntityList;
    }

    @Logger
    public async fetchRaceListFromHtmlWithJraPlace(
        raceType: RaceType,
        raceDate: Date,
    ): Promise<JraRaceEntity[]> {
        try {
            
            const htmlText: string =
                await this.raceDataHtmlGateway.getRaceDataHtml(
                    raceType,
                    raceDate,
                );
            const jraRaceDataList: JraRaceEntity[] = [];

            
            
            const $ = cheerio.load(htmlText);
            const doc = $(`#raceInfo`);
            const table = doc.find('table');

            table.each((i: number, tableElem) => {
                
                const thead = $(tableElem).find('thead');

                
                
                
                
                
                const theadElementMatch = /(\d+)回(.*?)(\d+)日目/.exec(
                    thead.text(),
                );
                if (theadElementMatch === null) {
                    return;
                }
                
                const raceCourse: RaceCourse = this.extractRaceCourse(
                    raceType,
                    theadElementMatch,
                );
                
                const raceHeld: number | null =
                    this.extractRaceHeld(theadElementMatch);
                
                const raceHeldDay: number | null =
                    this.extractRaceHeldDay(theadElementMatch);
                
                if (raceHeld === null || raceHeldDay === null) {
                    return;
                }

                
                $(tableElem)
                    .find('tbody')
                    .find('tr')
                    .each((_: number, elem) => {
                        const element = $(elem);
                        
                        const [raceNumAndTime] = element
                            .find('td')
                            .eq(0)
                            .text()
                            .split(' ');
                        const raceNumber =
                            this.extractRaceNumber(raceNumAndTime);
                        
                        
                        const distanceMatch = /\d+m/.exec(
                            element.find('td').eq(1).find('span').eq(1).text(),
                        );
                        const raceDistance =
                            this.extractRaceDistance(distanceMatch);
                        
                        if (raceDistance === null) {
                            return;
                        }
                        
                        const raceDateTime: Date = this.extractRaceTime(
                            raceNumAndTime,
                            raceDate,
                        );
                        
                        const surfaceTypeMatch = /[ダ芝障]{1,2}/.exec(
                            element.find('td').eq(1).find('span').eq(1).text(),
                        );
                        const raceSurfaceType =
                            this.extractSurfaceType(surfaceTypeMatch);
                        if (raceSurfaceType === null) {
                            return;
                        }

                        
                        const rowRaceName = element
                            .find('td')
                            .eq(1)
                            .find('a')
                            .text()
                            .replace(/[！-～]/g, (s: string) =>
                                String.fromCodePoint(
                                    (s.codePointAt(0) ?? 0) - 0xfee0,
                                ),
                            )
                            .replace(/[０-９Ａ-Ｚａ-ｚ]/g, (s: string) =>
                                String.fromCodePoint(
                                    (s.codePointAt(0) ?? 0) - 0xfee0,
                                ),
                            )
                            .replace(/ステークス/, 'S')
                            .replace(/カップ/, 'C')
                            .replace('サラ系', '');

                        
                        const tbodyTrTdElement1 = element
                            .find('td')
                            .eq(1)
                            .find('span')
                            .eq(0)
                            .text();
                        const [raceGrade, _raceName] =
                            this.extractRaceGradeAndRaceName(
                                tbodyTrTdElement1,
                                raceSurfaceType,
                                rowRaceName,
                            );

                        
                        const raceName = processJraRaceName({
                            name: _raceName,
                            place: raceCourse,
                            date: raceDate,
                            surfaceType: raceSurfaceType,
                            distance: raceDistance,
                            grade: raceGrade,
                        });

                        const jraRaceData = JraRaceEntity.createWithoutId(
                            RaceData.create(
                                raceType,
                                raceName,
                                raceDateTime,
                                raceCourse,
                                raceGrade,
                                raceNumber,
                            ),
                            HeldDayData.create(raceHeld, raceHeldDay),
                            HorseRaceConditionData.create(
                                raceSurfaceType,
                                raceDistance,
                            ),
                            getJSTDate(new Date()),
                        );
                        jraRaceDataList.push(jraRaceData);
                    });
            });
            return jraRaceDataList;
        } catch (error) {
            console.error('HTMLの取得に失敗しました', error);
            return [];
        }
    }

    
    private readonly extractRaceCourse = (
        raceType: RaceType,
        theadElementMatch: RegExpExecArray,
    ): RaceCourse => {
        const placeString: string = theadElementMatch[2];
        
        const place: RaceCourse = placeString;
        return validateRaceCourse(raceType, place);
    };

    
    private readonly extractRaceHeld = (
        theadElementMatch: RegExpExecArray,
    ): number | null => {
        
        if (Number.isNaN(Number.parseInt(theadElementMatch[1]))) {
            return null;
        }
        const raceHeld: number = Number.parseInt(theadElementMatch[1]);
        return raceHeld;
    };

    
    private readonly extractRaceHeldDay = (
        theadElementMatch: RegExpExecArray,
    ): number | null => {
        
        if (Number.isNaN(Number.parseInt(theadElementMatch[3]))) {
            return null;
        }
        const raceHeldDay: number = Number.parseInt(theadElementMatch[3]);
        return raceHeldDay;
    };

    
    private readonly extractRaceNumber = (raceNumAndTime: string): number => {
        
        const raceNum: number = Number.parseInt(raceNumAndTime.split('R')[0]);
        return raceNum;
    };

    
    private readonly extractRaceDistance = (
        distanceMatch: RegExpExecArray | null,
    ): number | null => {
        const distance: number | null = distanceMatch
            ? Number.parseInt(distanceMatch[0].replace('m', ''))
            : null;
        return distance;
    };

    
    private readonly extractRaceTime = (
        raceNumAndTime: string,
        date: Date,
    ): Date => {
        
        
        
        
        const [, raceTime] = raceNumAndTime.split('R');
        
        const [hour, minute] = raceTime
            .split(':')
            .map((time: string) => Number.parseInt(time));
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hour,
            minute,
        );
    };

    
    private readonly extractSurfaceType = (
        surfaceTypeMatch: RegExpExecArray | null,
    ): RaceCourseType | null => {
        
        const surfaceType: string = (surfaceTypeMatch?.[0] ?? '')
            .replace('ダ', 'ダート')
            .replace('障', '障害');
        if (
            surfaceType !== '芝' &&
            surfaceType !== 'ダート' &&
            surfaceType !== '障害'
        ) {
            return null;
        }
        return surfaceType;
    };

    
    private readonly extractRaceGradeAndRaceName = (
        tbodyTrTdElement1: string,
        raceSurfaceType: RaceCourseType,
        rowRaceName: string,
    ): [GradeType, string] => {
        let raceGrade: GradeType | null = null;

        if (rowRaceName.includes('(GⅠ)')) {
            raceGrade = raceSurfaceType === '障害' ? 'J.GⅠ' : 'GⅠ';
            rowRaceName = rowRaceName.replace('(GⅠ)', '');
        }
        if (rowRaceName.includes('(GⅡ)')) {
            raceGrade = raceSurfaceType === '障害' ? 'J.GⅡ' : 'GⅡ';
            rowRaceName = rowRaceName.replace('(GⅡ)', '');
        }
        if (rowRaceName.includes('(GⅢ)')) {
            raceGrade = raceSurfaceType === '障害' ? 'J.GⅢ' : 'GⅢ';
            rowRaceName = rowRaceName.replace('(GⅢ)', '');
        }
        if (rowRaceName.includes('(L)')) {
            raceGrade = 'Listed';
            rowRaceName = rowRaceName.replace('(L)', '');
        }
        if (raceGrade === null) {
            

            if (tbodyTrTdElement1.includes('オープン')) {
                raceGrade = 'オープン特別';
            }
            if (tbodyTrTdElement1.includes('3勝クラス')) {
                raceGrade = '3勝クラス';
            }
            if (tbodyTrTdElement1.includes('2勝クラス')) {
                raceGrade = '2勝クラス';
            }
            if (tbodyTrTdElement1.includes('1勝クラス')) {
                raceGrade = '1勝クラス';
            }
            if (tbodyTrTdElement1.includes('1600万')) {
                raceGrade = '1600万下';
            }
            if (tbodyTrTdElement1.includes('1000万')) {
                raceGrade = '1000万下';
            }
            if (tbodyTrTdElement1.includes('900万')) {
                raceGrade = '900万下';
            }
            if (tbodyTrTdElement1.includes('500万')) {
                raceGrade = '500万下';
            }
            if (tbodyTrTdElement1.includes('未勝利')) {
                raceGrade = '未勝利';
            }
            if (tbodyTrTdElement1.includes('未出走')) {
                raceGrade = '未出走';
            }
            if (tbodyTrTdElement1.includes('新馬')) {
                raceGrade = '新馬';
            }
        }
        if (raceGrade === null) {
            if (rowRaceName.includes('オープン')) {
                raceGrade = 'オープン特別';
            }
            if (rowRaceName.includes('3勝クラス')) {
                raceGrade = '3勝クラス';
            }
            if (rowRaceName.includes('2勝クラス')) {
                raceGrade = '2勝クラス';
            }
            if (rowRaceName.includes('1勝クラス')) {
                raceGrade = '1勝クラス';
            }
            if (rowRaceName.includes('1600万')) {
                raceGrade = '1600万下';
            }
            if (rowRaceName.includes('1000万')) {
                raceGrade = '1000万下';
            }
            if (rowRaceName.includes('900万')) {
                raceGrade = '900万下';
            }
            if (rowRaceName.includes('500万')) {
                raceGrade = '500万下';
            }
            if (rowRaceName.includes('未勝利')) {
                raceGrade = '未勝利';
            }
            if (rowRaceName.includes('未出走')) {
                raceGrade = '未出走';
            }
            if (rowRaceName.includes('新馬')) {
                raceGrade = '新馬';
            }
            if (rowRaceName.includes('オープン')) {
                raceGrade = 'オープン';
            }
        }

        return [raceGrade ?? '格付けなし', rowRaceName];
    };

    
    @Logger
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: JraRaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: JraRaceEntity[];
        failureData: JraRaceEntity[];
    }> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
