import 'reflect-metadata';

import console from 'node:console';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

/* eslint-disable @typescript-eslint/prefer-destructuring */
import { IPlaceDataHtmlGateway } from '../../../packages/scraping/src/gateway/interface/iPlaceDataHtmlGateway';
import { RaceType } from '../../../packages/shared/src/types/raceType';
import { Logger } from '../../../packages/shared/src/utilities/logger';
import { RaceCourse } from '../../../packages/shared/src/utilities/raceCourse';
import { UpsertResult } from '../../../packages/shared/src/utilities/upsertResult';
import { HeldDayData } from '../../domain/heldDayData';
import { PlaceData } from '../../domain/placeData';
import { OldEnvStore } from '../../utility/oldEnvStore';
import { isIncludedRaceType } from '../../utility/raceType';
import { OldSearchPlaceFilterEntity } from '../entity/filter/oldSearchPlaceFilterEntity';
import { OldPlaceEntity } from '../entity/placeEntity';
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
        searchFilter: OldSearchPlaceFilterEntity,
    ): Promise<OldPlaceEntity[]> {
        const { raceTypeList, startDate, finishDate } = searchFilter;

        // 各月のデータを取得して結合
        const periodPlaceEntityLists: OldPlaceEntity[][] = [];
        for (const raceType of raceTypeList) {
            // リストを生成
            const periodList = this.generatePeriodList(
                raceType,
                startDate,
                finishDate,
            );

            for (const period of periodList) {
                let placeEntityList: OldPlaceEntity[] = [];
                switch (raceType) {
                    case RaceType.JRA: {
                        placeEntityList =
                            await this.fetchYearPlaceEntityListForJra(
                                raceType,
                                period,
                            );
                        break;
                    }
                    case RaceType.NAR: {
                        placeEntityList =
                            await this.fetchMonthPlaceEntityListForNar(
                                raceType,
                                period,
                            );
                        break;
                    }
                    case RaceType.OVERSEAS: {
                        placeEntityList =
                            await this.fetchMonthPlaceEntityListForOverseas(
                                raceType,
                                period,
                            );
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
                        console.error(
                            `Race type ${raceType} is not supported by this repository`,
                        );
                        placeEntityList = [];
                        break;
                    }
                }
                // HTML_FETCH_DELAY_MSの環境変数から遅延時間を取得
                const delayedTimeMs = Number.parseInt(
                    OldEnvStore.env.HTML_FETCH_DELAY_MS || '1000',
                );
                console.debug(`待機時間: ${delayedTimeMs}ms`);
                await new Promise((resolve) =>
                    setTimeout(resolve, delayedTimeMs),
                );
                console.debug('待機時間が経ちました');
                periodPlaceEntityLists.push(placeEntityList);
            }
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
        const periodType = isIncludedRaceType(raceType, [RaceType.JRA])
            ? 'year'
            : isIncludedRaceType(raceType, [RaceType.BOATRACE])
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
     * HTMLから開催データを取得する（中央競馬）
     * @param raceType - レース種別
     * @param date - 取得対象の月（Dateオブジェクトの年月部分のみ使用）
     */
    @Logger
    private async fetchYearPlaceEntityListForJra(
        raceType: RaceType,
        date: Date,
    ): Promise<OldPlaceEntity[]> {
        // レースHTMLを取得
        const htmlText: string = await this.placeDataHtmlGateway.fetch(
            raceType,
            date,
        );

        const placeEntityList: OldPlaceEntity[] = [];

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
                            OldPlaceEntity.createWithoutId(
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
                            ),
                        );
                    });
            }
        }
        return placeEntityList;
    }

    /**
     * HTMLから開催データを取得する（地方競馬）
     * @param raceType - レース種別
     * @param date - 取得対象の月（Dateオブジェクトの年月部分のみ使用）
     */
    @Logger
    private async fetchMonthPlaceEntityListForNar(
        raceType: RaceType,
        date: Date,
    ): Promise<OldPlaceEntity[]> {
        return this.fetchMonthPlaceEntityListFromScrapingApi(
            raceType,
            date,
            false,
        );
    }

    /**
     * scraping APIからplaceデータを取得しOldPlaceEntity[]に変換（NAR/KEIRIN/AUTORACE共通）
     * @param raceType - レース種別
     * @param date - 取得対象の月
     * @param useGrade - placeGradeをgradeにセットするか
     */
    private async fetchMonthPlaceEntityListFromScrapingApi(
        raceType: RaceType,
        date: Date,
        useGrade = false,
    ): Promise<OldPlaceEntity[]> {
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const finishDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const formatYMD = (d: Date): string => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };

        const startStr = formatYMD(startDate);
        const finishStr = formatYMD(finishDate);

        const baseUrl = OldEnvStore.env.SCRAPING_BASE_URL;
        const url = `${baseUrl}/scraping/place?raceTypeList=${raceType}&startDate=${startStr}&finishDate=${finishStr}`;
        console.debug('fetching scraping API', url);

        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.error('scraping API error', res.status, url);
                return [];
            }
            const body: any = await res.json();
            const placeListFromScraping = body?.places ?? body ?? [];

            const placeEntityList: OldPlaceEntity[] = [];
            for (const placeFromScraping of placeListFromScraping) {
                try {
                    // datetime/dateTime can exist in different shapes
                    const datetimeRaw =
                        (placeFromScraping as any)?.datetime ||
                        (placeFromScraping as any)?.dateTime ||
                        (placeFromScraping as any)?.placeData?.dateTime;
                    if (!datetimeRaw) {
                        console.warn('place without datetime', placeFromScraping);
                        continue;
                    }
                    const datePart = String(datetimeRaw).split('T')[0];
                    const y = Number(datePart.slice(0, 4));
                    const m = Number(datePart.slice(5, 7));
                    const d = Number(datePart.slice(8, 10));
                    const placeDate = new Date(y, m - 1, d);

                    // place name can come from different keys
                    const placeName: string = (
                        (placeFromScraping as any)?.placeName ||
                        (placeFromScraping as any)?.placeData?.location ||
                        (placeFromScraping as any)?.placeData?.placeName ||
                        ''
                    ).trim();
                    if (!placeName) {
                        console.warn('place without name', placeFromScraping);
                        continue;
                    }

                    // held day info may be provided under several keys
                    const heldRaw =
                        (placeFromScraping as any)?.placeHeldDays ||
                        (placeFromScraping as any)?._heldDayData ||
                        (placeFromScraping as any)?.placeData?.placeHeldDays ||
                        (placeFromScraping as any)?.placeData?._heldDayData ||
                        undefined;
                    let heldDayDataArg = undefined as undefined | HeldDayData;
                    if (heldRaw && typeof heldRaw === 'object') {
                        const heldTimes = Number(heldRaw.heldTimes ?? heldRaw.held_times ?? heldRaw.held_times_count ?? heldRaw.heldTimesCount ?? undefined);
                        const heldDayTimes = Number(heldRaw.heldDayTimes ?? heldRaw.held_day_times ?? heldRaw.heldDayTimesCount ?? heldRaw.heldDayTimesCount ?? undefined);
                        if (!Number.isNaN(heldTimes) && !Number.isNaN(heldDayTimes)) {
                            try {
                                heldDayDataArg = HeldDayData.create(heldTimes, heldDayTimes);
                            } catch (e) {
                                console.warn('invalid heldDayData from scraping', heldRaw, e);
                                heldDayDataArg = undefined;
                            }
                        }
                    }

                    const placeData = PlaceData.create(raceType, placeDate, placeName);
                    placeEntityList.push(
                        OldPlaceEntity.createWithoutId(
                            placeData,
                            heldDayDataArg,
                            useGrade ? (placeFromScraping as any)?.placeGrade : undefined,
                        ),
                    );
                } catch (error) {
                    console.error(
                        `failed to map scraping place (${raceType})`,
                        placeFromScraping,
                        error,
                    );
                }
            }
            return placeEntityList;
        } catch (error) {
            console.error(`failed to fetch scraping API (${raceType})`, error);
            return [];
        }
    }

    /**
     * HTMLから開催データを取得する（海外競馬）
     * @param raceType - レース種別
     * @param date - 取得対象の月（Dateオブジェクトの年月部分のみ使用）
     */
    @Logger
    private async fetchMonthPlaceEntityListForOverseas(
        raceType: RaceType,
        date: Date,
    ): Promise<OldPlaceEntity[]> {
        return [
            OldPlaceEntity.createWithoutId(
                PlaceData.create(
                    raceType,
                    // 月の初日を設定
                    new Date(date.getFullYear(), date.getMonth(), 1),
                    'ロンシャン', // TODO: 適切な開催地を設定する
                ),
                undefined, // heldDayData は海外競馬では不要
                undefined, // grade は海外競馬では不要
            ),
        ];
    }

    /**
     * HTMLから開催データを取得する（競輪）
     * @param raceType - レース種別
     * @param date
     */
    @Logger
    private async fetchMonthPlaceEntityListForKeirin(
        raceType: RaceType,
        date: Date,
    ): Promise<OldPlaceEntity[]> {
        return this.fetchMonthPlaceEntityListFromScrapingApi(
            raceType,
            date,
            true,
        );
    }

    /**
     * HTMLから開催データを取得する（オートレース）
     * @param raceType - レース種別
     * @param date
     */
    @Logger
    private async fetchMonthPlaceEntityListForAutorace(
        raceType: RaceType,
        date: Date,
    ): Promise<OldPlaceEntity[]> {
        return this.fetchMonthPlaceEntityListFromScrapingApi(
            raceType,
            date,
            true,
        );
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     */
    @Logger
    public async upsertPlaceEntityList(
        _placeEntityList: OldPlaceEntity[],
    ): Promise<UpsertResult> {
        void _placeEntityList;
        return {
            successCount: 0,
            failureCount: 0,
            failures: [],
        };
    }
}
