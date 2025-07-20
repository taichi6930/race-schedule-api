import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { IJraPlaceDataHtmlGateway } from '../../gateway/interface/iJraPlaceDataHtmlGateway';
import { JraPlaceRecord } from '../../gateway/record/jraPlaceRecord';
import { JraRaceCourse } from '../../utility/data/jra/jraRaceCourse';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { generateJraPlaceId } from '../../utility/raceId';
import { JraPlaceEntity } from '../entity/jraPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

@injectable()
export class JraPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<JraPlaceEntity>
{
    public constructor(
        @inject('JraPlaceDataHtmlGateway')
        private readonly placeDataHtmlGateway: IJraPlaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<JraPlaceEntity[]> {
        // startDateからfinishDateまでの年のリストを生成する
        const yearList: Date[] = this.generateYearList(
            searchFilter.startDate,
            searchFilter.finishDate,
        );

        // 年ごとの開催データを取得
        const placeRecordPromises = yearList.map(async (year) =>
            this.fetchYearPlaceRecordList(year),
        );
        const placeRecordResults = await Promise.all(placeRecordPromises);
        const placeRecordList: JraPlaceRecord[] = placeRecordResults.flat();

        // Entityに変換
        const placeEntityList: JraPlaceEntity[] = placeRecordList.map(
            (placeRecord) => placeRecord.toEntity(),
        );

        // filterで日付の範囲を指定
        const filteredPlaceEntityList: JraPlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= searchFilter.startDate &&
                    placeEntity.placeData.dateTime <= searchFilter.finishDate,
            );

        return filteredPlaceEntityList;
    }

    /**
     * ターゲットの年リストを生成する
     *startDateからfinishDateまでの年のリストを生成する
     * @param startDate
     * @param finishDate
     */
    private generateYearList(startDate: Date, finishDate: Date): Date[] {
        const yearList: Date[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            yearList.push(new Date(currentDate.getFullYear(), 0, 1));
            currentDate.setFullYear(currentDate.getFullYear() + 1);
        }

        console.debug(
            `年リストを生成しました: ${yearList.map((year) => year.toISOString().split('T')[0]).join(', ')}`,
        );
        return yearList;
    }

    /**
     * S3から開催データを取得する
     * ファイル名を利用してS3から開催データを取得する
     * placeDataが存在しない場合はundefinedを返すので、filterで除外する
     * @param date
     */
    @Logger
    private async fetchYearPlaceRecordList(
        date: Date,
    ): Promise<JraPlaceRecord[]> {
        // レースHTMLを取得
        const htmlText: string =
            await this.placeDataHtmlGateway.getPlaceDataHtml(date);

        // 競馬場開催レコードはここに追加
        const jraPlaceRecordList: JraPlaceRecord[] = [];

        // 競馬場のイニシャルと名前のマッピング
        const placeMap: Record<string, JraRaceCourse> = {
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
        const getPlaceName = (placeInitial: string): JraRaceCourse =>
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
                        const place: JraRaceCourse = getPlaceName(placeInitial);
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

                        // 競馬場開催レコードを追加
                        jraPlaceRecordList.push(
                            JraPlaceRecord.create(
                                generateJraPlaceId(
                                    new Date(
                                        date.getFullYear(),
                                        month - 1,
                                        day,
                                    ),
                                    place,
                                ),
                                new Date(date.getFullYear(), month - 1, day),
                                getPlaceName(placeInitial),
                                heldTimes,
                                heldDayTimes,
                                getJSTDate(new Date()),
                            ),
                        );
                    });
            }
        }
        return jraPlaceRecordList;
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param placeEntityList
     */
    @Logger
    public async registerPlaceEntityList(
        placeEntityList: JraPlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
