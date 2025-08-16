import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../domain/placeData';
import { RaceData } from '../../domain/raceData';
import { RacePlayerData } from '../../domain/racePlayerData';
import { IRaceDataHtmlGateway } from '../../gateway/interface/iRaceDataHtmlGateway';
import { GradeType } from '../../utility/data/common/gradeType';
import { RaceStage, StageMap } from '../../utility/data/common/raceStage';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { MechanicalRacingRaceEntity } from '../entity/mechanicalRacingRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { RaceType } from './../../utility/raceType';

/**
 * ボートレース場開催データリポジトリの実装
 */
@injectable()
export class BoatraceRaceRepositoryFromHtmlImpl
    implements
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
{
    public constructor(
        @inject('RaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IRaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter - レース検索フィルター
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<MechanicalRacingPlaceEntity>,
    ): Promise<MechanicalRacingRaceEntity[]> {
        const boatraceRaceDataList: MechanicalRacingRaceEntity[] = [];
        const { placeEntityList } = searchFilter;
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                boatraceRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithBoatracePlace(
                        placeEntity.placeData,
                        placeEntity.grade,
                    )),
                );
                console.debug('0.8秒待ちます');
                await new Promise((resolve) => setTimeout(resolve, 800));
                console.debug('0.8秒経ちました');
            }
        }
        return boatraceRaceDataList;
    }

    @Logger
    public async fetchRaceListFromHtmlWithBoatracePlace(
        placeData: PlaceData,
        grade: GradeType,
    ): Promise<MechanicalRacingRaceEntity[]> {
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
            const boatraceRaceEntityList: MechanicalRacingRaceEntity[] = [];
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

            boatraceRaceEntityList.push(
                MechanicalRacingRaceEntity.createWithoutId(
                    RaceData.create(
                        placeData.raceType,
                        raceName,
                        new Date(year, month - 1, day, hour, minute),
                        placeData.location,
                        raceGrade,
                        raceNumber,
                    ),
                    raceStage,
                    racePlayerDataList,
                    getJSTDate(new Date()),
                ),
            );
            return boatraceRaceEntityList;
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
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: MechanicalRacingRaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: MechanicalRacingRaceEntity[];
        failureData: MechanicalRacingRaceEntity[];
    }> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
