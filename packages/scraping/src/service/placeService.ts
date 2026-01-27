import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { PlaceHtmlEntity } from '../entity/placeHtmlEntity';
import { IPlaceHtmlRepository } from '../repository/interface/IPlaceHtmlRepository';
import type { IPlaceService } from './interface/IPlaceService';

@injectable()
export class PlaceService implements IPlaceService {
    public constructor(
        @inject('PlaceHtmlRepository')
        private readonly placeHtmlRepository: IPlaceHtmlRepository,
    ) {}

    @Logger
    public async fetch(
        raceType: RaceType,
        date: Date,
    ): Promise<PlaceHtmlEntity[]> {
        // キャッシュから取得を試みる
        const html: string =
            (await this.placeHtmlRepository.loadPlaceHtml(raceType, date)) ??
            (await this.placeHtmlRepository.fetchPlaceHtml(raceType, date));

        // レース種別ごとにパース処理を振り分け
        switch (raceType) {
            case RaceType.JRA: {
                return this.parseJra(html, date);
            }
            case RaceType.NAR: {
                return this.parseNar(html, date);
            }
            case RaceType.OVERSEAS: {
                return this.parseOverseas(html, date);
            }
            case RaceType.KEIRIN: {
                return this.parseKeirin(html, date);
            }
            case RaceType.AUTORACE: {
                return this.parseAutorace(html, date);
            }
            case RaceType.BOATRACE: {
                return this.parseBoatrace();
            }
        }
    }

    /**
     * JRA（中央競馬）のHTMLをパース
     */
    private parseJra(html: string, date: Date): PlaceHtmlEntity[] {
        const $ = cheerio.load(html);

        // 競馬場のイニシャルと名前のマッピング
        const placeMap: Record<string, string> = {
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

        // 競馬場名を取得する関数
        const getPlaceName = (placeInitial: string): string =>
            placeMap[placeInitial];

        // 開催日数を計算するためのdict
        const placeHeldDayTimesCountMap: Record<
            string,
            Record<string, number>
        > = {};

        const placeEntityList: PlaceHtmlEntity[] = [];

        for (const month of Array.from({ length: 12 }, (_, k) => k + 1)) {
            const monthData = $(`#mon_${month.toString()}`);
            for (const day of Array.from({ length: 31 }, (_, k) => k + 1)) {
                monthData
                    .find(`.d${day.toString()}`)
                    .each((_: number, element) => {
                        // 開催競馬場のイニシャルを取得
                        const placeInitial: string = $(element)
                            .find('span')
                            .text();
                        const place: string = getPlaceName(placeInitial);
                        // 競馬場が存在しない場合はスキップ
                        if (!place) return;

                        // aタグの中の数字を取得、spanタグの中の文字はいらない
                        const heldTimesInitial = $(element).text();
                        // 数字のみを取得（3東の形になっているので、placeInitialの分を削除）
                        const heldTimes: number = Number.parseInt(
                            heldTimesInitial.replace(placeInitial, ''),
                        );
                        // placeCountDictに競馬場が存在しない場合は初期化
                        if (!(place in placeHeldDayTimesCountMap)) {
                            placeHeldDayTimesCountMap[place] = {};
                        }
                        // 開催回数が存在しない場合は初期化
                        if (!(heldTimes in placeHeldDayTimesCountMap[place])) {
                            placeHeldDayTimesCountMap[place][heldTimes] = 0;
                        }
                        // placeCountDict[place][heldTimes]に1を加算
                        placeHeldDayTimesCountMap[place][heldTimes] += 1;

                        // 開催日数を取得
                        const heldDayTimes: number =
                            placeHeldDayTimesCountMap[place][heldTimes];

                        placeEntityList.push({
                            raceType: RaceType.JRA,
                            datetime: new Date(
                                date.getFullYear(),
                                month - 1,
                                day,
                            ),
                            placeName: place,
                            placeHeldDays: {
                                heldTimes,
                                heldDayTimes,
                            },
                        });
                    });
            }
        }
        return placeEntityList;
    }

    /**
     * NAR（地方競馬）のHTMLをパース
     */
    private parseNar(html: string, date: Date): PlaceHtmlEntity[] {
        const $ = cheerio.load(html);
        const chartWrapprer = $('.chartWrapprer');
        const table = chartWrapprer.find('table');
        const tbody = table.find('tbody');
        const trs = tbody.find('tr');
        const placeDataDict: Record<string, number[]> = {};

        trs.each((index: number, element) => {
            if (index < 2) {
                return;
            }
            const tds = $(element).find('td');
            const placeData = $(tds[0]).text();
            tds.each((tdIndex: number, tdElement) => {
                if (tdIndex === 0) {
                    if (!(placeData in placeDataDict)) {
                        placeDataDict[placeData] = [];
                    }
                    return;
                }
                if (
                    $(tdElement).text().includes('●') ||
                    $(tdElement).text().includes('☆') ||
                    $(tdElement).text().includes('Ｄ')
                ) {
                    placeDataDict[placeData].push(tdIndex);
                }
            });
        });

        const placeDataList: PlaceHtmlEntity[] = [];
        for (const [place, raceDays] of Object.entries(placeDataDict)) {
            for (const raceDay of raceDays) {
                placeDataList.push({
                    raceType: RaceType.NAR,
                    datetime: new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        raceDay,
                    ),
                    placeName: place,
                    placeHeldDays: undefined,
                });
            }
        }
        return placeDataList;
    }

