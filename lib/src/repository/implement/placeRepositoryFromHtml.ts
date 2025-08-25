import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { HeldDayData } from '../../domain/heldDayData';
import { PlaceData } from '../../domain/placeData';
import { IPlaceDataHtmlGateway } from '../../gateway/interface/iPlaceDataHtmlGateway';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { GradeType } from '../../utility/validateAndType/gradeType';
import {
    RaceCourse,
    validateRaceCourse,
} from '../../utility/validateAndType/raceCourse';
import { PlaceEntity } from '../entity/placeEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * 開催場データリポジトリの実装
 */
@injectable()
export class PlaceRepositoryFromHtml implements IPlaceRepository {
    public constructor(
        @inject('PlaceDataHtmlGateway')
        private readonly placeDataHtmlGateway: IPlaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<PlaceEntity[]> {
        const { startDate, finishDate, raceType } = searchFilter;
        // リストを生成
        const periodList = this.generatePeriodList(
            raceType,
            startDate,
            finishDate,
        );

        // 各月のデータを取得して結合
        const periodPlaceEntityLists = await Promise.all(
            periodList.map(async (period) => {
                switch (raceType) {
                    case RaceType.JRA: {
                        return this.fetchYearPlaceEntityListForJra(
                            raceType,
                            period,
                        );
                    }
                    case RaceType.NAR: {
                        return this.fetchMonthPlaceEntityListForNar(
                            raceType,
                            period,
                        );
                    }

                    case RaceType.OVERSEAS: {
                        throw new Error(
                            `Race type ${raceType} is not supported by this repository`,
                        );
                    }
                    case RaceType.KEIRIN: {
                        return this.fetchMonthPlaceEntityListForKeirin(
                            raceType,
                            period,
                        );
                    }
                    case RaceType.AUTORACE: {
                        return this.fetchMonthPlaceEntityListForAutorace(
                            raceType,
                            period,
                        );
                    }
                    case RaceType.BOATRACE: {
                        return this.fetchQuarterPlaceEntityListForBoatrace(
                            raceType,
                            period,
                        );
                    }
                }
            }),
        );

        const placeEntityList = periodPlaceEntityLists.flat();

        // 日付でフィルタリング
        return placeEntityList.filter(
            (placeEntity) =>
                placeEntity.placeData.dateTime >= startDate &&
                placeEntity.placeData.dateTime <= finishDate,
        );
    }

    /**
     * ターゲットの月リストを生成する
     *startDateからfinishDateまでの月のリストを生成する
     * @param raceType
     * @param startDate
     * @param finishDate
     */
    private generatePeriodList(
        raceType: RaceType,
        startDate: Date,
        finishDate: Date,
    ): Date[] {
        const periodType =
            raceType === RaceType.JRA
                ? 'year'
                : raceType === RaceType.BOATRACE
                  ? 'quarter'
                  : 'month';

        const periodList: Date[] = [];

        if (periodType === 'quarter') {
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
                periodList.push(new Date(currentDate));
            }

            return periodList;
        }

        const currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            switch (periodType) {
                case 'month': {
                    periodList.push(
                        new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            1,
                        ),
                    );
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    continue;
                }
                case 'year': {
                    periodList.push(new Date(currentDate.getFullYear(), 0, 1));
                    currentDate.setFullYear(currentDate.getFullYear() + 1);
                    continue;
                }
            }
        }
        return periodList;
    }

    /**
     * S3から開催データを取得する
     * ファイル名を利用してS3から開催データを取得する
     * placeDataが存在しない場合はundefinedを返すので、filterで除外する
     * @param raceType - レース種別
     * @param date
     */
    @Logger
    private async fetchYearPlaceEntityListForJra(
        raceType: RaceType,
        date: Date,
    ): Promise<PlaceEntity[]> {
        // レースHTMLを取得
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(raceType, date);

        const placeEntityList: PlaceEntity[] = [];

        // 競馬場のイニシャルと名前のマッピング
        const placeMap: Record<string, RaceCourse> = {
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
        const getPlaceName = (placeInitial: string): RaceCourse =>
            placeMap[placeInitial];

        // 開催日数を計算するためのdict
        // keyは競馬場、valueは「key: 開催回数、value: 開催日数」のdict
        const placeHeldDayTimesCountMap: Record<
            string,
            Record<string, number>
        > = {};

        // cheerioでHTMLを解析
        const $ = cheerio.load(htmlText);

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
                        const place: RaceCourse = getPlaceName(placeInitial);
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

                        placeEntityList.push(
                            PlaceEntity.createWithoutId(
                                PlaceData.create(
                                    raceType,
                                    new Date(
                                        date.getFullYear(),
                                        month - 1,
                                        day,
                                    ),
                                    place,
                                ),
                                HeldDayData.create(heldTimes, heldDayTimes),
                                undefined, // grade は中央競馬では不要
                                getJSTDate(new Date()),
                            ),
                        );
                    });
            }
        }
        return placeEntityList;
    }

    /**
     * S3から開催データを取得する
     * ファイル名を利用してS3から開催データを取得する
     * placeDataが存在しない場合はundefinedを返すので、filterで除外する
     * @param raceType - レース種別
     * @param date - 取得対象の月（Dateオブジェクトの年月部分のみ使用）
     */
    @Logger
    private async fetchMonthPlaceEntityListForNar(
        raceType: RaceType,
        date: Date,
    ): Promise<PlaceEntity[]> {
        // レース情報を取得
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(raceType, date);

        const $ = cheerio.load(htmlText);
        // <div class="chartWrapprer">を取得
        const chartWrapprer = $('.chartWrapprer');
        // <div class="chartWrapprer">内のテーブルを取得
        const table = chartWrapprer.find('table');
        // その中のtbodyを取得
        const tbody = table.find('tbody');
        // tbody内のtrたちを取得
        // 1行目のtrはヘッダーとして取得
        // 2行目のtrは曜日
        // ３行目のtr以降はレース情報
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

        const placeDataList: PlaceEntity[] = [];
        for (const [place, raceDays] of Object.entries(placeDataDict)) {
            for (const raceDay of raceDays) {
                placeDataList.push(
                    PlaceEntity.createWithoutId(
                        PlaceData.create(
                            raceType,
                            new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                raceDay,
                            ),
                            place,
                        ),
                        undefined, // heldDayData は地方競馬では不要
                        undefined, // grade は地方競馬では不要
                        getJSTDate(new Date()),
                    ),
                );
            }
        }
        return placeDataList;
    }

    /**
     * S3から開催データを取得する
     * ファイル名を利用してS3から開催データを取得する
     * placeEntityが存在しない場合はundefinedを返すので、filterで除外する
     * @param raceType - レース種別
     * @param date
     */
    @Logger
    private async fetchMonthPlaceEntityListForKeirin(
        raceType: RaceType,
        date: Date,
    ): Promise<PlaceEntity[]> {
        const placeEntityList: PlaceEntity[] = [];
        // レース情報を取得
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(raceType, date);

        const $ = cheerio.load(htmlText);

        const chartWrapper = $('#content');

        // tableタグが複数あるので、全て取得
        const tables = chartWrapper.find('table');

        tables.each((_: number, element) => {
            // その中のtbodyを取得
            const tbody = $(element).find('tbody');
            // tr class="ref_sche"を取得
            const trs = tbody.find('tr');
            trs.each((__: number, trElement) => {
                try {
                    // thを取得
                    const th = $(trElement).find('th');

                    // thのテキストが RaceCourseに含まれているか
                    if (!th.text()) {
                        return;
                    }
                    const place: RaceCourse = validateRaceCourse(
                        raceType,
                        th.text(),
                    );

                    const tds = $(trElement).find('td');
                    tds.each((index: number, tdElement) => {
                        const imgs = $(tdElement).find('img');
                        let grade: GradeType | undefined;
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
                        // alt属性を出力
                        if (grade) {
                            placeEntityList.push(
                                PlaceEntity.createWithoutId(
                                    PlaceData.create(raceType, datetime, place),
                                    undefined,
                                    grade,
                                    getJSTDate(new Date()),
                                ),
                            );
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
     * S3から開催データを取得する
     * ファイル名を利用してS3から開催データを取得する
     * placeEntityが存在しない場合はundefinedを返すので、filterで除外する
     * @param raceType - レース種別
     * @param date
     */
    @Logger
    private async fetchMonthPlaceEntityListForAutorace(
        raceType: RaceType,
        date: Date,
    ): Promise<PlaceEntity[]> {
        const placeEntityList: PlaceEntity[] = [];
        // レース情報を取得
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(raceType, date);

        const $ = cheerio.load(htmlText);

        const chartWrapprer = $('#content');

        // tableタグが複数あるので、全て取得
        const tables = chartWrapprer.find('table');

        tables.each((_: number, element) => {
            // その中のtbodyを取得
            const tbody = $(element).find('tbody');
            // tr class="ref_sche"を取得
            tbody.find('tr').each((__: number, trElement) => {
                // thを取得
                const th = $(trElement).find('th');

                // thのテキストが RaceCourseに含まれているか
                if (!th.text()) {
                    return;
                }

                // 川口２を川口に変換して、placeに代入
                // TODO: どこかのタイミングで処理をリファクタリングする
                const place: RaceCourse = th.text().replace('２', '');

                const tds = $(trElement).find('td');
                // <td valign="top" class="bg-4-lt">
                //   <img src="/ud_shared/pc/autorace/autorace/shared/images/ico-night3.gif?20221013111450" width = "10" height = "10" alt = "ico" class="time_ref" >
                //   <div class="ico-kaisai">開催</div>
                // </td>
                tds.each((index: number, tdElement) => {
                    const div = $(tdElement).find('div');
                    let grade: GradeType | undefined;
                    // divのclassを取得
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
                    // alt属性を出力
                    if (grade) {
                        placeEntityList.push(
                            PlaceEntity.createWithoutId(
                                PlaceData.create(raceType, datetime, place),
                                undefined,
                                grade,
                                getJSTDate(new Date()),
                            ),
                        );
                    }
                });
            });
        });
        return placeEntityList;
    }

    /**
     * S3から開催データを取得する
     * ファイル名を利用してS3から開催データを取得する
     * placeEntityが存在しない場合はundefinedを返すので、filterで除外する
     * @param raceType - レース種別
     * @param date
     */
    @Logger
    private async fetchQuarterPlaceEntityListForBoatrace(
        raceType: RaceType,
        date: Date,
    ): Promise<PlaceEntity[]> {
        const placeEntityList: PlaceEntity[] = [];
        // レース情報を取得
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(raceType, date);

        const $ = cheerio.load(htmlText);

        // id="r_list"を取得
        const rList = $('#r_list');

        // rListの中の、tr class="br-tableSchedule__row"を取得（複数ある）
        const trs = rList.find('tr.br-tableSchedule__row');
        trs.each((_: number, element) => {
            // 日付を取得
            const dateText = $(element)
                .find('td.br-tableSchedule__data')
                .eq(0)
                .text()
                .trim();
            // 最初の日と最後の日を取得
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

            // class="br-label"を取得
            const grade = $(element).find('.br-label').text().trim();

            // ボートレース場の名前を取得
            const place = $(element)
                .find('td.br-tableSchedule__data')
                .eq(2)
                .text()
                .trim()
                .replace(/\s+/g, '');

            // startDateからfinishDateまでfor文で回す
            // finishDateの1日後まで回す
            for (
                let currentDate = new Date(startDate);
                currentDate <= finishDate;
                currentDate.setDate(currentDate.getDate() + 1)
            ) {
                const placeEntity = PlaceEntity.createWithoutId(
                    PlaceData.create(raceType, new Date(currentDate), place),
                    undefined,
                    grade,
                    getJSTDate(new Date()),
                );
                placeEntityList.push(placeEntity);
            }
        });
        return placeEntityList;
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param raceType - レース種別
     * @param placeEntityList
     */
    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: PlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: PlaceEntity[];
        failureData: PlaceEntity[];
    }> {
        console.debug(raceType, placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        return {
            code: 500,
            message: 'HTMLにはデータを登録出来ません',
            successData: [],
            failureData: placeEntityList,
        };
    }
}
