import * as cheerio from 'cheerio';
import { format, formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { PlaceData } from '../../domain/placeData';
import { RaceData } from '../../domain/raceData';
import { RacePlayerData } from '../../domain/racePlayerData';
import { IRaceDataHtmlGateway } from '../../gateway/interface/iRaceDataHtmlGateway';
import { CommonParameter } from '../../utility/commonParameter';
import {
    processJraRaceName,
    processNarRaceName,
} from '../../utility/createRaceName';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import type { UpsertResult } from '../../utility/upsertResult';
import {
    GradeType,
    validateGradeType,
} from '../../utility/validateAndType/gradeType';
import { RaceStage, StageMap } from '../../utility/validateAndType/raceStage';
import { RaceSurfaceType } from '../../utility/validateAndType/raceSurfaceType';
import { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import { PlaceEntity } from '../entity/placeEntity';
import { RaceEntity } from '../entity/raceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

@injectable()
export class RaceRepositoryFromHtml implements IRaceRepository {
    public constructor(
        @inject('RaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IRaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     * @param commonParameter
     * @param searchRaceFilter
     * @param placeEntityList
     */
    @Logger
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        placeEntityList?: PlaceEntity[],
    ): Promise<RaceEntity[]> {
        const raceEntityList: RaceEntity[] = [];
        if (!placeEntityList) return raceEntityList;
        for (const placeEntity of placeEntityList) {
            switch (placeEntity.placeData.raceType) {
                case RaceType.JRA: {
                    {
                        const entityList =
                            await this.fetchRaceListFromHtmlForJra(placeEntity);
                        raceEntityList.push(...entityList);
                        break;
                    }
                }
                case RaceType.NAR: {
                    const entityList =
                        await this.fetchRaceListFromHtmlForNar(placeEntity);
                    raceEntityList.push(...entityList);
                    break;
                }
                case RaceType.KEIRIN: {
                    const entityList =
                        await this.fetchRaceListFromHtmlForKeirin(placeEntity);
                    raceEntityList.push(...entityList);
                    break;
                }
                case RaceType.AUTORACE: {
                    const entityList =
                        await this.fetchRaceListFromHtmlForAutorace(
                            placeEntity,
                        );
                    raceEntityList.push(...entityList);
                    break;
                }

                case RaceType.OVERSEAS:
                case RaceType.BOATRACE: {
                    console.error(
                        `Race type ${placeEntity.placeData.raceType} is not supported by this repository`,
                    );
                    placeEntityList = [];
                    break;
                }
            }
            // HTML_FETCH_DELAY_MSの環境変数から遅延時間を取得
            const delayedTimeMs = Number.parseInt(
                commonParameter.env.HTML_FETCH_DELAY_MS || '1000',
            );
            console.debug(`待機時間: ${delayedTimeMs}ms`);
            await new Promise((resolve) => setTimeout(resolve, delayedTimeMs));
            console.debug('待機時間が経ちました');
        }
        return raceEntityList;
    }

    /**
     * ターゲットの月リストを生成する
     *startDateからfinishDateまでの月のリストを生成する
     * @param startDate
     * @param finishDate
     */
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
    private async fetchRaceListFromHtmlForJra(
        placeEntity: PlaceEntity,
    ): Promise<RaceEntity[]> {
        try {
            // レース情報を取得
            const htmlText: string =
                await this.raceDataHtmlGateway.getRaceDataHtml(
                    placeEntity.placeData.raceType,
                    placeEntity.placeData.dateTime,
                    placeEntity.placeData.location,
                    placeEntity.heldDayData.heldTimes * 100 +
                        placeEntity.heldDayData.heldDayTimes,
                );
            const raceEntityList: RaceEntity[] = [];

            // HTMLをパースする
            const $ = cheerio.load(htmlText);
            // "hr-tableSchedule"クラスのtableを取得
            const raceTable = $('table.hr-tableSchedule');
            if (raceTable.length === 0) {
                console.warn(
                    `開催データが見つかりませんでした: ${placeEntity.placeData.location} ${format(
                        placeEntity.placeData.dateTime,
                        'yyyy-MM-dd',
                    )}`,
                );
                return [];
            }

            // tbody > tr をすべて取得
            const trList = raceTable.find('tbody > tr');

            trList.each((i, elem) => {
                const tr = $(elem);
                // レース先頭行のみ抽出（rowspan="2"のtd.hr-tableSchedule__data--dateがあるtr）
                const raceNumTd = tr.find('td.hr-tableSchedule__data--date');
                if (raceNumTd.length === 0) return;

                // レース番号
                const raceNumText = raceNumTd.text().trim(); // 例: "1R9:40"
                const raceNumExec = /(\d+R)/.exec(raceNumText);
                // Rを含むので、除去して数値に変換
                const raceNumber = Number.parseInt(
                    raceNumExec ? raceNumExec[1].replace('R', '') : '0',
                );

                /**
                 * レース時間を取得
                 * @param raceNumAndTime
                 * @param date
                 */
                const extractRaceTime = (
                    raceNumAndTime: string,
                    date: Date,
                ): Date => {
                    // tdが3つある
                    // 1つ目はレース番号とレース開始時間
                    // hh:mmの形式で取得
                    // tdの最初の要素からレース開始時間を取得 raceNumAndTimeのhh:mmを取得
                    const [, raceTime] = raceNumAndTime.split('R');
                    // hh:mmの形式からhhとmmを取得
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

                // 時間 1R9:40のR以降
                const raceTime = extractRaceTime(
                    raceNumText,
                    placeEntity.placeData.dateTime,
                );

                // レース名
                const rowRaceName = tr
                    .find('span.hr-tableSchedule__title')
                    .text()
                    .trim();

                // 高級グレード（GⅠ,GⅡ,GⅢ,Listed）
                let highGrade = '';
                if (tr.find('span.hr-label--g1').length > 0) highGrade = 'GⅠ';
                if (tr.find('span.hr-label--g2').length > 0) highGrade = 'GⅡ';
                if (tr.find('span.hr-label--g3').length > 0) highGrade = 'GⅢ';
                if (tr.find('span.hr-label--li').length > 0)
                    highGrade = 'Listed';

                // グレード・種別・距離
                const statusText = tr
                    .find('span.hr-tableSchedule__statusText')
                    .text()
                    .trim();

                // 種別
                const surfaceExec = /(芝|ダート|障害)/.exec(statusText);
                const surfaceType = surfaceExec ? surfaceExec[1] : '';

                // 距離
                const distanceExec = /(\d{3,4})m/.exec(statusText);
                const distance = Number.parseInt(
                    distanceExec ? distanceExec[1] : '0',
                );

                // グレード
                // 例: "3歳未勝利", "3歳1勝クラス(500万下)", "3歳オープン", "4歳以上2勝クラス(1000万下)"
                // 括弧を除いた最初の部分をグレードとみなす
                let rowGrade = '';
                const gradeExec =
                    /([\dオクスプランー上利勝新未歳馬]+)(\(|\s|$)/.exec(
                        statusText,
                    );
                if (gradeExec) [, rowGrade] = gradeExec;

                const extractRaceGrade = (
                    raceSurfaceType: RaceSurfaceType,
                    _highGrade: string,
                    _rowGrade: string,
                ): GradeType => {
                    // highGradeに値が入っていたらそれを優先する
                    // 例: GⅠ, GⅡ, GⅢ, Listed
                    if (_highGrade.length > 0) {
                        return raceSurfaceType === '障害'
                            ? `J.${_highGrade}`
                            : _highGrade;
                    }
                    if (_rowGrade.includes('オープン')) {
                        return 'オープン';
                    }
                    if (_rowGrade.includes('3勝クラス')) {
                        return '3勝クラス';
                    }
                    if (_rowGrade.includes('2勝クラス')) {
                        return '2勝クラス';
                    }
                    if (_rowGrade.includes('1勝クラス')) {
                        return '1勝クラス';
                    }
                    if (_rowGrade.includes('1600万')) {
                        return '1600万下';
                    }
                    if (_rowGrade.includes('1000万')) {
                        return '1000万下';
                    }
                    if (_rowGrade.includes('900万')) {
                        return '900万下';
                    }
                    if (_rowGrade.includes('500万')) {
                        return '500万下';
                    }
                    if (_rowGrade.includes('未勝利')) {
                        return '未勝利';
                    }
                    if (_rowGrade.includes('未出走')) {
                        return '未出走';
                    }
                    if (_rowGrade.includes('新馬')) {
                        return '新馬';
                    }
                    return '格付けなし';
                };

                const raceGrade = extractRaceGrade(
                    surfaceType,
                    highGrade,
                    rowGrade,
                );

                const conditionData = HorseRaceConditionData.create(
                    surfaceType,
                    distance,
                );

                const raceName = processJraRaceName({
                    name: rowRaceName
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
                        .replace('サラ系', ''),
                    place: placeEntity.placeData.location,
                    date: raceTime,
                    surfaceType: surfaceType,
                    distance: distance,
                    grade: raceGrade,
                });

                const raceData = RaceData.create(
                    placeEntity.placeData.raceType,
                    raceName,
                    raceTime,
                    placeEntity.placeData.location,
                    raceGrade,
                    raceNumber,
                );

                console.log(
                    RaceEntity.createWithoutId(
                        raceData,
                        placeEntity.heldDayData,
                        conditionData,
                        undefined, // stage は未指定
                        undefined, // racePlayerDataList は未指定
                    ),
                );

                raceEntityList.push(
                    RaceEntity.createWithoutId(
                        raceData,
                        placeEntity.heldDayData,
                        conditionData,
                        undefined, // stage は未指定
                        undefined, // racePlayerDataList は未指定
                    ),
                );
            });

            // まだEntity生成はしない
            return raceEntityList;
        } catch (error) {
            console.error('HTMLの取得に失敗しました', error);
            return [];
        }
    }

    @Logger
    private async fetchRaceListFromHtmlForNar(
        placeEntity: PlaceEntity,
    ): Promise<RaceEntity[]> {
        function extractDistance(_race: string[]): number {
            return (
                _race
                    .map((item) => {
                        const match = /(\d+)m/.exec(item);
                        return match ? Number.parseInt(match[1]) : 0;
                    })
                    .find((item) => item !== 0) ?? 0
            );
        }
        function extractSurfaceType(_race: string[]): RaceSurfaceType {
            const regex = /(芝)[右左直]+\d+m/;
            const trackType = _race.find((item) => regex.test(item));
            if (!trackType) {
                return 'ダート';
            }
            return '芝';
        }

        function extractRaceNumber(_race: string[]): number {
            return (
                _race
                    .map((item) => {
                        const match = /(\d+)[Rr]/.exec(item);
                        return match ? Number.parseInt(match[1]) : 0;
                    })
                    .find((item) => item !== 0) ?? 0
            );
        }

        function extractRaceDateTime(_race: string[], _date: Date): Date {
            const timeString =
                _race.find((item) => /(\d+):(\d+)/.test(item)) ?? '0:0';
            const [hour, minute] = timeString.split(':').map(Number);
            return new Date(
                _date.getFullYear(),
                _date.getMonth(),
                _date.getDate(),
                hour,
                minute,
            );
        }

        function extractGrade(_raceType: RaceType, _race: string[]): GradeType {
            let grade: GradeType = '一般';
            if (_race.includes('準重賞')) {
                return '地方準重賞';
            }
            if (_race.includes('重賞')) {
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
                if (_race.some((item) => item.includes(regex))) {
                    grade = regexMap[regex];
                    break;
                }
            }
            return validateGradeType(_raceType, grade);
        }

        function extractRaceName(_race: string[]): string {
            // 重賞の取得
            const regexList = ['JpnIII', 'JpnII', 'JpnI', 'JpnＩ', 'ＧＩ'];
            let raceName: string | null = null;
            for (const regex of regexList) {
                for (const item of _race) {
                    const _raceName = item.match(regex);
                    if (_raceName !== null) {
                        raceName = item.replace(regex, '');
                    }
                }
                if (raceName !== null) {
                    break;
                }
            }
            return (raceName ?? _race[4]).replace(/\n/g, '');
        }

        try {
            const htmlText = await this.raceDataHtmlGateway.getRaceDataHtml(
                placeEntity.placeData.raceType,
                placeEntity.placeData.dateTime,
                placeEntity.placeData.location,
            );
            const raceEntityList: RaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            const raceTable = $('section.raceTable');
            const trs = raceTable.find('tr.data');

            for (const tr of trs) {
                try {
                    const tds = $(tr).find('td');
                    const distance = extractDistance(
                        [...tds].map((td) => $(td).text()),
                    );
                    if (distance <= 0) {
                        continue;
                    }
                    const raceName = extractRaceName(
                        [...tds].map((td) => $(td).text()),
                    );
                    const grade = extractGrade(
                        placeEntity.placeData.raceType,
                        [...tds].map((td) => $(td).text()),
                    );
                    const surfaceType = extractSurfaceType(
                        [...tds].map((td) => $(td).text()),
                    );
                    const raceNumber = extractRaceNumber(
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
                    const raceDateTime = extractRaceDateTime(
                        [...tds].map((td) => $(td).text()),
                        placeEntity.placeData.dateTime,
                    );
                    let processedRaceName = processNarRaceName({
                        name: raceName,
                        place: placeEntity.placeData.location,
                        date: raceDate,
                        surfaceType,
                        distance,
                        grade,
                    });
                    // もしprocessedRaceNameが空文字列の場合は元のraceNameを使用する
                    if (processedRaceName === '') {
                        processedRaceName = raceName;
                    }
                    raceEntityList.push(
                        RaceEntity.createWithoutId(
                            RaceData.create(
                                placeEntity.placeData.raceType,
                                processedRaceName,
                                raceDateTime,
                                placeEntity.placeData.location,
                                grade,
                                raceNumber,
                            ),
                            undefined, // heldDayData は未指定
                            HorseRaceConditionData.create(
                                surfaceType,
                                distance,
                            ),
                            undefined, // stage は未指定
                            undefined, // racePlayerDataList は未指定
                        ),
                    );
                } catch (error) {
                    console.error('レースデータの取得に失敗しました', error);
                }
            }
            return raceEntityList;
        } catch (error) {
            console.error('HTMLの取得に失敗しました', error);
            return [];
        }
    }

    @Logger
    private async fetchRaceListFromHtmlForKeirin(
        placeEntity: PlaceEntity,
    ): Promise<RaceEntity[]> {
        function extractRaceName(
            raceSummaryInfoChild: string,
            raceStage: string,
        ): string {
            // raceNameに競輪祭が含まれている場合かつ
            // raceStageにガールズが含まれている場合、
            // raceNameを「競輪祭女子王座戦」にする
            if (
                raceSummaryInfoChild.includes('競輪祭') &&
                raceStage.includes('ガールズ')
            ) {
                return '競輪祭女子王座戦';
            }
            // raceNameに高松宮記念杯が含まれているかつ
            // raceStageがガールズが含まれている場合、
            // raceNameを「パールカップ」にする
            if (
                raceSummaryInfoChild.includes('高松宮記念杯') &&
                raceStage.includes('ガールズ')
            ) {
                return 'パールカップ';
            }
            // raceNameにオールスター競輪が含まれている場合かつ
            // raceStageにガールズが含まれている場合、
            // raceNameを「女子オールスター競輪」にする
            if (
                raceSummaryInfoChild.includes('オールスター競輪') &&
                raceStage.includes('ガールズ')
            ) {
                return '女子オールスター競輪';
            }
            // raceNameにサマーナイトフェスティバルが含まれている場合、
            // raceStageに「ガールズ」が含まれている場合、
            // raceNameを「ガールズケイリンフェスティバル」にする
            if (
                raceSummaryInfoChild.includes('サマーナイトフェスティバル') &&
                raceStage.includes('ガールズ')
            ) {
                return 'ガールズケイリンフェスティバル';
            }
            // raceNameにKEIRINグランプリが含まれている場合、
            // raceStageに「グランプリ」が含まれていなかったら、
            // raceNameを「寺内大吉記念杯競輪」にする
            if (
                raceSummaryInfoChild.includes('KEIRINグランプリ') &&
                !raceStage.includes('グランプリ')
            ) {
                return '寺内大吉記念杯競輪';
            }
            return raceSummaryInfoChild;
        }

        function extractRaceStage(
            raceSummaryInfoChild: string,
        ): RaceStage | null {
            for (const [pattern, stage] of Object.entries(
                StageMap(RaceType.KEIRIN),
            )) {
                if (new RegExp(pattern).test(raceSummaryInfoChild)) {
                    return stage;
                }
            }
            return null;
        }

        function extractRaceGrade(
            raceName: string,
            raceGrade: GradeType,
            raceStage: RaceStage,
            raceDate: Date,
        ): GradeType {
            // raceStageが「ヤンググランプリ」の場合、GⅡを返す
            if (raceStage === 'SA混合ヤンググランプリ') {
                return 'GⅡ';
            }
            // raceNameに女子オールスター競輪が入っている場合、2024年であればFⅡ、2025年以降であればGⅠを返す
            if (
                raceName.includes('女子オールスター競輪') &&
                raceDate.getFullYear() >= 2025
            ) {
                return 'GⅠ';
            }
            if (
                raceName.includes('女子オールスター競輪') &&
                raceDate.getFullYear() === 2024
            ) {
                return 'FⅡ';
            }
            // raceNameにサマーナイトフェスティバルが入っている場合、raceStageが「ガールズ」が含まれている場合、FⅡを返す
            if (
                raceName.includes('サマーナイトフェスティバル') &&
                raceStage.includes('ガールズ')
            ) {
                return 'FⅡ';
            }
            if (raceName.includes('ガールズケイリンフェスティバル')) {
                return 'FⅡ';
            }
            // raceNameに寺内大吉記念杯競輪が入っている場合、FⅠを返す
            if (raceName.includes('寺内大吉記念杯競輪')) {
                return 'FⅠ';
            }
            return raceGrade;
        }

        try {
            const [year, month, day] = [
                placeEntity.placeData.dateTime.getFullYear(),
                placeEntity.placeData.dateTime.getMonth() + 1,
                placeEntity.placeData.dateTime.getDate(),
            ];
            const htmlText = await this.raceDataHtmlGateway.getRaceDataHtml(
                placeEntity.placeData.raceType,
                placeEntity.placeData.dateTime,
                placeEntity.placeData.location,
            );
            const raceEntityList: RaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            // id="content"を取得
            const content = $('#content');
            const seriesRaceName = (
                content.find('h2').text().split('\n').filter(Boolean)[1] ??
                `${placeEntity.placeData.location}${placeEntity.grade}`
            )
                .replaceFromCodePoint(/[！-～]/g)
                .replaceFromCodePoint(/[０-９Ａ-Ｚａ-ｚ]/g);
            // class="section1"を取得
            const section1 = content.find('.section1');
            section1.each((_, section1Element) => {
                // class="w480px"を取得
                $(section1Element)
                    .find('.w480px')
                    .each((__, element) => {
                        // 発走時間の取得 10: 50
                        const raceTime = $(element)
                            .find('.tx_blue')
                            .next()
                            .text()
                            .trim();
                        const [hour, minute] = raceTime.split(':').map(Number);
                        // レースナンバーの取得 aタグの中にある 第11R の11
                        // 第 と R の間にある
                        const raceNumber = /第(\d+)R/.exec(
                            $(element).find('a').text(),
                        )?.[1];
                        const raceStage = extractRaceStage($(element).text());
                        const raceName = extractRaceName(
                            seriesRaceName,
                            raceStage ?? '',
                        );
                        const raceGrade = extractRaceGrade(
                            raceName,
                            placeEntity.grade,
                            raceStage ?? '',
                            new Date(year, month - 1, day),
                        );
                        const racePlayerDataList: RacePlayerData[] = [];
                        // tableを取得
                        const table = $(element).find('table');
                        // class="bg-1-pl", "bg-2-pl"..."bg-9-pl"を取得
                        Array.from({ length: 9 }, (___, i) => i + 1) // 1から9までの配列を作成
                            .map((i) => {
                                const bgClassName = `bg-${i.toString()}-pl`;
                                // class="bg-1-pl"を取得
                                const tableRow = table.find(`.${bgClassName}`);
                                // class="bg-1-pl"の中にあるtdを取得
                                // <td class="no1">1</td>のような形なので、"no${i}"の中のテキストを取得、枠番になる
                                const positionNumber = tableRow
                                    .find(`.no${i.toString()}`)
                                    .text();
                                // <td class="al-left"><a href="./PlayerDetail.do?playerCd=015480">松本秀之介</a></td>
                                // 015480が選手の登録番号なので、これを取得
                                // "./PlayerDetail.do?playerCd=015480"のような形になっているので、parseして取得
                                const playerNumber =
                                    tableRow
                                        .find('.al-left')
                                        .find('a')
                                        .attr('href')
                                        ?.split('=')[1] ?? null;
                                if (positionNumber && playerNumber !== null) {
                                    racePlayerDataList.push(
                                        RacePlayerData.create(
                                            placeEntity.placeData.raceType,
                                            Number(positionNumber),
                                            Number(playerNumber),
                                        ),
                                    );
                                }
                            });
                        const raceData =
                            raceStage === null
                                ? null
                                : RaceData.create(
                                      placeEntity.placeData.raceType,
                                      raceName,
                                      new Date(
                                          year,
                                          month - 1,
                                          day,
                                          hour,
                                          minute,
                                      ),
                                      placeEntity.placeData.location,
                                      raceGrade,
                                      Number(raceNumber),
                                  );
                        if (
                            raceData != null &&
                            racePlayerDataList.length > 0 &&
                            raceStage != null
                        ) {
                            raceEntityList.push(
                                RaceEntity.createWithoutId(
                                    raceData,
                                    undefined, // heldDayDataは未設定
                                    undefined, // conditionDataは未設定
                                    raceStage,
                                    racePlayerDataList,
                                ),
                            );
                        }
                    });
            });
            return raceEntityList;
        } catch (error) {
            console.error('HTMLの取得に失敗しました', error);
            return [];
        }
    }

    @Logger
    private async fetchRaceListFromHtmlForAutorace(
        placeEntity: PlaceEntity,
    ): Promise<RaceEntity[]> {
        const extractRaceName = (
            _raceSummaryInfoChild: string,
            _placeData: PlaceData,
            _grade: GradeType,
        ): string => {
            const raceConditions = [
                {
                    keyword: '日本選手権',
                    grade: 'SG',
                    name: '日本選手権オートレース',
                },
                {
                    keyword: 'スーパースター',
                    grade: 'SG',
                    name: 'スーパースター王座決定戦',
                },
                {
                    keyword: '全日本選抜',
                    grade: 'SG',
                    name: '全日本選抜オートレース',
                },
                {
                    keyword: 'オートレースグランプリ',
                    grade: 'SG',
                    name: 'オートレースグランプリ',
                },
                {
                    keyword: 'オールスター',
                    grade: 'SG',
                    name: 'オールスター・オートレース',
                },
                {
                    keyword: '共同通信',
                    grade: 'GⅠ',
                    name: '共同通信社杯プレミアムカップ',
                },
            ];

            for (const condition of raceConditions) {
                if (
                    _raceSummaryInfoChild.includes(condition.keyword) &&
                    _grade === condition.grade
                ) {
                    return condition.name;
                }
            }

            return `${_placeData.location}${_grade}`;
        };

        const extractRaceStage = (
            _raceSummaryInfoChild: string,
        ): RaceStage | null => {
            for (const [pattern, stage] of Object.entries(
                StageMap(RaceType.AUTORACE),
            )) {
                if (new RegExp(pattern).test(_raceSummaryInfoChild)) {
                    return stage;
                }
            }
            return null;
        };
        try {
            const [year, month, day] = [
                placeEntity.placeData.dateTime.getFullYear(),
                placeEntity.placeData.dateTime.getMonth() + 1,
                placeEntity.placeData.dateTime.getDate(),
            ];
            const htmlText = await this.raceDataHtmlGateway.getRaceDataHtml(
                placeEntity.placeData.raceType,
                placeEntity.placeData.dateTime,
                placeEntity.placeData.location,
            );
            const raceEntityList: RaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            // id="content"を取得
            const content = $('#content');
            const raceName = extractRaceName(
                content.find('h3').text(),
                placeEntity.placeData,
                placeEntity.grade,
            );
            // <div div class="section clearfix">を取得
            const section = content.find('.section');

            section.each((_, sectionElement) => {
                $(sectionElement)
                    .find('.w480px')
                    .each((__, element) => {
                        const raceTime = $(element).find('.start-time').text();
                        const [hour, minute] = raceTime
                            .replace('発走時間', '')
                            .split(':')
                            .map(Number);

                        const raceDate = new Date(
                            year,
                            month - 1,
                            day,
                            hour,
                            minute,
                        );

                        const aTag = $(element).find('.w380px').find('a');
                        const decodedATag = decodeURIComponent(aTag.text());

                        const raceNumber = /(\d+)R/.exec(decodedATag)?.[1];
                        const rowRaceStage =
                            /(\d+)R\s+(.+)\s+(\d+)m/
                                .exec(decodedATag)?.[2]
                                .replace('Ｇレース７', '')
                                .replace('グレードレース７', '') ?? '';

                        const raceStage = extractRaceStage(rowRaceStage);
                        if (raceStage === null) {
                            console.log(`notRaceStage: ${rowRaceStage}`);
                        }

                        const raceGrade = placeEntity.grade;
                        if (raceStage !== null && raceStage.trim() !== '') {
                            raceEntityList.push(
                                RaceEntity.createWithoutId(
                                    RaceData.create(
                                        placeEntity.placeData.raceType,
                                        raceName,
                                        raceDate,
                                        placeEntity.placeData.location,
                                        raceGrade,
                                        Number(raceNumber),
                                    ),
                                    undefined, // heldDayDataは未設定
                                    undefined, // conditionDataは未設定
                                    raceStage,
                                    [],
                                ),
                            );
                        }
                    });
            });
            return raceEntityList;
        } catch (error) {
            console.error('HTMLの取得に失敗しました', error);
            return [];
        }
    }

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param _commonParameter - unused
     * @param _entityList - unused
     */
    @Logger
    public async upsertRaceEntityList(
        _commonParameter: CommonParameter,
        _entityList: RaceEntity[],
    ): Promise<UpsertResult> {
        void _commonParameter;
        void _entityList;
        return { successCount: 0, failureCount: 0, failures: [] };
    }
}
