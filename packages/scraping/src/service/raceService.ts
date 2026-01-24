import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { load } from 'cheerio';
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
                return this.parseOverseas(html, date);
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
        const $ = load(html);
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
        _date: Date,
        _location: string,
    ): RaceHtmlEntity[] {
        const _$ = load(html);
        const raceEntityList: RaceHtmlEntity[] = [];

        console.log(_date, _location, _$);

        // TODO: NARのHTML構造に合わせたパース処理を実装
        // section.raceTable から抽出
        console.warn('NAR parsing is not fully implemented yet');

        return raceEntityList;
    }

    /**
     * OVERSEAS（海外競馬）のHTMLをパース
     * HTMLから .racelist を解析
     */
    private parseOverseas(html: string, _date: Date): RaceHtmlEntity[] {
        const _$ = load(html);
        const raceEntityList: RaceHtmlEntity[] = [];

        console.log(_date, _$);

        // TODO: OVERSEASのHTML構造に合わせたパース処理を実装
        // .racelist から抽出
        console.warn('OVERSEAS parsing is not fully implemented yet');

        return raceEntityList;
    }

    /**
     * KEIRIN（競輪）のHTMLをパース
     * HTMLから #content セクションを解析
     */
    private parseKeirin(
        html: string,
        _date: Date,
        _location: string,
    ): RaceHtmlEntity[] {
        const _$ = load(html);
        const raceEntityList: RaceHtmlEntity[] = [];

        console.log(_date, _location, _$);

        // TODO: KEIRINのHTML構造に合わせたパース処理を実装
        // #content から抽出
        console.warn('KEIRIN parsing is not fully implemented yet');

        return raceEntityList;
    }

    /**
     * AUTORACE（オートレース）のHTMLをパース
     * HTMLから .section を解析
     */
    private parseAutorace(
        html: string,
        _date: Date,
        _location: string,
    ): RaceHtmlEntity[] {
        const _$ = load(html);
        const raceEntityList: RaceHtmlEntity[] = [];

        console.log(_date, _location, _$);

        // TODO: AUTORACEのHTML構造に合わせたパース処理を実装
        // .section から抽出
        console.warn('AUTORACE parsing is not fully implemented yet');

        return raceEntityList;
    }

    /**
     * BOATRACE（ボートレース）のHTMLをパース
     * HTMLから .heading2_titleName を解析
     */
    private parseBoatrace(
        html: string,
        _date: Date,
        _location: string,
    ): RaceHtmlEntity[] {
        const _$ = load(html);
        const raceEntityList: RaceHtmlEntity[] = [];

        console.log(_date, _location, _$);

        // TODO: BOATRACEのHTML構造に合わせたパース処理を実装
        // .heading2_titleName から抽出
        console.warn('BOATRACE parsing is not fully implemented yet');

        return raceEntityList;
    }
}
