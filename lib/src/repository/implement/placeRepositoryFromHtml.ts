import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../domain/placeData';
import { IPlaceDataHtmlGateway } from '../../gateway/interface/iPlaceDataHtmlGateway';
import { GradeType } from '../../utility/data/common/gradeType';
import {
    RaceCourse,
    validateRaceCourse,
} from '../../utility/data/common/raceCourse';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
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
        // 月リストを生成
        const monthList = [...this.generateMonthList(startDate, finishDate)];

        // 各月のデータを取得して結合
        const monthPlaceEntityLists = await Promise.all(
            monthList.map(async (month) => {
                switch (raceType) {
                    case RaceType.KEIRIN: {
                        return this.fetchMonthPlaceEntityListForKeirin(
                            raceType,
                            month,
                        );
                    }
                    case RaceType.AUTORACE: {
                        return this.fetchMonthPlaceEntityListForAutorace(
                            raceType,
                            month,
                        );
                    }
                    case RaceType.NAR: {
                        return this.fetchMonthPlaceEntityListForNar(
                            raceType,
                            month,
                        );
                    }
                    case RaceType.JRA:
                    case RaceType.OVERSEAS:
                    case RaceType.BOATRACE: {
                        throw new Error(
                            `Race type ${raceType} is not supported by this repository`,
                        );
                    }
                    default: {
                        throw new Error('Unsupported race type');
                    }
                }
            }),
        );

        const placeEntityList = monthPlaceEntityLists.flat();

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
        return monthList;
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
