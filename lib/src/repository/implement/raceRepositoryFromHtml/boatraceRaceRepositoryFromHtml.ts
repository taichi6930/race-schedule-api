import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../../../../src/domain/placeData';
import { RaceData } from '../../../../../src/domain/raceData';
import { RacePlayerData } from '../../../../../src/domain/racePlayerData';
import { RaceEntity } from '../../../../../src/repository/entity/raceEntity';
import { RaceType } from '../../../../../src/utility/raceType';
import { IRaceDataHtmlGatewayForAWS } from '../../../gateway/interface/iRaceDataHtmlGateway';
import { Logger } from '../../../utility/logger';
import { GradeType } from '../../../utility/validateAndType/gradeType';
import {
    RaceStage,
    StageMap,
} from '../../../utility/validateAndType/raceStage';
import { SearchRaceFilterEntityForAWS } from '../../entity/searchRaceFilterEntity';
import { IRaceRepositoryForAWS } from '../../interface/IRaceRepository';

/**
 * ボートレース場開催データリポジトリの実装
 */
@injectable()
export class BoatraceRaceRepositoryFromHtmlForAWS
    implements IRaceRepositoryForAWS
{
    public constructor(
        @inject('RaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IRaceDataHtmlGatewayForAWS,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter - レース検索フィルター
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntityForAWS,
    ): Promise<RaceEntity[]> {
        const raceEntityList: RaceEntity[] = [];

        const { placeEntityList } = searchFilter;
        for (const placeEntity of placeEntityList) {
            raceEntityList.push(
                ...(await this.fetchRaceListFromHtml(
                    placeEntity.placeData,
                    placeEntity.grade,
                )),
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
        placeData: PlaceData,
        grade: GradeType,
    ): Promise<RaceEntity[]> {
        try {
            const [year, month, day] = [
                placeData.dateTime.getFullYear(),
                placeData.dateTime.getMonth() + 1,
                placeData.dateTime.getDate(),
            ];
            // TODO: 全レースを取りたいが、12レースのみ取得するので、後で修正する
            const raceNumber = 12;
            const htmlText = await this.raceDataHtmlGateway.getRaceDataHtml(
                placeData.raceType,
                placeData.dateTime,
                placeData.location,
                raceNumber,
            );
            const raceEntityList: RaceEntity[] = [];
            const $ = cheerio.load(htmlText);

            // raceNameを取得 class="heading2_titleName"のtext
            const raceNameText = $('.heading2_titleName').text();

            const raceStageString = $('h3').text();
            const raceStage = this.extractRaceStage(raceStageString);
            if (raceStage === null) {
                console.error('レースステージが取得できませんでした');
                return [];
            }

            const raceName = this.extractRaceName(raceNameText, raceStage, 12);

            const raceGrade = this.extractRaceGrade(raceName, grade);

            // contentsFrame1_innerのクラスを持つ要素を取得
            const raceSummaryInfo = $('.contentsFrame1_inner');
            // その中からtable1 h-mt10のクラスを持つ要素を取得
            const raceSummaryInfoChild = raceSummaryInfo.find('.table1');

            // tableの中のtbodyの中のtdを全て取得
            const raceSummaryInfoChildTd = raceSummaryInfoChild.find('td');
            // 12番目のtdを取得
            const raceTime = raceSummaryInfoChildTd.eq(raceNumber).text();

            const [hourString, minuteString] = raceTime.split(':');
            const hour = Number.parseInt(hourString);
            const minute = Number.parseInt(minuteString);

            // TODO: 選手情報を取得する
            const racePlayerDataList: RacePlayerData[] = [];

            raceEntityList.push(
                RaceEntity.createWithoutId(
                    RaceData.create(
                        placeData.raceType,
                        raceName,
                        new Date(year, month - 1, day, hour, minute),
                        placeData.location,
                        raceGrade,
                        raceNumber,
                    ),
                    undefined, // heldDayDataは未設定
                    undefined, // conditionDataは未設定
                    raceStage,
                    racePlayerDataList,
                ),
            );
            return raceEntityList;
        } catch (error) {
            console.error('HTMLの取得に失敗しました', error);
            return [];
        }
    }
    private extractRaceStage(raceSummaryInfoChild: string): RaceStage | null {
        for (const [pattern, stage] of Object.entries(
            StageMap(RaceType.BOATRACE),
        )) {
            if (new RegExp(pattern).test(raceSummaryInfoChild)) {
                return stage;
            }
        }
        return null;
    }

    private extractRaceName(
        raceName: string,
        raceStage: RaceStage,
        raceNumber: number,
    ): string {
        // レース名に「チャレンジカップ」が含まれている場合で、
        // レースステージが「優勝戦」、
        // レース番号が12の場合は「チャレンジカップ」とする
        if (
            raceName.includes('チャレンジカップ') &&
            raceStage === '優勝戦' &&
            raceNumber === 12
        ) {
            return 'チャレンジカップ';
        }
        // 11レースの場合は「レディースチャレンジカップ」
        if (
            raceName.includes('チャレンジカップ') &&
            raceStage === '優勝戦' &&
            raceNumber === 11
        ) {
            return 'レディースチャレンジカップ';
        }
        return raceName;
    }

    private extractRaceGrade(
        raceName: string,
        raceGrade: GradeType,
    ): GradeType {
        // レース名に「レディースチャレンジカップ」が含まれている場合は「GⅡ」
        if (raceName.includes('レディースチャレンジカップ')) {
            return 'GⅡ';
        }
        return raceGrade;
    }

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
