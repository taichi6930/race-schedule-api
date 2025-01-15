import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { NarRaceData } from '../../domain/narRaceData';
import { INarRaceDataHtmlGateway } from '../../gateway/interface/iNarRaceDataHtmlGateway';
import {
    NarGradeType,
    validateNarGradeType,
} from '../../utility/data/nar/narGradeType';
import { NarRaceCourseType } from '../../utility/data/nar/narRaceCourseType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { processNarRaceName } from '../../utility/raceName';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { NarRaceEntity } from '../entity/narRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class NarRaceRepositoryFromHtmlImpl
    implements IRaceRepository<NarRaceEntity, NarPlaceEntity>
{
    constructor(
        @inject('NarRaceDataHtmlGateway')
        private readonly narRaceDataHtmlGateway: INarRaceDataHtmlGateway,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceEntityList(
        request: FetchRaceListRequest<NarPlaceEntity>,
    ): Promise<FetchRaceListResponse<NarRaceEntity>> {
        const narRaceDataList: NarRaceEntity[] = [];
        const placeEntityList = request.placeEntityList;
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                narRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithNarPlace(
                        placeEntity,
                    )),
                );
            }
        }
        return new FetchRaceListResponse(narRaceDataList);
    }

    @Logger
    async fetchRaceListFromHtmlWithNarPlace(
        placeEntity: NarPlaceEntity,
    ): Promise<NarRaceEntity[]> {
        try {
            const htmlText = await this.narRaceDataHtmlGateway.getRaceDataHtml(
                placeEntity.placeData.dateTime,
                placeEntity.placeData.location,
            );
            const narRaceDataList: NarRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            const raceTable = $('section.raceTable');
            const trs = raceTable.find('tr.data');

            Array.from(trs).forEach((tr: cheerio.Element) => {
                try {
                    const tds = $(tr).find('td');
                    const distance = this.extractDistance(
                        Array.from(tds).map((td: cheerio.Element) =>
                            $(td).text(),
                        ),
                    );
                    if (distance <= 0) {
                        return;
                    }
                    const raceName = this.extractRaceName(
                        Array.from(tds).map((td: cheerio.Element) =>
                            $(td).text(),
                        ),
                    );
                    const grade = this.extractGrade(
                        Array.from(tds).map((td: cheerio.Element) =>
                            $(td).text(),
                        ),
                    );
                    const surfaceType = this.extractSurfaceType(
                        Array.from(tds).map((td: cheerio.Element) =>
                            $(td).text(),
                        ),
                    );
                    const raceNumber = this.extractRaceNumber(
                        Array.from(tds).map((td: cheerio.Element) =>
                            $(td).text(),
                        ),
                    );
                    // 0時0分の日付を取得
                    const raceDate = new Date(
                        placeEntity.placeData.dateTime.getFullYear(),
                        placeEntity.placeData.dateTime.getMonth(),
                        placeEntity.placeData.dateTime.getDate(),
                        0,
                        0,
                    );
                    const raceDateTime = this.extractRaceDateTime(
                        Array.from(tds).map((td: cheerio.Element) =>
                            $(td).text(),
                        ),
                        placeEntity.placeData.dateTime,
                    );
                    const newRaceName = processNarRaceName({
                        name: raceName,
                        place: placeEntity.placeData.location,
                        date: raceDate,
                        surfaceType: surfaceType,
                        distance: distance,
                        grade: grade,
                    });
                    narRaceDataList.push(
                        new NarRaceEntity(
                            null,
                            NarRaceData.create(
                                newRaceName,
                                raceDateTime,
                                placeEntity.placeData.location,
                                surfaceType,
                                distance,
                                grade,
                                raceNumber,
                            ),
                            getJSTDate(new Date()),
                        ),
                    );
                } catch (e) {
                    console.error('レースデータの取得に失敗しました', e);
                }
            });
            return narRaceDataList;
        } catch (e) {
            console.error('htmlを取得できませんでした', e);
            return [];
        }
    }

    private extractRaceNumber(race: string[]): number {
        return (
            race
                .map((item) => {
                    const match = /(\d+)[Rr]/.exec(item);
                    return match ? parseInt(match[1]) : 0;
                })
                .find((item) => item !== 0) ?? 0
        );
    }

    private extractDistance(race: string[]): number {
        return (
            race
                .map((item) => {
                    const match = /(\d+)m/.exec(item);
                    return match ? parseInt(match[1]) : 0;
                })
                .find((item) => item !== 0) ?? 0
        );
    }

    private extractRaceDateTime(race: string[], date: Date): Date {
        const timeString =
            race.find((item) => /(\d+):(\d+)/.test(item)) ?? '0:0';
        const [hour, minute] = timeString.split(':').map(Number);
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hour,
            minute,
        );
    }

    private extractSurfaceType(race: string[]): NarRaceCourseType {
        const regex = /(芝)[左右直]+[0-9]+m/;
        const trackType = race.find((item) => regex.test(item));
        if (trackType === null || trackType === undefined || trackType === '') {
            return 'ダート';
        }
        return '芝';
    }

    private extractGrade(race: string[]): NarGradeType {
        let grade: NarGradeType = '一般';
        if (race.includes('準重賞')) {
            return '地方準重賞';
        }
        if (race.includes('重賞')) {
            grade = '地方重賞';
        }
        const regexMap: Record<string, string> = {
            JpnIII: 'JpnⅢ',
            JpnII: 'JpnⅡ',
            JpnI: 'JpnⅠ',
            JpnＩ: 'JpnⅠ',
            ＧＩ: 'GⅠ',
        };
        const regexList = ['JpnIII', 'JpnII', 'JpnI', 'JpnＩ', 'ＧＩ'];
        for (const regex of regexList) {
            if (race.some((item) => item.includes(regex))) {
                grade = regexMap[regex];
                break;
            }
        }
        return validateNarGradeType(grade);
    }

    private extractRaceName(race: string[]): string {
        // 重賞の取得
        const regexList = ['JpnIII', 'JpnII', 'JpnI', 'JpnＩ', 'ＧＩ'];
        let raceName: string | null = null;
        for (const regex of regexList) {
            for (const item of race) {
                const _raceName = item.match(regex);
                if (_raceName !== null) {
                    raceName = item.replace(regex, '');
                }
            }
            if (raceName !== null) {
                break;
            }
        }
        return (raceName ?? race[4]).replace(/\n/g, '');
    }

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerRaceEntityList(
        request: RegisterRaceListRequest<NarRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
