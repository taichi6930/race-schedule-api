import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { IAutoraceRaceDataHtmlGateway } from '../../gateway/interface/iAutoraceRaceDataHtmlGateway';
import { AutoraceStageMap } from '../../utility/data/autorace/autoraceRaceStage';
import { AutoraceRaceStage } from '../../utility/data/autorace/autoraceRaceStage';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { AutoracePlaceEntity } from '../entity/autoracePlaceEntity';
import { AutoraceRaceEntity } from '../entity/autoraceRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * オートレース場開催データリポジトリの実装
 */
@injectable()
export class AutoraceRaceRepositoryFromHtmlImpl
    implements IRaceRepository<AutoraceRaceEntity, AutoracePlaceEntity>
{
    public constructor(
        @inject('AutoraceRaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IAutoraceRaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<AutoracePlaceEntity>,
    ): Promise<AutoraceRaceEntity[]> {
        const autoraceRaceDataList: AutoraceRaceEntity[] = [];
        const { placeEntityList } = searchFilter;
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
        return autoraceRaceDataList;
    }

    @Logger
    public async fetchRaceListFromHtmlWithAutoracePlace(
        placeEntity: AutoracePlaceEntity,
    ): Promise<AutoraceRaceEntity[]> {
        try {
            const [year, month, day] = [
                placeEntity.placeData.dateTime.getFullYear(),
                placeEntity.placeData.dateTime.getMonth() + 1,
                placeEntity.placeData.dateTime.getDate(),
            ];
            const htmlText = await this.raceDataHtmlGateway.getRaceDataHtml(
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
            // <div div class="section clearfix">を取得
            const section = content.find('.section');

            section.each((_, sectionElement) => {
                $(sectionElement)
                    .find('.w480px')
                    .each((__, element) => {
                        const raceTime = $(element).find('.start-time').text();
                        const [hour, minute] = raceTime
                            .replace('発走時間', '')
                            .split(':')
                            .map(Number);

                        const raceDate = new Date(
                            year,
                            month - 1,
                            day,
                            hour,
                            minute,
                        );

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
                        if (raceStage !== null && raceStage.trim() !== '') {
                            autoraceRaceDataList.push(
                                AutoraceRaceEntity.createWithoutId(
                                    AutoraceRaceData.create(
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
            return autoraceRaceDataList;
        } catch (error) {
            console.error('htmlを取得できませんでした', error);
            return [];
        }
    }
    private extractRaceStage(
        raceSummaryInfoChild: string,
    ): AutoraceRaceStage | null {
        for (const [pattern, stage] of Object.entries(AutoraceStageMap)) {
            if (new RegExp(pattern).test(raceSummaryInfoChild)) {
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
     * @param raceEntityList
     */
    @Logger
    public async registerRaceEntityList(
        raceEntityList: AutoraceRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
