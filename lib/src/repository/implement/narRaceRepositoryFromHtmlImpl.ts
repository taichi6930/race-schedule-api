import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { NarRaceData } from '../../domain/narRaceData';
import { IRaceDataHtmlGateway } from '../../gateway/interface/iRaceDataHtmlGateway';
import { processNarRaceName } from '../../utility/createRaceName';
import {
    NarGradeType,
    validateGradeType,
} from '../../utility/data/common/gradeType';
import type { RaceCourseType } from '../../utility/data/common/raceCourseType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { NarRaceEntity } from '../entity/narRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class NarRaceRepositoryFromHtmlImpl
    implements IRaceRepository<NarRaceEntity, NarPlaceEntity>
{
    public constructor(
        @inject('RaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IRaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<NarPlaceEntity>,
    ): Promise<NarRaceEntity[]> {
        const narRaceDataList: NarRaceEntity[] = [];
        const { placeEntityList } = searchFilter;
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                narRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithNarPlace(
                        placeEntity,
                    )),
                );
            }
        }
        return narRaceDataList;
    }

    @Logger
    public async fetchRaceListFromHtmlWithNarPlace(
        placeEntity: NarPlaceEntity,
    ): Promise<NarRaceEntity[]> {
        try {
            const htmlText = await this.raceDataHtmlGateway.getRaceDataHtml(
                RaceType.NAR,
                placeEntity.placeData.dateTime,
                placeEntity.placeData.location,
            );
            const narRaceDataList: NarRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            const raceTable = $('section.raceTable');
            const trs = raceTable.find('tr.data');

            for (const tr of trs) {
                try {
                    const tds = $(tr).find('td');
                    const distance = this.extractDistance(
                        [...tds].map((td) => $(td).text()),
                    );
                    if (distance <= 0) {
                        continue;
                    }
                    const raceName = this.extractRaceName(
                        [...tds].map((td) => $(td).text()),
                    );
                    const grade = this.extractGrade(
                        [...tds].map((td) => $(td).text()),
                    );
                    const surfaceType = this.extractSurfaceType(
                        [...tds].map((td) => $(td).text()),
                    );
                    const raceNumber = this.extractRaceNumber(
                        [...tds].map((td) => $(td).text()),
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
                        [...tds].map((td) => $(td).text()),
                        placeEntity.placeData.dateTime,
                    );
                    const processedRaceName = processNarRaceName({
                        name: raceName,
                        place: placeEntity.placeData.location,
                        date: raceDate,
                        surfaceType,
                        distance,
                        grade,
                    });
                    narRaceDataList.push(
                        NarRaceEntity.createWithoutId(
                            NarRaceData.create(
                                processedRaceName,
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
                } catch (error) {
                    console.error('レースデータの取得に失敗しました', error);
                }
            }
            return narRaceDataList;
        } catch (error) {
            console.error('htmlを取得できませんでした', error);
            return [];
        }
    }

    private extractRaceNumber(race: string[]): number {
        return (
            race
                .map((item) => {
                    const match = /(\d+)[Rr]/.exec(item);
                    return match ? Number.parseInt(match[1]) : 0;
                })
                .find((item) => item !== 0) ?? 0
        );
    }

    private extractDistance(race: string[]): number {
        return (
            race
                .map((item) => {
                    const match = /(\d+)m/.exec(item);
                    return match ? Number.parseInt(match[1]) : 0;
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

    private extractSurfaceType(race: string[]): RaceCourseType {
        const regex = /(芝)[右左直]+\d+m/;
        const trackType = race.find((item) => regex.test(item));
        if (!trackType) {
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
        return validateGradeType(RaceType.NAR, grade);
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
     * @param raceEntityList
     */
    @Logger
    public async registerRaceEntityList(
        raceEntityList: NarRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
