import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { RaceHtmlEntity } from '../entity/raceHtmlEntity';
import { IRaceHtmlRepository } from '../repository/interface/IRaceHtmlRepository';
import type { IRaceService } from './interface/IRaceService';

@injectable()
export class RaceService implements IRaceService {
    public constructor(
        @inject('RaceHtmlRepository')
        private readonly raceHtmlRepository: IRaceHtmlRepository,
    ) {}

    /**
     * レースデータを取得
     * @param raceType - レース種別
     * @param date - 日付
     * @param location - 開催場所
     * @param number - レース番号（JRA/BOATRACEのみ使用）
     */
    @Logger
    public async fetch(
        raceType: RaceType,
        date: Date,
        location?: string,
        number?: number,
    ): Promise<RaceHtmlEntity[]> {
        // キャッシュから取得を試みる
        const html: string =
            (await this.raceHtmlRepository.loadRaceHtml(
                raceType,
                date,
                location,
                number,
            )) ??
            (await this.raceHtmlRepository.fetchRaceHtml(
                raceType,
                date,
                location,
                number,
            ));

        // レース種別ごとにパース処理を振り分け
        switch (raceType) {
            case RaceType.JRA: {
                return this.parseJra(raceType, html, date, location ?? '');
            }
            case RaceType.NAR: {
                return this.parseNar(html, date, location ?? '');
            }
            case RaceType.OVERSEAS: {
                return this.parseOverseas(html);
            }
            case RaceType.KEIRIN: {
                return this.parseKeirin(html, date, location ?? '');
            }
            case RaceType.AUTORACE: {
                return this.parseAutorace(html, date, location ?? '');
            }
            case RaceType.BOATRACE: {
                return this.parseBoatrace(html, date, location ?? '');
            }
        }
    }

    /**
     * JRA（中央競馬）のHTMLをパース
     * HTMLから table.hr-tableSchedule を解析してレース情報を抽出
     */
    private parseJra(
        raceType: RaceType,
        html: string,
        date: Date,
        location: string,
    ): RaceHtmlEntity[] {
        const $ = cheerio.load(html);
        const raceEntityList: RaceHtmlEntity[] = [];
        const raceTable = $('table.hr-tableSchedule');

        if (raceTable.length === 0) {
            console.warn(`JRAレースデータが見つかりませんでした: ${location}`);
            return [];
        }

        const trList = raceTable.find('tbody > tr');

        trList.each((i, elem) => {
            const tr = $(elem);
            const raceNumTd = tr.find('td.hr-tableSchedule__data--date');
            if (raceNumTd.length === 0) return;

            // レース番号と時間の抽出
            const raceNumText = raceNumTd.text().trim(); // 例: "1R9:40"
            const raceNumExec = /(\d+)R/.exec(raceNumText);
            const raceNumber = Number.parseInt(
                raceNumExec ? raceNumExec[1] : '0',
            );
            const timeExec = /(\d+):(\d+)/.exec(raceNumText);
            const hour = timeExec ? Number.parseInt(timeExec[1]) : 0;
            const minute = timeExec ? Number.parseInt(timeExec[2]) : 0;

            const raceTime = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                hour,
                minute,
            );

            // レース名・グレード・距離などの抽出
            const raceNameTd = tr.find('td').eq(1);
            const raceName = raceNameTd.find('a').text().trim();
            const highGrade = raceNameTd.find('span.hr-ic_g').text().trim();
            const rowGrade = raceNameTd.find('span.hr-gray').text().trim();
            const grade = highGrade || rowGrade || '';

            // 距離・馬場の抽出
            const distanceTd = tr.find('td').eq(2);
            const distanceText = distanceTd.text().trim();
            const distanceMatch = /(\d+)m/.exec(distanceText);
            const distance = distanceMatch
                ? Number.parseInt(distanceMatch[1])
                : undefined;
            const surfaceType = distanceText.includes('芝')
                ? '芝'
                : distanceText.includes('ダ')
                  ? 'ダート'
                  : distanceText.includes('障')
                    ? '障害'
                    : undefined;

            raceEntityList.push({
                raceType,
                datetime: raceTime,
                location,
                raceNumber,
                raceName,
                grade,
                distance,
                surfaceType,
            });
        });

