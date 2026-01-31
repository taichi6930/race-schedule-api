import 'reflect-metadata';

import console from 'node:console';

import { injectable } from 'tsyringe';

/* eslint-disable @typescript-eslint/prefer-destructuring */
import { RaceType } from '../../../packages/shared/src/types/raceType';
import { validateGradeType } from '../../../packages/shared/src/utilities/gradeType';
import { Logger } from '../../../packages/shared/src/utilities/logger';
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
    /**
     * scraping APIを使用するレースタイプの設定を取得する
     * @returns useGradeの値、またはscraping APIを使用しない場合はnull
     */
    private getScrapingApiConfig(
        raceType: RaceType,
    ): { useGrade: boolean } | null {
        switch (raceType) {
            case RaceType.JRA:
            case RaceType.NAR: {
                return { useGrade: false };
            }
            case RaceType.KEIRIN:
            case RaceType.AUTORACE: {
                return { useGrade: true };
            }
            default: {
                return null;
            }
        }
    }

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
            // scraping APIを使用するレースタイプの場合は共通処理
            const scrapingConfig = this.getScrapingApiConfig(raceType);
            if (scrapingConfig !== null) {
                const placeEntityList =
                    await this.fetchMonthPlaceEntityListFromScrapingApi(
                        raceType,
                        startDate,
                        finishDate,
                        scrapingConfig.useGrade,
                    );
                periodPlaceEntityLists.push(placeEntityList);
                continue;
            }

            // それ以外のレースタイプは期間リストを生成して処理
            const periodList = this.generatePeriodList(
                raceType,
                startDate,
                finishDate,
            );

            for (const period of periodList) {
                let placeEntityList: OldPlaceEntity[] = [];
                switch (raceType) {
                    case RaceType.OVERSEAS: {
                        placeEntityList =
                            await this.fetchMonthPlaceEntityListForOverseas(
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
     * Format Date to YYYY-MM-DD
     */
    private formatYMD(d: Date): string {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    /**
     * Map a scraping place object to OldPlaceEntity or return null on failure
     */
    private mapScrapingPlace(
        raceType: RaceType,
        placeFromScraping: any,
        useGrade = false,
    ): OldPlaceEntity | null {
        try {
            const datetimeRaw =
                placeFromScraping?.datetime ??
                placeFromScraping?.dateTime ??
                placeFromScraping?.placeData?.dateTime;
            if (!datetimeRaw) return null;
            const datePart = String(datetimeRaw).split('T')[0];
            const y = Number(datePart.slice(0, 4));
            const m = Number(datePart.slice(5, 7));
            const d = Number(datePart.slice(8, 10));
            const placeDate = new Date(y, m - 1, d);

            const placeName: string = (
                placeFromScraping?.placeName ??
                placeFromScraping?.placeData?.location ??
                placeFromScraping?.placeData?.placeName ??
                ''
            ).trim();
            if (!placeName) return null;

            const heldRaw =
                placeFromScraping?.placeHeldDays ??
                placeFromScraping?._heldDayData ??
                placeFromScraping?.placeData?.placeHeldDays ??
                placeFromScraping?.placeData?._heldDayData ??
                undefined;
            let heldDayDataArg: HeldDayData | undefined = undefined;
            if (heldRaw && typeof heldRaw === 'object') {
                const heldTimes = Number(
                    heldRaw.heldTimes ??
                        heldRaw.held_times ??
                        heldRaw.held_times_count ??
                        heldRaw.heldTimesCount ??
                        undefined,
                );
                const heldDayTimes = Number(
                    heldRaw.heldDayTimes ??
                        heldRaw.held_day_times ??
                        heldRaw.heldDayTimesCount ??
                        heldRaw.heldDayTimesCount ??
                        undefined,
                );
                if (!Number.isNaN(heldTimes) && !Number.isNaN(heldDayTimes)) {
                    try {
                        heldDayDataArg = HeldDayData.create(
                            heldTimes,
                            heldDayTimes,
                        );
                    } catch (error) {
                        console.warn(
                            'invalid heldDayData from scraping',
                            heldRaw,
                            error,
                        );
                        heldDayDataArg = undefined;
                    }
                }
            }

            const placeData = PlaceData.create(raceType, placeDate, placeName);
            let gradeValue: any = undefined;
            if (useGrade) {
                const rawGrade =
                    placeFromScraping?.placeGrade ??
                    placeFromScraping?.placeData?.placeGrade ??
                    undefined;
                if (rawGrade) {
                    try {
                        gradeValue = validateGradeType(
                            raceType,
                            String(rawGrade),
                        );
                    } catch (error) {
                        console.warn(
                            'invalid grade from scraping',
                            rawGrade,
                            error,
                        );
                        gradeValue = undefined;
                    }
                }
            }

            return OldPlaceEntity.createWithoutId(
                placeData,
                heldDayDataArg,
                gradeValue,
            );
        } catch (error) {
            console.error(
                'failed to map scraping place',
                placeFromScraping,
                error,
            );
            return null;
        }
    }

    /**
     * scraping APIからplaceデータを取得しOldPlaceEntity[]に変換（NAR/KEIRIN/AUTORACE共通）
     * @param raceType - レース種別
     * @param date - 取得対象の月
     * @param useGrade - placeGradeをgradeにセットするか
     */
    private async fetchMonthPlaceEntityListFromScrapingApi(
        raceType: RaceType,
        _startDate: Date,
        _finishDate: Date,
        useGrade = false,
    ): Promise<OldPlaceEntity[]> {
        const startDate = new Date(
            _startDate.getFullYear(),
            _startDate.getMonth(),
            _startDate.getDate(),
        );
        const finishDate = new Date(
            _finishDate.getFullYear(),
            _finishDate.getMonth(),
            _finishDate.getDate(),
        );
        const startStr = this.formatYMD(startDate);
        const finishStr = this.formatYMD(finishDate);

        const baseUrl = OldEnvStore.env.SCRAPING_BASE_URL;
        const path = `/scraping/place?raceTypeList=${raceType}&startDate=${startStr}&finishDate=${finishStr}`;
        const resolvedUrlForLog = `${baseUrl}${path}`;
        console.debug('fetching scraping API', resolvedUrlForLog);

        // Prefer service binding (env.SCRAPER.fetch) when available to avoid Cloudflare 1042 restriction
        const performScraperFetch = async (p: string): Promise<Response> => {
            const envAny = OldEnvStore.env as any;
            const fullUrl = `${baseUrl}${p}`;
            if (envAny?.SCRAPER && typeof envAny.SCRAPER.fetch === 'function') {
                const internalUrl = `https://internal${p}`;
                return envAny.SCRAPER.fetch(internalUrl);
            }
            return fetch(fullUrl);
        };

        try {
            const res = await performScraperFetch(path);
            if (!res.ok) {
                let errBody: string | undefined = undefined;
                try {
                    errBody = await res.text();
                } catch {
                    errBody = '<failed to read body>';
                }
                console.error(
                    'scraping API error',
                    res.status,
                    res.statusText,
                    resolvedUrlForLog,
                    errBody,
                );
                return [];
            }
            const body: any = await res.json();
            const placeListFromScraping = body?.places ?? body ?? [];

            const placeEntityList: OldPlaceEntity[] = [];
            for (const placeFromScraping of placeListFromScraping) {
                const ent = this.mapScrapingPlace(
                    raceType,
                    placeFromScraping,
                    useGrade,
                );
                if (ent) placeEntityList.push(ent);
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
