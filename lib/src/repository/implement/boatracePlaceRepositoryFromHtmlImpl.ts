import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { IBoatracePlaceDataHtmlGateway } from '../../gateway/interface/iBoatracePlaceDataHtmlGateway';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * ボートレース場データリポジトリの実装
 */
@injectable()
export class BoatracePlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<BoatracePlaceEntity>
{
    constructor(
        @inject('BoatracePlaceDataHtmlGateway')
        private readonly placeDataHtmlGateway: IBoatracePlaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     *
     * このメソッドで日付の範囲を指定して開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<BoatracePlaceEntity[]> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<BoatracePlaceEntity[]> {
        const quarters: Record<string, Date> = await this.generateQuarterList(
            searchFilter.startDate,
            searchFilter.finishDate,
        );

        // quartersの月リストを取得
        const placeEntityList: BoatracePlaceEntity[] = (
            await Promise.all(
                Object.entries(quarters).map(async ([quarter, quarterDate]) =>
                    this.fetchMonthPlaceEntityList(quarter, quarterDate),
                ),
            )
        ).flat();

        // startDateからfinishDateまでの中でのデータを取得
        const filteredPlaceEntityList: BoatracePlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= searchFilter.startDate &&
                    placeEntity.placeData.dateTime <= searchFilter.finishDate,
            );

        return filteredPlaceEntityList;
    }

    /**
     * ターゲットの月リストを生成する
     *
     * startDateからfinishDateまでの月のリストを生成する
     *
     * @param startDate
     * @param finishDate
     */
    @Logger
    private generateQuarterList(
        startDate: Date,
        finishDate: Date,
    ): Promise<Record<string, Date>> {
        const quarterList: Record<string, Date> = {};

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
            const quarter = `${currentDate.getFullYear().toString()}${(Math.floor(currentDate.getMonth() / 3) + 1).toString()}`;
            quarterList[quarter] = new Date(currentDate);
        }

        return Promise.resolve(quarterList);
    }

    /**
     * S3から開催データを取得する
     *
     * ファイル名を利用してS3から開催データを取得する
     * placeEntityが存在しない場合はundefinedを返すので、filterで除外する
     *
     * @param date
     */
    @Logger
    private async fetchMonthPlaceEntityList(
        quarterString: string,
        date: Date,
    ): Promise<BoatracePlaceEntity[]> {
        const boatracePlaceEntityList: BoatracePlaceEntity[] = [];
        console.log(
            `HTMLから${quarterString} ${formatDate(date, 'yyyy-MM')}を取得します`,
        );
        // レース情報を取得
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(quarterString);

        const $ = cheerio.load(htmlText);

        // id="r_list"を取得
        const rList = $('#r_list');

        // rListの中の、tr class="br-tableSchedule__row"を取得（複数ある）
        const trs = rList.find('tr.br-tableSchedule__row');
        trs.each((index: number, element: cheerio.Element) => {
            // 日付を取得
            const dateText = $(element)
                .find('td.br-tableSchedule__data')
                .eq(0)
                .text()
                .trim();
            // 最初の日と最後の日を取得
            const startDateString: string = dateText.split('～')[0];
            const finishDateString = dateText.split('～')[1];
            const startDate = new Date(
                date.getFullYear(),
                parseInt(startDateString.split('/')[0]) - 1,
                parseInt(startDateString.split('/')[1].split('(')[0]),
            );

            const finishDate = new Date(
                date.getFullYear(),
                parseInt(finishDateString.split('/')[0]) - 1,
                parseInt(finishDateString.split('/')[1].split('(')[0]),
            );

            // class="br-label"を取得
            const grade = $(element).find('.br-label').text().trim();

            // ボートレース場の名前を取得
            const place = $(element)
                .find('td.br-tableSchedule__data')
                .eq(2)
                .text()
                .trim()
                // eslint-disable-next-line no-irregular-whitespace
                .replace(/[\s　]+/g, '');

            // startDateからfinishDateまでfor文で回す
            // finishDateの1日後まで回す
            for (
                let currentDate = new Date(startDate);
                currentDate <= finishDate;
                currentDate.setDate(currentDate.getDate() + 1)
            ) {
                const boatracePlaceEntity = BoatracePlaceEntity.createWithoutId(
                    BoatracePlaceData.create(
                        new Date(currentDate),
                        place,
                        grade,
                    ),
                    getJSTDate(new Date()),
                );
                boatracePlaceEntityList.push(boatracePlaceEntity);
            }
        });
        return boatracePlaceEntityList;
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceEntityList(
        placeEntityList: BoatracePlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
