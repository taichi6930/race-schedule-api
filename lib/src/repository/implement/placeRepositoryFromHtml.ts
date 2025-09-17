import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../../../src/domain/placeData';
import { PlaceEntity } from '../../../../src/repository/entity/placeEntity';
import { RaceType } from '../../../../src/utility/raceType';
import { GradeType } from '../../../../src/utility/validateAndType/gradeType';
import {
    RaceCourse,
    validateRaceCourse,
} from '../../../../src/utility/validateAndType/raceCourse';
import { IPlaceDataHtmlGatewayForAWS } from '../../gateway/interface/iPlaceDataHtmlGateway';
import { Logger } from '../../utility/logger';
import { SearchPlaceFilterEntityForAWS } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepositoryForAWS } from '../interface/IPlaceRepositoryForAWS';

/**
 * 開催場データリポジトリの実装
 */
@injectable()
export class PlaceRepositoryFromHtmlForAWS implements IPlaceRepositoryForAWS {
    public constructor(
        @inject('PlaceDataHtmlGateway')
        private readonly placeDataHtmlGateway: IPlaceDataHtmlGatewayForAWS,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntityForAWS,
    ): Promise<PlaceEntity[]> {
        const { startDate, finishDate, raceType } = searchFilter;
        // リストを生成
        const periodList = this.generatePeriodList(
            raceType,
            startDate,
            finishDate,
        );

        // 各月のデータを取得して結合
        const periodPlaceEntityLists: PlaceEntity[][] = [];
        for (const period of periodList) {
            let placeEntityList: PlaceEntity[];
            switch (raceType) {
                case RaceType.JRA:
                case RaceType.NAR:
                case RaceType.OVERSEAS: {
                    console.error(
                        `Race type ${raceType} is not supported by this repository`,
                    );
                    placeEntityList = [];
                    break;
                }
                case RaceType.KEIRIN: {
                    placeEntityList =
                        await this.fetchMonthPlaceEntityListForKeirin(
                            raceType,
                            period,
                        );
                    break;
                }
                case RaceType.AUTORACE: {
                    placeEntityList =
                        await this.fetchMonthPlaceEntityListForAutorace(
                            raceType,
                            period,
                        );
                    break;
                }
                case RaceType.BOATRACE: {
                    placeEntityList =
                        await this.fetchQuarterPlaceEntityListForBoatrace(
                            raceType,
                            period,
                        );
                    break;
                }
            }
            // HTML_FETCH_DELAY_MSの環境変数から遅延時間を取得
            const delayedTimeMs = Number.parseInt(
                process.env.HTML_FETCH_DELAY_MS ?? '500',
                10,
            );
            console.debug(`待機時間: ${delayedTimeMs}ms`);
            await new Promise((resolve) => setTimeout(resolve, delayedTimeMs));
            console.debug('待機時間が経ちました');
            periodPlaceEntityLists.push(placeEntityList);
        }

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
    public async upsertPlaceEntityList(
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
