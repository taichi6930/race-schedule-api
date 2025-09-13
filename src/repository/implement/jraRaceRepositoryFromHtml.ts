import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { processJraRaceName } from '../../../lib/src/utility/createRaceName';
import { GradeType } from '../../../lib/src/utility/validateAndType/gradeType';
import { HeldDayTimes } from '../../../lib/src/utility/validateAndType/heldDayTimes';
import { HeldTimes } from '../../../lib/src/utility/validateAndType/heldTimes';
import { RaceDistance } from '../../../lib/src/utility/validateAndType/raceDistance';
import { RaceSurfaceType } from '../../../lib/src/utility/validateAndType/raceSurfaceType';
import { HeldDayData } from '../../domain/heldDayData';
import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { IRaceDataHtmlGateway } from '../../gateway/interface/iRaceDataHtmlGateway';
import { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import type { UpsertResult } from '../../utility/upsertResult';
import {
    RaceCourse,
    validateRaceCourse,
} from '../../utility/validateAndType/raceCourse';
import { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import { PlaceEntity } from '../entity/placeEntity';
import { RaceEntity } from '../entity/raceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

@injectable()
export class JraRaceRepositoryFromHtml implements IRaceRepository {
    public constructor(
        @inject('RaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IRaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     * @param commonParameter
     * @param searchRaceFilter
     * @param placeEntityList
     */
    @Logger
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        placeEntityList?: PlaceEntity[],
    ): Promise<RaceEntity[]> {
        const raceEntityList: RaceEntity[] = [];
        console.log(placeEntityList);
        if (!placeEntityList) return raceEntityList;

        // placeEntityListからdateのみをListにする、重複すると思うので重複を削除する
        const filteredPlaceDataList = placeEntityList
            .map((place) => place.placeData)
            .filter((x, i, self) => self.indexOf(x) === i);
        for (const placeData of filteredPlaceDataList) {
            raceEntityList.push(
                ...(await this.fetchRaceListFromHtml(
                    placeData.raceType,
                    placeData.dateTime,
                )),
            );
        }
        return raceEntityList;
    }

    @Logger
    public async fetchRaceListFromHtml(
        raceType: RaceType,
        raceDate: Date,
    ): Promise<RaceEntity[]> {
        try {
            // レース情報を取得
            const htmlText: string =
                await this.raceDataHtmlGateway.getRaceDataHtml(
                    raceType,
                    raceDate,
                );
            const raceEntityList: RaceEntity[] = [];

            // mockHTML内のsection id="raceInfo"の中のtableを取得
            // HTMLをパースする
            const $ = cheerio.load(htmlText);
            const doc = $(`#raceInfo`);
            const table = doc.find('table');

            table.each((i: number, tableElem) => {
                // theadタグを取得
                const thead = $(tableElem).find('thead');

                // thead内のthタグ内に「x回yyz日目」が含まれている
                // 「2回東京8日目」のような文字列が取得できる
                // xは回数、yyは競馬場名、zは日目
                // xには2、yyには東京、zには8が取得できるようにしたい
                // これを取得してレースの開催場所と日程を取得する
                const theadElementMatch = /(\d+)回(.*?)(\d+)日目/.exec(
                    thead.text(),
                );
                if (theadElementMatch === null) {
                    return;
                }
                // 競馬場を取得
                const raceCourse: RaceCourse = this.extractRaceCourse(
                    raceType,
                    theadElementMatch,
                );
                // 開催回数を取得
                const raceHeld: number =
                    this.extractRaceHeld(theadElementMatch);
                // 開催日数を取得
                const raceHeldDay: number =
                    this.extractRaceHeldDay(theadElementMatch);
                // 競馬場、開催回数、開催日数が取得できない場合はreturn
                if (raceHeld === 0 || raceHeldDay === 0) {
                    return;
                }

                // tbody内のtrタグを取得
                $(tableElem)
                    .find('tbody')
                    .find('tr')
                    .each((_: number, elem) => {
                        const element = $(elem);
                        // レース番号を取得
                        const [raceNumAndTime] = element
                            .find('td')
                            .eq(0)
                            .text()
                            .split(' ');
                        const raceNumber =
                            this.extractRaceNumber(raceNumAndTime);
                        // レース距離を取得
                        // tdの2つ目の要素からレース距離を取得
                        const distanceMatch = /\d+m/.exec(
                            element.find('td').eq(1).find('span').eq(1).text(),
                        );
                        const raceDistance =
                            this.extractRaceDistance(distanceMatch);
                        // レース距離が取得できない場合はreturn
                        if (raceDistance === 0) {
                            return;
                        }
                        // レース時間を取得
                        const raceDateTime: Date = this.extractRaceTime(
                            raceNumAndTime,
                            raceDate,
                        );
                        // surfaceTypeを取得
                        const surfaceTypeMatch = /[ダ芝障]{1,2}/.exec(
                            element.find('td').eq(1).find('span').eq(1).text(),
                        );
                        const raceSurfaceType: RaceSurfaceType =
                            this.extractSurfaceType(surfaceTypeMatch);

                        // 2つ目はレース名、レースのグレード、馬の種類、距離、頭数
                        const rowRaceName = element
                            .find('td')
                            .eq(1)
                            .find('a')
                            .text()
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
                            .replace('サラ系', '');

                        // レースのグレードを取得
                        const tbodyTrTdElement1 = element
                            .find('td')
                            .eq(1)
                            .find('span')
                            .eq(0)
                            .text();
                        const [raceGrade, _raceName] =
                            this.extractRaceGradeAndRaceName(
                                tbodyTrTdElement1,
                                raceSurfaceType,
                                rowRaceName,
                            );

                        // レース名を取得
                        const raceName = processJraRaceName({
                            name: _raceName,
                            place: raceCourse,
                            date: raceDate,
                            surfaceType: raceSurfaceType,
                            distance: raceDistance,
                            grade: raceGrade,
                        });

                        const jraRaceData = RaceEntity.createWithoutId(
                            RaceData.create(
                                raceType,
                                raceName,
                                raceDateTime,
                                raceCourse,
                                raceGrade,
                                raceNumber,
                            ),
                            HeldDayData.create(raceHeld, raceHeldDay),
                            HorseRaceConditionData.create(
                                raceSurfaceType,
                                raceDistance,
                            ),
                            undefined, // stage は未指定
                            undefined, // racePlayerDataList は未指定
                        );
                        raceEntityList.push(jraRaceData);
                    });
            });
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
     * surfaceType
     * @param surfaceTypeMatch
     */
    private readonly extractSurfaceType = (
        surfaceTypeMatch: RegExpExecArray | null,
    ): RaceSurfaceType => {
        // ダ である場合には ダート に、障 である場合には 障害 に変換する
        const surfaceType: string = (surfaceTypeMatch?.[0] ?? '')
            .replace('ダ', 'ダート')
            .replace('障', '障害');
        if (
            surfaceType !== '芝' &&
            surfaceType !== 'ダート' &&
            surfaceType !== '障害'
        ) {
            return '不明';
        }
        return surfaceType;
    };

    /**
     * レースグレードを取得
     * @param tbodyTrTdElement1
     * @param raceSurfaceType
     * @param rowRaceName
     */
    private readonly extractRaceGradeAndRaceName = (
        tbodyTrTdElement1: string,
        raceSurfaceType: RaceSurfaceType,
        rowRaceName: string,
    ): [GradeType, string] => {
        let raceGrade: GradeType | null = null;

        if (rowRaceName.includes('(GⅠ)')) {
            raceGrade = raceSurfaceType === '障害' ? 'J.GⅠ' : 'GⅠ';
            rowRaceName = rowRaceName.replace('(GⅠ)', '');
        }
        if (rowRaceName.includes('(GⅡ)')) {
            raceGrade = raceSurfaceType === '障害' ? 'J.GⅡ' : 'GⅡ';
            rowRaceName = rowRaceName.replace('(GⅡ)', '');
        }
        if (rowRaceName.includes('(GⅢ)')) {
            raceGrade = raceSurfaceType === '障害' ? 'J.GⅢ' : 'GⅢ';
            rowRaceName = rowRaceName.replace('(GⅢ)', '');
        }
        if (rowRaceName.includes('(L)')) {
            raceGrade = 'Listed';
            rowRaceName = rowRaceName.replace('(L)', '');
        }
        if (raceGrade === null) {
            // 2つあるspanのうち1つ目にレースの格が入っているので、それを取得

            if (tbodyTrTdElement1.includes('オープン')) {
                raceGrade = 'オープン特別';
            }
            if (tbodyTrTdElement1.includes('3勝クラス')) {
                raceGrade = '3勝クラス';
            }
            if (tbodyTrTdElement1.includes('2勝クラス')) {
                raceGrade = '2勝クラス';
            }
            if (tbodyTrTdElement1.includes('1勝クラス')) {
                raceGrade = '1勝クラス';
            }
            if (tbodyTrTdElement1.includes('1600万')) {
                raceGrade = '1600万下';
            }
            if (tbodyTrTdElement1.includes('1000万')) {
                raceGrade = '1000万下';
            }
            if (tbodyTrTdElement1.includes('900万')) {
                raceGrade = '900万下';
            }
            if (tbodyTrTdElement1.includes('500万')) {
                raceGrade = '500万下';
            }
            if (tbodyTrTdElement1.includes('未勝利')) {
                raceGrade = '未勝利';
            }
            if (tbodyTrTdElement1.includes('未出走')) {
                raceGrade = '未出走';
            }
            if (tbodyTrTdElement1.includes('新馬')) {
                raceGrade = '新馬';
            }
        }
        if (raceGrade === null) {
            if (rowRaceName.includes('オープン')) {
                raceGrade = 'オープン特別';
            }
            if (rowRaceName.includes('3勝クラス')) {
                raceGrade = '3勝クラス';
            }
            if (rowRaceName.includes('2勝クラス')) {
                raceGrade = '2勝クラス';
            }
            if (rowRaceName.includes('1勝クラス')) {
                raceGrade = '1勝クラス';
            }
            if (rowRaceName.includes('1600万')) {
                raceGrade = '1600万下';
            }
            if (rowRaceName.includes('1000万')) {
                raceGrade = '1000万下';
            }
            if (rowRaceName.includes('900万')) {
                raceGrade = '900万下';
            }
            if (rowRaceName.includes('500万')) {
                raceGrade = '500万下';
            }
            if (rowRaceName.includes('未勝利')) {
                raceGrade = '未勝利';
            }
            if (rowRaceName.includes('未出走')) {
                raceGrade = '未出走';
            }
            if (rowRaceName.includes('新馬')) {
                raceGrade = '新馬';
            }
            if (rowRaceName.includes('オープン')) {
                raceGrade = 'オープン';
            }
        }

        return [raceGrade ?? '格付けなし', rowRaceName];
    };

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param _commonParameter - unused
     * @param _entityList - unused
     */
    @Logger
    public async upsertRaceEntityList(
        _commonParameter: CommonParameter,
        _entityList: RaceEntity[],
    ): Promise<UpsertResult> {
        void _commonParameter;
        void _entityList;
        return { successCount: 0, failureCount: 0, failures: [] };
    }
}
