import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { IAutoracePlaceDataHtmlGateway } from '../../gateway/interface/iAutoracePlaceDataHtmlGateway';
import { AutoraceGradeType } from '../../utility/data/autorace/autoraceGradeType';
import { AutoraceRaceCourse } from '../../utility/data/autorace/autoraceRaceCourse';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * オートレースデータリポジトリの実装
 */
@injectable()
export class AutoracePlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<AutoracePlaceEntity>
{
    constructor(
        @inject('AutoracePlaceDataHtmlGateway')
        private readonly placeDataHtmlGateway: IAutoracePlaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter - 開催データ取得フィルタ
     */
    @Logger
    async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<AutoracePlaceEntity[]> {
        const monthList: Date[] = await this.generateMonthList(
            searchFilter.startDate,
            searchFilter.finishDate,
        );
        const placeEntityList: AutoracePlaceEntity[] = (
            await Promise.all(
                monthList.map(async (month) =>
                    this.fetchMonthPlaceEntityList(month),
                ),
            )
        ).flat();

        // startDateからfinishDateまでの中でのデータを取得
        const filteredPlaceEntityList: AutoracePlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= searchFilter.startDate &&
                    placeEntity.placeData.dateTime <= searchFilter.finishDate,
            );
        return filteredPlaceEntityList;
    }

    /**
     * ターゲットの月リストを生成する
     *startDateからfinishDateまでの月のリストを生成する
     * @param startDate
     * @param finishDate
     */
    @Logger
    private generateMonthList(
        startDate: Date,
        finishDate: Date,
    ): Promise<Date[]> {
        const monthList: Date[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            monthList.push(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            );
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        console.log(
            `月リストを生成しました: ${monthList.map((month) => formatDate(month, 'yyyy-MM-dd')).join(', ')}`,
        );
        return Promise.resolve(monthList);
    }

    /**
     * S3から開催データを取得する
     * ファイル名を利用してS3から開催データを取得する
     * placeEntityが存在しない場合はundefinedを返すので、filterで除外する
     * @param date
     */
    @Logger
    private async fetchMonthPlaceEntityList(
        date: Date,
    ): Promise<AutoracePlaceEntity[]> {
        const autoracePlaceEntityList: AutoracePlaceEntity[] = [];
        console.log(`HTMLから${formatDate(date, 'yyyy-MM')}を取得します`);
        // レース情報を取得
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(date);

        const $ = cheerio.load(htmlText);

        const chartWrapprer = $('#content');

        // tableタグが複数あるので、全て取得
        const tables = chartWrapprer.find('table');

        tables.each((index: number, element: cheerio.Element) => {
            // その中のtbodyを取得
            const tbody = $(element).find('tbody');
            // tr class="ref_sche"を取得
            const trs = tbody.find('tr');
            trs.each((index: number, element: cheerio.Element) => {
                // thを取得
                const th = $(element).find('th');

                // thのテキストが AutoraceRaceCourseに含まれているか
                if (!th.text()) {
                    return;
                }

                // 川口２を川口に変換して、placeに代入
                // TODO: どこかのタイミングで処理をリファクタリングする
                const place: AutoraceRaceCourse = th.text().replace('２', '');

                const tds = $(element).find('td');
                // <td valign="top" class="bg-4-lt">
                //   <img src="/ud_shared/pc/autorace/autorace/shared/images/ico-night3.gif?20221013111450" width = "10" height = "10" alt = "ico" class="time_ref" >
                //   <div class="ico-kaisai">開催</div>
                // </td>
                tds.each((index: number, element: cheerio.Element) => {
                    const div = $(element).find('div');
                    let grade: AutoraceGradeType | undefined;
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
                    }
                    const datetime = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        index + 1,
                    );
                    // alt属性を出力
                    if (grade) {
                        autoracePlaceEntityList.push(
                            AutoracePlaceEntity.createWithoutId(
                                AutoracePlaceData.create(
                                    datetime,
                                    place,
                                    grade,
                                ),
                                getJSTDate(new Date()),
                            ),
                        );
                    }
                });
            });
        });
        return autoracePlaceEntityList;
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param placeEntityList
     */
    @Logger
    registerPlaceEntityList(
        placeEntityList: AutoracePlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
