import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { IAutoraceRaceDataHtmlGateway } from '../../gateway/interface/iAutoraceRaceDataHtmlGateway';
import { AUTORACE_STAGE_MAP } from '../../utility/data/autorace';
import { AutoraceRaceStage } from '../../utility/data/autorace';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../entity/autoraceRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * オートレース場開催データリポジトリの実装
 */
@injectable()
export class AutoraceRaceRepositoryFromHtmlImpl
    implements IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
{
    constructor(
        @inject('AutoraceRaceDataHtmlGateway')
        private readonly autoraceRaceDataHtmlGateway: IAutoraceRaceDataHtmlGateway,
    ) {}
    /**
     * オートレース場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceEntityList(
        request: FetchRaceListRequest<AutoracePlaceEntity>,
    ): Promise<FetchRaceListResponse<AutoraceRaceEntity>> {
        const autoraceRaceDataList: AutoraceRaceEntity[] = [];
        const placeEntityList = request.placeEntityList;
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                autoraceRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithAutoracePlace(
                        placeEntity,
                    )),
                );
                console.debug('0.8秒待ちます');
                await new Promise((resolve) => setTimeout(resolve, 800));
                console.debug('0.8秒経ちました');
            }
        }
        return new FetchRaceListResponse(autoraceRaceDataList);
    }

    @Logger
    async fetchRaceListFromHtmlWithAutoracePlace(
        placeEntity: AutoracePlaceEntity,
    ): Promise<AutoraceRaceEntity[]> {
        try {
            const [year, month, day] = [
                placeEntity.placeData.dateTime.getFullYear(),
                placeEntity.placeData.dateTime.getMonth() + 1,
                placeEntity.placeData.dateTime.getDate(),
            ];
            const htmlText =
                await this.autoraceRaceDataHtmlGateway.getRaceDataHtml(
                    placeEntity.placeData.dateTime,
                    placeEntity.placeData.location,
                );
            const autoraceRaceDataList: AutoraceRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            // id="content"を取得
            const content = $('#content');
            const raceName = this.extractRaceName(
                content.find('h3').text(),
                placeEntity.placeData,
            );
            console.log(`raceName: ${raceName}`);
            // <div div class="section clearfix">を取得
            const section = content.find('.section');
            console.log(
                `raceInfo: ${year.toString()}/${month.toXDigits(2)}/${day.toXDigits(2)} ${placeEntity.placeData.location} ${placeEntity.placeData.grade} ${raceName}`,
            );
            section.each((index, element) => {
                $(element)
                    .find('.w480px')
                    .each((index, element) => {
                        const raceTime = $(element).find('.start-time').text();
                        const [hour, minute] = raceTime
                            .replace('発走時間', '')
                            .split(':')
                            .map((time) => Number(time));

                        const raceDate = new Date(
                            year,
                            month - 1,
                            day,
                            hour,
                            minute,
                        );
                        console.log(`raceDate: ${raceDate.toString()}`);

                        const aTag = $(element).find('.w380px').find('a');
                        const decodedATag = decodeURIComponent(aTag.text());

                        const raceNumber = /(\d+)R/.exec(decodedATag)?.[1];
                        const rowRaceStage =
                            /(\d+)R\s+(.+)\s+(\d+)m/
                                .exec(decodedATag)?.[2]
                                .replace('Ｇレース７', '')
                                .replace('グレードレース７', '') ?? '';

                        const raceStage = this.extractRaceStage(rowRaceStage);
                        if (raceStage === null) {
                            console.log(`notRaceStage: ${rowRaceStage}`);
                        }

                        const raceGrade = placeEntity.placeData.grade;
                        if (
                            raceStage !== null &&
                            raceStage !== undefined &&
                            raceStage.trim() !== ''
                        ) {
                            autoraceRaceDataList.push(
                                new AutoraceRaceEntity(
                                    null,
                                    new AutoraceRaceData(
                                        raceName,
                                        raceStage,
                                        raceDate,
                                        placeEntity.placeData.location,
                                        raceGrade,
                                        Number(raceNumber),
                                    ),
                                    [],
                                    getJSTDate(new Date()),
                                ),
                            );
                        }
                    });
            });
            console.log(autoraceRaceDataList);
            return autoraceRaceDataList;
        } catch (e) {
            console.error('htmlを取得できませんでした', e);
            return [];
        }
    }
    private extractRaceStage(
        raceSummaryInfoChild: string,
    ): AutoraceRaceStage | null {
        for (const [pattern, stage] of Object.entries(AUTORACE_STAGE_MAP)) {
            if (new RegExp(pattern).exec(raceSummaryInfoChild)) {
                return stage;
            }
        }
        return null;
    }

    private extractRaceName(
        raceSummaryInfoChild: string,
        placeData: AutoracePlaceData,
    ): string {
        const raceConditions = [
            {
                keyword: '日本選手権',
                grade: 'SG',
                name: '日本選手権オートレース',
            },
            {
                keyword: 'スーパースター',
                grade: 'SG',
                name: 'スーパースター王座決定戦',
            },
            {
                keyword: '全日本選抜',
                grade: 'SG',
                name: '全日本選抜オートレース',
            },
            {
                keyword: 'オートレースグランプリ',
                grade: 'SG',
                name: 'オートレースグランプリ',
            },
            {
                keyword: 'オールスター',
                grade: 'SG',
                name: 'オールスター・オートレース',
            },
            {
                keyword: '共同通信',
                grade: 'GⅠ',
                name: '共同通信社杯プレミアムカップ',
            },
        ];

        for (const condition of raceConditions) {
            if (
                raceSummaryInfoChild.includes(condition.keyword) &&
                placeData.grade === condition.grade
            ) {
                return condition.name;
            }
        }

        return `${placeData.location}${placeData.grade}`;
    }

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerRaceEntityList(
        request: RegisterRaceListRequest<AutoraceRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
