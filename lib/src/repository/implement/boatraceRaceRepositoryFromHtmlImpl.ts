import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { BoatraceRaceData } from '../../domain/boatraceRaceData';
import { BoatraceRacePlayerData } from '../../domain/boatraceRacePlayerData';
import { IBoatraceRaceDataHtmlGateway } from '../../gateway/interface/iBoatraceRaceDataHtmlGateway';
import {
    BoatraceGradeType,
    BoatraceRaceStage,
} from '../../utility/data/boatrace';
import { Logger } from '../../utility/logger';
import { BoatracePlaceEntity } from '../entity/boatracePlaceEntity';
import { BoatraceRaceEntity } from '../entity/boatraceRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * ボートレース場開催データリポジトリの実装
 */
@injectable()
export class BoatraceRaceRepositoryFromHtmlImpl
    implements IRaceRepository<BoatraceRaceEntity, BoatracePlaceEntity>
{
    constructor(
        @inject('BoatraceRaceDataHtmlGateway')
        private readonly boatraceRaceDataHtmlGateway: IBoatraceRaceDataHtmlGateway,
    ) {}
    /**
     * ボートレース場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<BoatracePlaceEntity>,
    ): Promise<FetchRaceListResponse<BoatraceRaceEntity>> {
        const boatraceRaceDataList: BoatraceRaceEntity[] = [];
        const placeList = request.placeEntityList;
        if (placeList) {
            for (const place of placeList) {
                boatraceRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithBoatracePlace(
                        place.placeData,
                    )),
                );
                console.debug('0.8秒待ちます');
                await new Promise((resolve) => setTimeout(resolve, 800));
                console.debug('0.8秒経ちました');
            }
        }
        return new FetchRaceListResponse(boatraceRaceDataList);
    }

    @Logger
    async fetchRaceListFromHtmlWithBoatracePlace(
        placeData: BoatracePlaceData,
    ): Promise<BoatraceRaceEntity[]> {
        try {
            const [year, month, day] = [
                placeData.dateTime.getFullYear(),
                placeData.dateTime.getMonth() + 1,
                placeData.dateTime.getDate(),
            ];
            // TODO: 全レースを取りたいが、12レースのみ取得するので、後で修正する
            const raceNumber = 12;
            const htmlText =
                await this.boatraceRaceDataHtmlGateway.getRaceDataHtml(
                    placeData.dateTime,
                    placeData.location,
                    raceNumber,
                );
            const boatraceRaceEntityList: BoatraceRaceEntity[] = [];
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

            const raceGrade = this.extractRaceGrade(raceName, placeData.grade);

            // contentsFrame1_innerのクラスを持つ要素を取得
            const raceSummaryInfo = $('.contentsFrame1_inner');
            // その中からtable1 h-mt10のクラスを持つ要素を取得
            const raceSummaryInfoChild = raceSummaryInfo.find('.table1');

            // tableの中のtbodyの中のtdを全て取得
            const raceSummaryInfoChildTd = raceSummaryInfoChild.find('td');
            // 12番目のtdを取得
            const raceTime = raceSummaryInfoChildTd.eq(raceNumber).text();

            const [hourString, minuteString] = raceTime.split(':');
            const hour = parseInt(hourString);
            const minute = parseInt(minuteString);

            // TODO: 選手情報を取得する
            const racePlayerDataList: BoatraceRacePlayerData[] = [];

            boatraceRaceEntityList.push(
                new BoatraceRaceEntity(
                    null,
                    new BoatraceRaceData(
                        raceName,
                        raceStage,
                        new Date(year, month - 1, day, hour, minute),
                        placeData.location,
                        raceGrade,
                        raceNumber,
                    ),
                    racePlayerDataList,
                ),
            );
            return boatraceRaceEntityList;
        } catch (e) {
            console.error('htmlを取得できませんでした', e);
            return [];
        }
    }
    private extractRaceStage(
        raceSummaryInfoChild: string,
    ): BoatraceRaceStage | null {
        // TODO: 後でステージは直す
        console.log('extractRaceStage:', raceSummaryInfoChild);
        if (raceSummaryInfoChild.includes('優勝戦')) {
            return '優勝戦';
        }
        return null;
    }

    private extractRaceName(
        raceName: string,
        raceStage: BoatraceRaceStage,
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
        raceGrade: BoatraceGradeType,
    ): BoatraceGradeType {
        // レース名に「レディースチャレンジカップ」が含まれている場合は「GⅡ」
        if (raceName.includes('レディースチャレンジカップ')) {
            return 'GⅡ';
        }
        return raceGrade;
    }
    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerRaceList(
        request: RegisterRaceListRequest<BoatraceRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