        return raceEntityList;
    }

    /**
     * NAR（地方競馬）のHTMLをパース
     * HTMLから section.raceTable を解析
     */
    private parseNar(
        html: string,
        date: Date,
        location: string,
    ): RaceHtmlEntity[] {
        const $ = cheerio.load(html);
        const raceEntityList: RaceHtmlEntity[] = [];
        const raceTable = $('section.raceTable');
        const trs = raceTable.find('tr.data');

        for (const tr of trs) {
            try {
                const tds = $(tr).find('td');
                const tdTexts = [...tds].map((td) => $(td).text());

                // 距離抽出
                const distanceMatch = tdTexts
                    .map((item) => {
                        const match = /(\d+)m/.exec(item);
                        return match ? Number.parseInt(match[1]) : 0;
                    })
                    .find((item) => item !== 0);
                const distance = distanceMatch ?? undefined;

                if (!distance) {
                    continue;
                }

                // 馬場タイプ抽出
                const surfaceTypeRegex = /(芝)[右左直]+\d+m/;
                const trackType = tdTexts.find((item) =>
                    surfaceTypeRegex.test(item),
                );
                const surfaceType = trackType ? '芝' : 'ダート';

                // レース番号抽出
                const raceNumberMatch = tdTexts
                    .map((item) => {
                        const match = /(\d+)[Rr]/.exec(item);
                        return match ? Number.parseInt(match[1]) : 0;
                    })
                    .find((item) => item !== 0);
                const raceNumber = raceNumberMatch ?? 0;

                // 時間抽出
                const timeString =
                    tdTexts.find((item) => /(\d+):(\d+)/.test(item)) ?? '0:0';
                const [hour, minute] = timeString.split(':').map(Number);
                const raceDateTime = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    hour,
                    minute,
                );

                // グレード抽出
                let grade = '一般';
                if (tdTexts.includes('準重賞')) {
                    grade = '地方準重賞';
                } else if (tdTexts.includes('重賞')) {
                    grade = '地方重賞';
                }
                const gradeRegexMap: Record<string, string> = {
                    JpnIII: 'JpnⅢ',
                    JpnII: 'JpnⅡ',
                    JpnI: 'JpnⅠ',
                    JpnＩ: 'JpnⅠ',
                    ＧＩ: 'GⅠ',
                };
                for (const [regex, gradeValue] of Object.entries(
                    gradeRegexMap,
                )) {
                    if (tdTexts.some((item) => item.includes(regex))) {
                        grade = gradeValue;
                        break;
                    }
                }

                // レース名抽出
                const gradeRegexList = [
                    'JpnIII',
                    'JpnII',
                    'JpnI',
                    'JpnＩ',
                    'ＧＩ',
                ];
                let raceName: string | null = null;
                for (const regex of gradeRegexList) {
                    for (const item of tdTexts) {
                        const _raceName = item.match(regex);
                        if (_raceName !== null) {
                            raceName = item.replace(regex, '');
                        }
                    }
                    if (raceName !== null) {
                        break;
                    }
                }
                const finalRaceName = (raceName ?? tdTexts[4]) || '';

                raceEntityList.push({
                    raceType: RaceType.NAR,
                    datetime: raceDateTime,
                    location,
                    raceNumber,
                    raceName: finalRaceName.replace(/\n/g, ''),
                    grade,
                    distance,
                    surfaceType,
                });
            } catch (error) {
                console.error('レースデータの取得に失敗しました', error);
            }
        }
        return raceEntityList;
    }

    /**
     * OVERSEAS（海外競馬）のHTMLをパース
     * HTMLから .racelist を解析
     */
    private parseOverseas(html: string): RaceHtmlEntity[] {
        const $ = cheerio.load(html);
        const raceEntityList: RaceHtmlEntity[] = [];
        const content = $('.racelist');

        content.find('.racelist__day').each((__, element) => {
            // class="un-trigger"があればskipする
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
                        if ($(raceElement).find('.nolink').text().length > 0) {
                            return;
                        }

                        const rowRaceName = $(raceElement)
                            .find('.racelist__race__title')
                            .find('.name')
                            .text();

                        const location: string = $(raceElement)
                            .find('.racelist__race__sub')
                            .find('.course')
                            .text()
                            .trim();

                        const surfaceTypeAndDistanceText = $(raceElement)
                            .find('.racelist__race__sub')
                            .find('.type')
                            .text()
                            .trim();

                        const surfaceTypeList = ['芝', 'ダート', '障害', 'AW'];
                        const surfaceType =
                            surfaceTypeList.find((type) =>
                                surfaceTypeAndDistanceText.includes(type),
                            ) ?? '不明';

                        const distanceMatch = /\d+/.exec(
                            surfaceTypeAndDistanceText,
                        );
                        const distance = distanceMatch
                            ? Number(distanceMatch[0])
                            : undefined;

                        const gradeText: string = rowRaceName.includes('（L）')
                            ? 'Listed'
                            : $(raceElement)
                                  .find('.racelist__race__title')
                                  .find('.grade')
                                  .find('span')
                                  .text()
                                  .replace('G1', 'GⅠ')
                                  .replace('G2', 'GⅡ')
                                  .replace('G3', 'GⅢ');
                        const grade: string =
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

                        raceEntityList.push({
                            raceType: RaceType.OVERSEAS,
                            datetime: raceDate,
                            location,
                            raceNumber: number,
                            raceName: rowRaceName,
                            grade,
                            distance,
                            surfaceType,
                        });
                    } catch (error) {
                        console.error(
                            'レースデータ加工中にエラーが発生しました',
                            error,
                        );
                    }
                });
        });
        return raceEntityList;
    }

    /**
     * KEIRIN（競輪）のHTMLをパース
     * HTMLから #content セクションを解析
     */
    private parseKeirin(
        html: string,
        date: Date,
        location: string,
    ): RaceHtmlEntity[] {
        const $ = cheerio.load(html);
        const raceEntityList: RaceHtmlEntity[] = [];
        const content = $('#content');
        const section1 = content.find('.section1');

        section1.each((_, section1Element) => {
            $(section1Element)
                .find('.w480px')
                .each((__, element) => {
                    try {
                        // 発走時間の取得
                        const raceTime = $(element)
                            .find('.tx_blue')
                            .next()
                            .text()
                            .trim();
                        const [hour, minute] = raceTime.split(':').map(Number);

                        // レース番号の取得
                        const raceNumberMatch = /第(\d+)R/.exec(
                            $(element).find('a').text(),
                        );
                        const raceNumber = raceNumberMatch
                            ? Number(raceNumberMatch[1])
                            : 0;

                        // レースステージの抽出
                        const raceStageText = $(element).text();
                        let raceStage: string | undefined;
                        // 簡易的なステージ判定
                        if (raceStageText.includes('決勝')) {
                            raceStage = '決勝';
                        } else if (raceStageText.includes('準決勝')) {
                            raceStage = '準決勝';
                        } else if (raceStageText.includes('予選')) {
                            raceStage = '予選';
                        }

                        if (!raceStage) return;

                        raceEntityList.push({
                            raceType: RaceType.KEIRIN,
                            datetime: new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                date.getDate(),
                                hour,
                                minute,
                            ),
                            location,
                            raceNumber,
                            raceName: `${location}競輪`,
                            stage: raceStage,
                        });
                    } catch (error) {
                        console.error(
                            'KEIRINレースデータの取得に失敗しました',
                            error,
                        );
                    }
                });
        });
        return raceEntityList;
    }

    /**
     * AUTORACE（オートレース）のHTMLをパース
     * HTMLから .section を解析
     */
    private parseAutorace(
        html: string,
        date: Date,
        location: string,
    ): RaceHtmlEntity[] {
        const $ = cheerio.load(html);
        const raceEntityList: RaceHtmlEntity[] = [];
        const content = $('#content');
        const section = content.find('.section');

        section.each((_, sectionElement) => {
            $(sectionElement)
                .find('.w480px')
                .each((__, element) => {
                    try {
                        const raceTimeText = $(element)
                            .find('.start-time')
                            .text();
                        const [hour, minute] = raceTimeText
                            .replace('発走時間', '')
                            .split(':')
                            .map(Number);

                        const raceDate = new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate(),
                            hour,
                            minute,
                        );

                        const aTag = $(element).find('.w380px').find('a');
                        const decodedATag = decodeURIComponent(aTag.text());

                        const raceNumberMatch = /(\d+)R\s+(.+)\s+(\d+)m/.exec(
                            decodedATag,
                        );
                        const raceNumber = raceNumberMatch
                            ? Number(raceNumberMatch[1])
                            : 0;

                        const rowRaceStage = raceNumberMatch
                            ? raceNumberMatch[2]
                                  .replace('Ｇレース７', '')
                                  .replace('グレードレース７', '')
                            : '';

                        const raceStage = rowRaceStage.trim();

                        if (raceStage !== '') {
                            raceEntityList.push({
                                raceType: RaceType.AUTORACE,
                                datetime: raceDate,
                                location,
                                raceNumber,
                                raceName: `${location}オートレース`,
                                stage: raceStage,
                            });
                        }
                    } catch (error) {
                        console.error(
                            'AUTORACEレースデータの取得に失敗しました',
                            error,
                        );
                    }
                });
        });
        return raceEntityList;
    }

    /**
     * BOATRACE（ボートレース）のHTMLをパース
     * HTMLから .heading2_titleName を解析
     */
    private parseBoatrace(
        html: string,
        date: Date,
        location: string,
    ): RaceHtmlEntity[] {
        const $ = cheerio.load(html);
        const raceEntityList: RaceHtmlEntity[] = [];

        // raceNameを取得
        const raceNameText = $('.heading2_titleName').text();

        const raceStageString = $('h3').text();
        let raceStage: string | undefined;
        // 簡易的なステージ判定
        if (raceStageString.includes('優勝戦')) {
            raceStage = '優勝戦';
        } else if (raceStageString.includes('準優勝戦')) {
            raceStage = '準優勝戦';
        } else if (raceStageString.includes('予選')) {
            raceStage = '予選';
        }

        if (!raceStage) {
            console.error('レースステージが取得できませんでした');
            return [];
        }

        const raceName = raceNameText;

        // contentsFrame1_innerのクラスを持つ要素を取得
        const raceSummaryInfo = $('.contentsFrame1_inner');
        const raceSummaryInfoChild = raceSummaryInfo.find('.table1');
        const raceSummaryInfoChildTd = raceSummaryInfoChild.find('td');

        // 12番目のtdを取得（12Rのため）
        const raceNumber = 12;
        const raceTime = raceSummaryInfoChildTd.eq(raceNumber).text();

        const [hourString, minuteString] = raceTime.split(':');
        const hour = Number.parseInt(hourString);
        const minute = Number.parseInt(minuteString);

        raceEntityList.push({
            raceType: RaceType.BOATRACE,
            datetime: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                hour,
                minute,
            ),
            location,
            raceNumber,
            raceName,
            stage: raceStage,
        });
        return raceEntityList;
    }
}