    /**
     * OVERSEAS（海外競馬）のHTMLをパース
     */
    private parseOverseas(html: string, date: Date): PlaceHtmlEntity[] {
        // 海外競馬は月の初日のみを返す
        return [
            {
                raceType: RaceType.OVERSEAS,
                datetime: new Date(date.getFullYear(), date.getMonth(), 1),
                placeName: 'ロンシャン', // TODO: 適切な開催地を設定する
                placeHeldDays: undefined,
            },
        ];
    }

    /**
     * KEIRIN（競輪）のHTMLをパース
     */
    private parseKeirin(html: string, date: Date): PlaceHtmlEntity[] {
        const placeEntityList: PlaceHtmlEntity[] = [];
        const $ = cheerio.load(html);

        const chartWrapper = $('#content');
        const tables = chartWrapper.find('table');

        tables.each((_: number, element) => {
            const tbody = $(element).find('tbody');
            const trs = tbody.find('tr');
            trs.each((__: number, trElement) => {
                try {
                    const th = $(trElement).find('th');
                    const rowPlace = th.text().replace(' ', '');
                    if (!rowPlace) {
                        return;
                    }
                    if (rowPlace.length > 10) {
                        return;
                    }

                    const place = rowPlace;

                    const tds = $(trElement).find('td');
                    tds.each((index: number, tdElement) => {
                        const imgs = $(tdElement).find('img');
                        let grade: string | undefined;
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
                            placeEntityList.push({
                                raceType: RaceType.KEIRIN,
                                datetime,
                                placeName: place,
                                placeGrade: grade,
                                placeHeldDays: undefined,
                            });
                        }
                    });
                } catch (error) {
                    console.error(error);
                }
            });
        });
        return placeEntityList;
    }

    /**
     * AUTORACE（オートレース）のHTMLをパース
     */
    private parseAutorace(html: string, date: Date): PlaceHtmlEntity[] {
        const placeEntityList: PlaceHtmlEntity[] = [];
        const $ = cheerio.load(html);

        const chartWrapprer = $('#content');
        const tables = chartWrapprer.find('table');

        tables.each((_: number, element) => {
            const tbody = $(element).find('tbody');
            tbody.find('tr').each((__: number, trElement) => {
                const th = $(trElement).find('th');

                if (!th.text()) {
                    return;
                }

                // 川口２を川口に変換
                const place = th.text().replace('２', '');

                const tds = $(trElement).find('td');
                tds.each((index: number, tdElement) => {
                    const div = $(tdElement).find('div');
                    let grade: string | undefined;
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
                        placeEntityList.push({
                            raceType: RaceType.AUTORACE,
                            datetime,
                            placeName: place,
                            placeGrade: grade,
                            placeHeldDays: undefined,
                        });
                    }
                });
            });
        });
        return placeEntityList;
    }

    /**
     * BOATRACE（ボートレース）のHTMLをパース
     */
    private parseBoatrace(): PlaceHtmlEntity[] {
        // ボートレースは現状サポート外
        console.error(
            `Race type ${RaceType.BOATRACE} is not supported by this repository`,
        );
        return [];
    }
}
