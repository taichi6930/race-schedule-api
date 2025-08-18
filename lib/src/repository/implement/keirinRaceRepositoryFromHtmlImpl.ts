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
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { MechanicalRacingRaceEntity } from '../entity/mechanicalRacingRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';


@injectable()
export class KeirinRaceRepositoryFromHtmlImpl
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
        const keirinRaceDataList: MechanicalRacingRaceEntity[] = [];
        const { placeEntityList } = searchFilter;
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                keirinRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithKeirinPlace(
                        placeEntity.placeData,
                        placeEntity.grade,
                    )),
                );
                console.debug('0.8秒待ちます');
                await new Promise((resolve) => setTimeout(resolve, 800));
                console.debug('0.8秒経ちました');
            }
        }
        return keirinRaceDataList;
    }

    @Logger
    public async fetchRaceListFromHtmlWithKeirinPlace(
        placeData: PlaceData,
        grade: GradeType,
    ): Promise<MechanicalRacingRaceEntity[]> {
        try {
            const [year, month, day] = [
                placeData.dateTime.getFullYear(),
                placeData.dateTime.getMonth() + 1,
                placeData.dateTime.getDate(),
            ];
            const htmlText = await this.raceDataHtmlGateway.getRaceDataHtml(
                placeData.raceType,
                placeData.dateTime,
                placeData.location,
            );
            const keirinRaceEntityList: MechanicalRacingRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            
            const content = $('#content');
            const seriesRaceName = (
                content.find('h2').text().split('\n').filter(Boolean)[1] ??
                `${placeData.location}${grade}`
            )
                .replace(/[！-～]/g, (s: string) =>
                    String.fromCodePoint((s.codePointAt(0) ?? 0) - 0xfee0),
                )
                .replace(/[０-９Ａ-Ｚａ-ｚ]/g, (s: string) =>
                    String.fromCodePoint((s.codePointAt(0) ?? 0) - 0xfee0),
                );
            
            const section1 = content.find('.section1');
            section1.each((_, section1Element) => {
                
                $(section1Element)
                    .find('.w480px')
                    .each((__, element) => {
                        
                        const raceTime = $(element)
                            .find('.tx_blue')
                            .next()
                            .text()
                            .trim();
                        const [hour, minute] = raceTime.split(':').map(Number);
                        
                        
                        const raceNumber = /第(\d+)R/.exec(
                            $(element).find('a').text(),
                        )?.[1];
                        const raceStage = this.extractRaceStage(
                            $(element).text(),
                        );
                        const raceName = this.extractRaceName(
                            seriesRaceName,
                            raceStage ?? '',
                        );
                        const raceGrade = this.extractRaceGrade(
                            raceName,
                            grade,
                            raceStage ?? '',
                            new Date(year, month - 1, day),
                        );
                        const racePlayerDataList: RacePlayerData[] = [];
                        
                        const table = $(element).find('table');
                        
                        Array.from({ length: 9 }, (___, i) => i + 1) 
                            .map((i) => {
                                const bgClassName = `bg-${i.toString()}-pl`;
                                
                                const tableRow = table.find(`.${bgClassName}`);
                                
                                
                                const positionNumber = tableRow
                                    .find(`.no${i.toString()}`)
                                    .text();
                                
                                
                                
                                const playerNumber =
                                    tableRow
                                        .find('.al-left')
                                        .find('a')
                                        .attr('href')
                                        ?.split('=')[1] ?? null;
                                if (positionNumber && playerNumber !== null) {
                                    racePlayerDataList.push(
                                        RacePlayerData.create(
                                            placeData.raceType,
                                            Number(positionNumber),
                                            Number(playerNumber),
                                        ),
                                    );
                                }
                            });
                        const keirinRaceData =
                            raceStage === null
                                ? null
                                : RaceData.create(
                                      placeData.raceType,
                                      raceName,
                                      new Date(
                                          year,
                                          month - 1,
                                          day,
                                          hour,
                                          minute,
                                      ),
                                      placeData.location,
                                      raceGrade,
                                      Number(raceNumber),
                                  );
                        if (
                            keirinRaceData != null &&
                            racePlayerDataList.length > 0 &&
                            raceStage != null
                        ) {
                            keirinRaceEntityList.push(
                                MechanicalRacingRaceEntity.createWithoutId(
                                    keirinRaceData,
                                    raceStage,
                                    racePlayerDataList,
                                    getJSTDate(new Date()),
                                ),
                            );
                        }
                    });
            });
            return keirinRaceEntityList;
        } catch (error) {
            console.error('HTMLの取得に失敗しました', error);
            return [];
        }
    }

    private extractRaceName(
        raceSummaryInfoChild: string,
        raceStage: string,
    ): string {
        
        
        
        if (
            raceSummaryInfoChild.includes('競輪祭') &&
            raceStage.includes('ガールズ')
        ) {
            return '競輪祭女子王座戦';
        }
        
        
        
        if (
            raceSummaryInfoChild.includes('高松宮記念杯') &&
            raceStage.includes('ガールズ')
        ) {
            return 'パールカップ';
        }
        
        
        
        if (
            raceSummaryInfoChild.includes('オールスター競輪') &&
            raceStage.includes('ガールズ')
        ) {
            return '女子オールスター競輪';
        }
        
        
        
        if (
            raceSummaryInfoChild.includes('サマーナイトフェスティバル') &&
            raceStage.includes('ガールズ')
        ) {
            return 'ガールズケイリンフェスティバル';
        }
        
        
        
        if (
            raceSummaryInfoChild.includes('KEIRINグランプリ') &&
            !raceStage.includes('グランプリ')
        ) {
            return '寺内大吉記念杯競輪';
        }
        return raceSummaryInfoChild;
    }

    private extractRaceStage(raceSummaryInfoChild: string): RaceStage | null {
        for (const [pattern, stage] of Object.entries(
            StageMap(RaceType.KEIRIN),
        )) {
            if (new RegExp(pattern).test(raceSummaryInfoChild)) {
                return stage;
            }
        }
        return null;
    }

    private extractRaceGrade(
        raceName: string,
        raceGrade: GradeType,
        raceStage: RaceStage,
        raceDate: Date,
    ): GradeType {
        
        if (raceStage === 'SA混合ヤンググランプリ') {
            return 'GⅡ';
        }
        
        if (
            raceName.includes('女子オールスター競輪') &&
            raceDate.getFullYear() >= 2025
        ) {
            return 'GⅠ';
        }
        if (
            raceName.includes('女子オールスター競輪') &&
            raceDate.getFullYear() === 2024
        ) {
            return 'FⅡ';
        }
        
        if (
            raceName.includes('サマーナイトフェスティバル') &&
            raceStage.includes('ガールズ')
        ) {
            return 'FⅡ';
        }
        if (raceName.includes('ガールズケイリンフェスティバル')) {
            return 'FⅡ';
        }
        
        if (raceName.includes('寺内大吉記念杯競輪')) {
            return 'FⅠ';
        }
        return raceGrade;
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
