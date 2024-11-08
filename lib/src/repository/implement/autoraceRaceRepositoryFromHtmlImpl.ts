import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { IAutoraceRaceDataHtmlGateway } from '../../gateway/interface/iAutoraceRaceDataHtmlGateway';
import { AUTORACE_STAGE_MAP } from '../../utility/data/autorace';
import { AutoraceRaceStage } from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../entity/autoraceRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競馬場開催データリポジトリの実装
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
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<AutoracePlaceEntity>,
    ): Promise<FetchRaceListResponse<AutoraceRaceEntity>> {
        const autoraceRaceDataList: AutoraceRaceEntity[] = [];
        const placeList = request.placeDataList;
        if (placeList) {
            for (const place of placeList) {
                autoraceRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithAutoracePlace(
                        place,
                    )),
                );
                console.debug('1秒待ちます');
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.debug('1秒経ちました');
            }
        }
        return new FetchRaceListResponse(autoraceRaceDataList);
    }

    @Logger
    async fetchRaceListFromHtmlWithAutoracePlace(
        placeData: AutoracePlaceEntity,
    ): Promise<AutoraceRaceEntity[]> {
        try {
            const [year, month, day] = [
                placeData.dateTime.getFullYear(),
                placeData.dateTime.getMonth() + 1,
                placeData.dateTime.getDate(),
            ];
            const htmlText =
                await this.autoraceRaceDataHtmlGateway.getRaceDataHtml(
                    placeData.dateTime,
                    placeData.location,
                );
            const autoraceRaceDataList: AutoraceRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            // id="content"を取得
            const content = $('#content');
            const raceName =
                content
                    .find('h2')
                    .text()
                    .split('\n')
                    .filter((name) => name)[1] ??
                `${placeData.location}${placeData.grade}`;
            console.log(`raceName: ${raceName}`);
            // <div div class="section clearfix">を取得
            const section = content.find('.section');
            console.log(
                `raceInfo: ${year.toString()}/${month.toXDigits(2)}/${day.toXDigits(2)} ${placeData.location} ${placeData.grade} ${raceName}`,
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

                        const raceGrade = placeData.grade;
                        if (
                            raceStage !== null &&
                            raceStage !== undefined &&
                            raceStage.trim() !== ''
                        ) {
                            autoraceRaceDataList.push(
                                new AutoraceRaceEntity(
                                    null,
                                    raceName,
                                    raceStage,
                                    raceDate,
                                    placeData.location,
                                    raceGrade,
                                    Number(raceNumber),
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

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param request
     */
    @Logger
    registerRaceList(
        request: RegisterRaceListRequest<AutoraceRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
