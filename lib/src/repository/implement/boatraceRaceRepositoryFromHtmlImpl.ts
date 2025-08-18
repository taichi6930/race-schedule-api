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


@injectable()
export class BoatraceRaceRepositoryFromHtmlImpl
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
            
            const raceNumber = 12;
            const htmlText = await this.raceDataHtmlGateway.getRaceDataHtml(
                placeData.raceType,
                placeData.dateTime,
                placeData.location,
                raceNumber,
            );
            const boatraceRaceEntityList: MechanicalRacingRaceEntity[] = [];
            const $ = cheerio.load(htmlText);

            
            const raceNameText = $('.heading2_titleName').text();

            const raceStageString = $('h3').text();
            const raceStage = this.extractRaceStage(raceStageString);
            if (raceStage === null) {
                console.error('レースステージが取得できませんでした');
                return [];
            }

            const raceName = this.extractRaceName(raceNameText, raceStage, 12);

            const raceGrade = this.extractRaceGrade(raceName, grade);

            
            const raceSummaryInfo = $('.contentsFrame1_inner');
            
            const raceSummaryInfoChild = raceSummaryInfo.find('.table1');

            
            const raceSummaryInfoChildTd = raceSummaryInfoChild.find('td');
            
            const raceTime = raceSummaryInfoChildTd.eq(raceNumber).text();

            const [hourString, minuteString] = raceTime.split(':');
            const hour = Number.parseInt(hourString);
            const minute = Number.parseInt(minuteString);

            
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
        
        
        
        if (
            raceName.includes('チャレンジカップ') &&
            raceStage === '優勝戦' &&
            raceNumber === 12
        ) {
            return 'チャレンジカップ';
        }
        
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
        
        if (raceName.includes('レディースチャレンジカップ')) {
            return 'GⅡ';
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
