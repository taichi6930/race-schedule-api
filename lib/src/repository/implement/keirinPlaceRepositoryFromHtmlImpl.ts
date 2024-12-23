import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { IKeirinPlaceDataHtmlGateway } from '../../gateway/interface/iKeirinPlaceDataHtmlGateway';
import { KeirinGradeType, KeirinRaceCourse } from '../../utility/data/keirin';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

/**
 * 競輪場データリポジトリの実装
 */
@injectable()
export class KeirinPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<KeirinPlaceEntity>
{
    constructor(
        @inject('KeirinPlaceDataHtmlGateway')
        private readonly keirinPlaceDataHtmlGateway: IKeirinPlaceDataHtmlGateway,
    ) {}

    /**
     * 競輪場開催データを取得する
     *
     * このメソッドで日付の範囲を指定して競輪場開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<KeirinPlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceEntityList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<KeirinPlaceEntity>> {
        const monthList: Date[] = await this.generateMonthList(
            request.startDate,
            request.finishDate,
        );
        const placeEntityList: KeirinPlaceEntity[] = (
            await Promise.all(
                monthList.map(async (month) =>
                    this.fetchMonthPlaceEntityList(month),
                ),
            )
        ).flat();

        // startDateからfinishDateまでの中でのデータを取得
        const filteredPlaceEntityList: KeirinPlaceEntity[] =
            placeEntityList.filter(
                (placeEntity) =>
                    placeEntity.placeData.dateTime >= request.startDate &&
                    placeEntity.placeData.dateTime <= request.finishDate,
            );

        return new FetchPlaceListResponse(filteredPlaceEntityList);
    }

    /**
     * ターゲットの月リストを生成する
     *
     * startDateからfinishDateまでの月のリストを生成する
     *
     * @param startDate
     * @param finishDate
     * @returns
     */
    @Logger
    private generateMonthList(
        startDate: Date,
        finishDate: Date,
    ): Promise<Date[]> {
        console.log('startDate', startDate);
        console.log('finishDate', finishDate);
        const monthList: Date[] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1,
            );
            monthList.push(date);

            // 次の月の1日を取得
            currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1,
            );
        }
        console.log(
            `月リストを生成しました: ${monthList.map((month) => formatDate(month, 'yyyy-MM-dd')).join(', ')}`,
        );
        return Promise.resolve(monthList);
    }

    /**
     * S3から競輪場開催データを取得する
     *
     * ファイル名を利用してS3から競輪場開催データを取得する
     * placeEntityが存在しない場合はundefinedを返すので、filterで除外する
     *
     * @param date
     * @returns
     */
    @Logger
    private async fetchMonthPlaceEntityList(
        date: Date,
    ): Promise<KeirinPlaceEntity[]> {
        const keirinPlaceEntityList: KeirinPlaceEntity[] = [];
        console.log(`HTMLから${formatDate(date, 'yyyy-MM')}を取得します`);
        // レース情報を取得
        const htmlText: string =
            await this.keirinPlaceDataHtmlGateway.getPlaceDataHtml(date);

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

                // thのテキストが KeirinRaceCourseに含まれているか
                if (!(th.text() as KeirinRaceCourse)) {
                    return;
                }
                const place: KeirinRaceCourse = th.text() as KeirinRaceCourse;

                const tds = $(element).find('td');
                tds.each((index: number, element: cheerio.Element) => {
                    const imgs = $(element).find('img');
                    let grade: KeirinGradeType | undefined;
                    imgs.each((_, img) => {
                        const alt = $(img).attr('alt');
                        if (
                            alt !== null &&
                            alt !== undefined &&
                            alt.trim() !== ''
                        ) {
                            grade = alt
                                .replace('1', 'Ⅰ')
                                .replace('2', 'Ⅱ')
                                .replace('3', 'Ⅲ') as KeirinGradeType;
                        }
                    });

                    // alt属性を出力
                    if (grade) {
                        keirinPlaceEntityList.push(
                            new KeirinPlaceEntity(
                                null,
                                new KeirinPlaceData(
                                    new Date(
                                        date.getFullYear(),
                                        date.getMonth(),
                                        index + 1,
                                    ),
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
        console.log('keirinPlaceEntityList:', keirinPlaceEntityList);
        return keirinPlaceEntityList;
    }

    /**
     * 競輪場開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceEntityList(
        request: RegisterPlaceListRequest<KeirinPlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
