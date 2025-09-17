import * as cheerio from 'cheerio';
import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { HorseRaceConditionData } from '../../../../../src/domain/houseRaceConditionData';
import { RaceData } from '../../../../../src/domain/raceData';
import { PlaceEntity } from '../../../../../src/repository/entity/placeEntity';
import { RaceEntity } from '../../../../../src/repository/entity/raceEntity';
import { processJraRaceName } from '../../../../../src/utility/createRaceName';
import { RaceType } from '../../../../../src/utility/raceType';
import { GradeType } from '../../../../../src/utility/validateAndType/gradeType';
import { HeldDayTimes } from '../../../../../src/utility/validateAndType/heldDayTimes';
import { HeldTimes } from '../../../../../src/utility/validateAndType/heldTimes';
import {
    RaceCourse,
    validateRaceCourse,
} from '../../../../../src/utility/validateAndType/raceCourse';
import { RaceDistance } from '../../../../../src/utility/validateAndType/raceDistance';
import { RaceSurfaceType } from '../../../../../src/utility/validateAndType/raceSurfaceType';
import { IRaceDataHtmlGatewayForAWS } from '../../../gateway/interface/iRaceDataHtmlGateway';
import { Logger } from '../../../utility/logger';
import { SearchRaceFilterEntityForAWS } from '../../entity/searchRaceFilterEntity';
import { IRaceRepositoryForAWS } from '../../interface/IRaceRepositoryForAWS';

