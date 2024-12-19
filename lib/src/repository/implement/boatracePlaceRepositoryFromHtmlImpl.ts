import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { IBoatracePlaceDataHtmlGateway } from '../../gateway/interface/iBoatracePlaceDataHtmlGateway';
import {
    BOATRACE_PLACE_CODE,
    BOATRACE_SPECIFIED_GRADE_LIST,
    BoatraceGradeType,
    BoatraceRaceCourse,
} from '../../utility/data/boatrace';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';
import { FetchPlaceListRequest } from '../request/fetchPlaceListRequest';
import { RegisterPlaceListRequest } from '../request/registerPlaceListRequest';
import { FetchPlaceListResponse } from '../response/fetchPlaceListResponse';
import { RegisterPlaceListResponse } from '../response/registerPlaceListResponse';

/**
 * ボートレース場データリポジトリの実装
 */
@injectable()
export class BoatracePlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<BoatracePlaceEntity>
{
    constructor(
        @inject('BoatracePlaceDataHtmlGateway')
        private readonly boatracePlaceDataHtmlGateway: IBoatracePlaceDataHtmlGateway,
    ) {}

    /**
     * ボートレース場開催データを取得する
     *
     * このメソッドで日付の範囲を指定してボートレース場開催データを取得する
     *
     * @param request - 開催データ取得リクエスト
     * @returns Promise<FetchPlaceListResponse<BoatracePlaceEntity>> - 開催データ取得レスポンス
     */
    @Logger
    async fetchPlaceEntityList(
        request: FetchPlaceListRequest,
    ): Promise<FetchPlaceListResponse<BoatracePlaceEntity>> {
        const quarters: Record<string, Date> = await this.generateQuarterList(
            request.startDate,
            request.finishDate,
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
    private generateQuarterList(
        startDate: Date,
        finishDate: Date,
    ): Promise<Record<string, Date>> {
        // 20241: 2024/1/1のようなdictを生成する
        const quarterList: Record<string, Date> = {};

        // qStartDateは、そのクオーターの月初めの日付にする
        const qStartDate = new Date(
            startDate.getFullYear(),
            Math.floor(startDate.getMonth() / 3) * 3,
            1,
        );

        // qFinishDateは、そのクオーターの月初めの日付にする
        const qFinishDate = new Date(
            finishDate.getFullYear(),
            Math.floor(finishDate.getMonth() / 3) * 3,
            1,
        );

        // qStartDateからqFinishDateまでのクオーターのリストを生成する
        const currentDate = new Date(qStartDate);
        while (currentDate <= qFinishDate) {
            const quarter = `${currentDate.getFullYear().toString()}${(
                Math.floor(currentDate.getMonth() / 3) + 1
            ).toString()}`;
            quarterList[quarter] = new Date(currentDate);
            currentDate.setMonth(currentDate.getMonth() + 3);
        }

        return Promise.resolve(quarterList);
    }

    /**
     * S3からボートレース場開催データを取得する
     *
     * ファイル名を利用してS3からボートレース場開催データを取得する
     * placeEntityが存在しない場合はundefinedを返すので、filterで除外する
     *
     * @param date
     * @returns
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
            await this.boatracePlaceDataHtmlGateway.getPlaceDataHtml(
                quarterString,
            );

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
            // 9 / 27(金)～10 / 2(水)から、最初の日と最後の日を取得
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

            //placeがBoatraceRaceCourseに含まれているか確認
            if (
                !Object.keys(BOATRACE_PLACE_CODE).includes(
                    place as BoatraceRaceCourse,
                )
            ) {
                console.log('ボートレース場が見つかりませんでした');
                return;
            }
            // gradeがBoatraceGradeTypeに含まれているか確認
            if (
                !BOATRACE_SPECIFIED_GRADE_LIST.includes(
                    grade as BoatraceGradeType,
                )
            ) {
                console.log(`グレードが見つかりませんでした:"${grade}"`);
                return;
            }

            // startDateからfinishDateまでfor文で回す
            // finishDateの1日後まで回す
            for (
                let currentDate = new Date(startDate);
                currentDate <= finishDate;
                currentDate.setDate(currentDate.getDate() + 1)
            ) {
                const boatracePlaceEntity = new BoatracePlaceEntity(
                    null,
                    new BoatracePlaceData(
                        new Date(currentDate),
                        place as BoatraceRaceCourse,
                        grade as BoatraceGradeType,
                    ),
                    getJSTDate(new Date()),
                );
                boatracePlaceEntityList.push(boatracePlaceEntity);
            }
        });
        return boatracePlaceEntityList;
    }

    /**
     * ボートレース場開催データを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerPlaceEntityList(
        request: RegisterPlaceListRequest<BoatracePlaceEntity>,
    ): Promise<RegisterPlaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
