import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { PlaceData } from '../../domain/placeData';
import { RaceData } from '../../domain/raceData';
import { IRaceDataHtmlGateway } from '../../gateway/interface/iRaceDataHtmlGateway';
import { GradeType } from '../../utility/data/common/gradeType';
import { RaceStage, StageMap } from '../../utility/data/common/raceStage';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { MechanicalRacingRaceEntity } from '../entity/mechanicalRacingRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';


@injectable()
export class AutoraceRaceRepositoryFromHtmlImpl
    implements
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
{
    public constructor(
        @inject('RaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IRaceDataHtmlGateway,
    ) {}

    
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<MechanicalRacingPlaceEntity>,
    ): Promise<MechanicalRacingRaceEntity[]> {
        const autoraceRaceDataList: MechanicalRacingRaceEntity[] = [];
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
        placeEntity: MechanicalRacingPlaceEntity,
    ): Promise<MechanicalRacingRaceEntity[]> {
        try {
            const [year, month, day] = [
                placeEntity.placeData.dateTime.getFullYear(),
                placeEntity.placeData.dateTime.getMonth() + 1,
                placeEntity.placeData.dateTime.getDate(),
            ];
            const htmlText = await this.raceDataHtmlGateway.getRaceDataHtml(
                placeEntity.placeData.raceType,
                placeEntity.placeData.dateTime,
                placeEntity.placeData.location,
            );
            const autoraceRaceDataList: MechanicalRacingRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            
            const content = $('#content');
            const raceName = this.extractRaceName(
                content.find('h3').text(),
                placeEntity.placeData,
                placeEntity.grade,
            );
            
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

                        const raceGrade = placeEntity.grade;
                        if (raceStage !== null && raceStage.trim() !== '') {
                            autoraceRaceDataList.push(
                                MechanicalRacingRaceEntity.createWithoutId(
                                    RaceData.create(
                                        placeEntity.placeData.raceType,
                                        raceName,
                                        raceDate,
                                        placeEntity.placeData.location,
                                        raceGrade,
                                        Number(raceNumber),
                                    ),
                                    raceStage,
                                    [],
                                    getJSTDate(new Date()),
                                ),
                            );
                        }
                    });
            });
            return autoraceRaceDataList;
        } catch (error) {
            console.error('HTMLの取得に失敗しました', error);
            return [];
        }
    }
    private extractRaceStage(raceSummaryInfoChild: string): RaceStage | null {
        for (const [pattern, stage] of Object.entries(
            StageMap(RaceType.AUTORACE),
        )) {
            if (new RegExp(pattern).test(raceSummaryInfoChild)) {
                return stage;
            }
        }
        return null;
    }

    private extractRaceName(
        raceSummaryInfoChild: string,
        placeData: PlaceData,
        grade: GradeType,
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
                grade === condition.grade
            ) {
                return condition.name;
            }
        }

        return `${placeData.location}${grade}`;
    }

    
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
