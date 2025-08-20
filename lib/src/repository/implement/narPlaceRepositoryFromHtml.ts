import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../domain/placeData';
import { IPlaceDataHtmlGateway } from '../../gateway/interface/iPlaceDataHtmlGateway';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { PlaceEntity } from '../entity/placeEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * Narデータリポジトリの実装
 */
@injectable()
export class NarPlaceRepositoryFromHtml
    implements IPlaceRepository<PlaceEntity>
{
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
        const monthList: Date[] = this.generateMonthList(
            searchFilter.startDate,
            searchFilter.finishDate,
        );
        const monthPlaceEntityLists = await Promise.all(
            monthList.map(async (month) =>
                this.fetchMonthPlaceEntityList(searchFilter.raceType, month),
            ),
        );
        const placeEntityList: PlaceEntity[] = monthPlaceEntityLists.flat();

        // startDateからfinishDateまでの中でのデータを取得
        const filteredPlaceEntityList: PlaceEntity[] = placeEntityList.filter(
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

    /**
     * S3から開催データを取得する
     * ファイル名を利用してS3から開催データを取得する
     * placeDataが存在しない場合はundefinedを返すので、filterで除外する
     * @param raceType - レース種別
     * @param date
     */
    @Logger
    private async fetchMonthPlaceEntityList(
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