@injectable()
export class JraRaceRepositoryFromHtmlForAWS implements IRaceRepositoryForAWS {
    public constructor(
        @inject('RaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IRaceDataHtmlGatewayForAWS,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntityForAWS,
    ): Promise<RaceEntity[]> {
        const raceEntityList: RaceEntity[] = [];
        const { placeEntityList } = searchFilter;
        for (const placeEntity of placeEntityList) {
            raceEntityList.push(
                ...(await this.fetchRaceListFromHtml(placeEntity)),
            );
            // HTML_FETCH_DELAY_MSの環境変数から遅延時間を取得
            const delayedTimeMs = Number.parseInt(
                process.env.HTML_FETCH_DELAY_MS ?? '500',
                10,
            );
            console.debug(`待機時間: ${delayedTimeMs}ms`);
            await new Promise((resolve) => setTimeout(resolve, delayedTimeMs));
            console.debug('待機時間が経ちました');
        }
        return raceEntityList;
    }

    @Logger
    public async fetchRaceListFromHtml(
        placeEntity: PlaceEntity,
    ): Promise<RaceEntity[]> {
        try {
            console.log('placeEntity:', placeEntity);
            // レース情報を取得
            const htmlText: string =
                await this.raceDataHtmlGateway.getRaceDataHtml(
                    placeEntity.placeData.raceType,
                    placeEntity.placeData.dateTime,
                    placeEntity.placeData.location,
                    placeEntity.heldDayData.heldTimes * 100 +
                        placeEntity.heldDayData.heldDayTimes,
                );
            const raceEntityList: RaceEntity[] = [];

            // HTMLをパースする
            const $ = cheerio.load(htmlText);
            // "hr-tableSchedule"クラスのtableを取得
            const raceTable = $('table.hr-tableSchedule');
            if (raceTable.length === 0) {
                console.warn(
                    `開催データが見つかりませんでした: ${placeEntity.placeData.location} ${format(
                        placeEntity.placeData.dateTime,
                        'yyyy-MM-dd',
                    )}`,
                );
                return [];
            }

            // tbody > tr をすべて取得
            const trList = raceTable.find('tbody > tr');

            trList.each((i, elem) => {
                const tr = $(elem);
                // レース先頭行のみ抽出（rowspan="2"のtd.hr-tableSchedule__data--dateがあるtr）
                const raceNumTd = tr.find('td.hr-tableSchedule__data--date');
                if (raceNumTd.length === 0) return;

                // レース番号
                const raceNumText = raceNumTd.text().trim(); // 例: "1R9:40"
                const raceNumExec = /(\d+R)/.exec(raceNumText);
                // Rを含むので、除去して数値に変換
                const raceNumber = Number.parseInt(
                    raceNumExec ? raceNumExec[1].replace('R', '') : '0',
                );

                // 時間 1R9:40のR以降
                const raceTime = this.extractRaceTime(
                    raceNumText,
                    placeEntity.placeData.dateTime,
                );

                // レース名
                const rowRaceName = tr
                    .find('span.hr-tableSchedule__title')
                    .text()
                    .trim();

                // 高級グレード（GⅠ,GⅡ,GⅢ,Listed）
                let highGrade = '';
                if (tr.find('span.hr-label--g1').length > 0) highGrade = 'GⅠ';
                if (tr.find('span.hr-label--g2').length > 0) highGrade = 'GⅡ';
                if (tr.find('span.hr-label--g3').length > 0) highGrade = 'GⅢ';
                if (tr.find('span.hr-label--li').length > 0)
                    highGrade = 'Listed';

                // グレード・種別・距離
                const statusText = tr
                    .find('span.hr-tableSchedule__statusText')
                    .text()
                    .trim();

                // 種別
                const surfaceExec = /(芝|ダート|障害)/.exec(statusText);
                const surfaceType = surfaceExec ? surfaceExec[1] : '';

                // 距離
                const distanceExec = /(\d{3,4})m/.exec(statusText);
                const distance = Number.parseInt(
                    distanceExec ? distanceExec[1] : '0',
                );

                // グレード
                // 例: "3歳未勝利", "3歳1勝クラス(500万下)", "3歳オープン", "4歳以上2勝クラス(1000万下)"
                // 括弧を除いた最初の部分をグレードとみなす
                let rowGrade = '';
                const gradeExec =
                    /([\dオクスプランー上利勝新未歳馬]+)(\(|\s|$)/.exec(
                        statusText,
                    );
                if (gradeExec) [, rowGrade] = gradeExec;
                const raceGrade = this.extractRaceGrade(
                    surfaceType,
                    highGrade,
                    rowGrade,
                );

                const conditionData = HorseRaceConditionData.create(
                    surfaceType,
                    distance,
                );

                const raceName = processJraRaceName({
                    name: rowRaceName
                        .replace(/[！-～]/g, (s: string) =>
                            String.fromCodePoint(
                                (s.codePointAt(0) ?? 0) - 0xfee0,
                            ),
                        )
                        .replace(/[０-９Ａ-Ｚａ-ｚ]/g, (s: string) =>
                            String.fromCodePoint(
                                (s.codePointAt(0) ?? 0) - 0xfee0,
                            ),
                        )
                        .replace(/ステークス/, 'S')
                        .replace(/カップ/, 'C')
                        .replace('サラ系', ''),
                    place: placeEntity.placeData.location,
                    date: raceTime,
                    surfaceType: surfaceType,
                    distance: distance,
                    grade: raceGrade,
                });

                const raceData = RaceData.create(
                    placeEntity.placeData.raceType,
                    raceName,
                    raceTime,
                    placeEntity.placeData.location,
                    raceGrade,
                    raceNumber,
                );

                raceEntityList.push(
                    RaceEntity.createWithoutId(
                        raceData,
                        placeEntity.heldDayData,
                        conditionData,
                        undefined, // stage は未指定
                        undefined, // racePlayerDataList は未指定
                    ),
                );
            });

            // まだEntity生成はしない
            return raceEntityList;
        } catch (error) {
            console.error('HTMLの取得に失敗しました', error);
            return [];
        }
    }

    /**
     * 開催競馬場を取得
     * @param raceType - レース種別
     * @param theadElementMatch
     */
    private readonly extractRaceCourse = (
        raceType: RaceType,
        theadElementMatch: RegExpExecArray,
    ): RaceCourse => {
        const placeString: string = theadElementMatch[2];
        // placeStringがJraRaceCourseに変換できるかを確認して、OKであればキャストする
        const place: RaceCourse = placeString;
        return validateRaceCourse(raceType, place);
    };

    /**
     * 開催回数を取得
     * @param theadElementMatch
     */
    private readonly extractRaceHeld = (
        theadElementMatch: RegExpExecArray,
    ): HeldTimes => {
        // 開催回数を取得 数字でない場合はreturn
        if (Number.isNaN(Number.parseInt(theadElementMatch[1]))) {
            return 0;
        }
        const raceHeld: number = Number.parseInt(theadElementMatch[1]);
        return raceHeld;
    };

    /**
     * 開催日数を取得
     * @param theadElementMatch
     */
    private readonly extractRaceHeldDay = (
        theadElementMatch: RegExpExecArray,
    ): HeldDayTimes => {
        // 開催日程を取得 数字でない場合はreturn
        if (Number.isNaN(Number.parseInt(theadElementMatch[3]))) {
            return 0;
        }
        const raceHeldDay: number = Number.parseInt(theadElementMatch[3]);
        return raceHeldDay;
    };

    /**
     * レース番号を取得
     * @param raceNumAndTime
     */
    private readonly extractRaceNumber = (raceNumAndTime: string): number => {
        // tdの最初の要素からレース番号を取得 raceNumAndTimeのxRとなっているxを取得
        const raceNum: number = Number.parseInt(raceNumAndTime.split('R')[0]);
        return raceNum;
    };

    /**
     * レース距離を取得
     * @param distanceMatch
     */
    private readonly extractRaceDistance = (
        distanceMatch: RegExpExecArray | null,
    ): RaceDistance => {
        const distance: number = distanceMatch
            ? Number.parseInt(distanceMatch[0].replace('m', ''))
            : 0;
        return distance;
    };

    /**
     * レース時間を取得
     * @param raceNumAndTime
     * @param date
     */
    private readonly extractRaceTime = (
        raceNumAndTime: string,
        date: Date,
    ): Date => {
        // tdが3つある
        // 1つ目はレース番号とレース開始時間
        // hh:mmの形式で取得
        // tdの最初の要素からレース開始時間を取得 raceNumAndTimeのhh:mmを取得
        const [, raceTime] = raceNumAndTime.split('R');
        // hh:mmの形式からhhとmmを取得
        const [hour, minute] = raceTime
            .split(':')
            .map((time: string) => Number.parseInt(time));
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hour,
            minute,
        );
    };

    /**
     * レースグレードを取得
     * @param raceSurfaceType
     * @param highGrade
     * @param rowGrade
     */
    private readonly extractRaceGrade = (
        raceSurfaceType: RaceSurfaceType,
        highGrade: string,
        rowGrade: string,
    ): GradeType => {
        // もしhightGradeに値が入っていたらそれを優先する
        // 例: GⅠ, GⅡ, GⅢ, Listed
        if (highGrade.length > 0) {
            return raceSurfaceType === '障害' ? `J.${highGrade}` : highGrade;
        }
        if (rowGrade.includes('オープン')) {
            return 'オープン';
        }
        if (rowGrade.includes('3勝クラス')) {
            return '3勝クラス';
        }
        if (rowGrade.includes('2勝クラス')) {
            return '2勝クラス';
        }
        if (rowGrade.includes('1勝クラス')) {
            return '1勝クラス';
        }
        if (rowGrade.includes('1600万')) {
            return '1600万下';
        }
        if (rowGrade.includes('1000万')) {
            return '1000万下';
        }
        if (rowGrade.includes('900万')) {
            return '900万下';
        }
        if (rowGrade.includes('500万')) {
            return '500万下';
        }
        if (rowGrade.includes('未勝利')) {
            return '未勝利';
        }
        if (rowGrade.includes('未出走')) {
            return '未出走';
        }
        if (rowGrade.includes('新馬')) {
            return '新馬';
        }
        return '格付けなし';
    };

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param raceType - レース種別
     * @param raceEntityList
     */
    @Logger
    public async upsertRaceEntityList(
        raceType: RaceType,
        raceEntityList: RaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: RaceEntity[];
        failureData: RaceEntity[];
    }> {
        console.debug(raceType, raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
