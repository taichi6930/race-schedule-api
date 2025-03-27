import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { NarPlaceData } from '../../domain/narPlaceData';
import { INarPlaceDataHtmlGateway } from '../../gateway/interface/iNarPlaceDataHtmlGateway';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { NarPlaceEntity } from '../entity/narPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * Narデータリポジトリの実装
 */
@injectable()
export class NarPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<NarPlaceEntity>
{
    public constructor(
        @inject('NarPlaceDataHtmlGateway')
        private readonly placeDataHtmlGateway: INarPlaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<NarPlaceEntity[]> {
        const monthList: Date[] = this.generateMonthList(
            searchFilter.startDate,
            searchFilter.finishDate,
        );
        const monthPlaceEntityLists = await Promise.all(
            monthList.map(async (month) =>
                this.fetchMonthPlaceEntityList(month),
            ),
        );
        const placeEntityList: NarPlaceEntity[] = monthPlaceEntityLists.flat();

        // startDateからfinishDateまでの中でのデータを取得
        const filteredPlaceEntityList: NarPlaceEntity[] =
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
     * @param date
     */
    @Logger
    private async fetchMonthPlaceEntityList(
        date: Date,
    ): Promise<NarPlaceEntity[]> {
        console.log(`S3から${formatDate(date, 'yyyy-MM')}を取得します`);
        // レース情報を取得
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(date);

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
        const narPlaceDataDict: Record<string, number[]> = {};

        trs.each((index: number, element: cheerio.Element) => {
            if (index < 2) {
                return;
            }
            const tds = $(element).find('td');
            const place = $(tds[0]).text();
            tds.each((index: number, element: cheerio.Element) => {
                if (index === 0) {
                    if (!(place in narPlaceDataDict)) {
                        narPlaceDataDict[place] = [];
                    }
                    return;
                }
                if (
                    $(element).text().includes('●') ||
                    $(element).text().includes('☆') ||
                    $(element).text().includes('Ｄ')
                ) {
                    narPlaceDataDict[place].push(index);
                }
            });
        });

        const narPlaceDataList: NarPlaceEntity[] = [];
        for (const [place, raceDays] of Object.entries(narPlaceDataDict)) {
            for (const raceDay of raceDays) {
                narPlaceDataList.push(
                    NarPlaceEntity.createWithoutId(
                        NarPlaceData.create(
                            new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                raceDay,
                            ),
                            place,
                        ),
                        getJSTDate(new Date()),
                    ),
                );
            }
        }
        return narPlaceDataList;
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param placeEntityList
     */
    @Logger
    public async registerPlaceEntityList(
        placeEntityList: NarPlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
