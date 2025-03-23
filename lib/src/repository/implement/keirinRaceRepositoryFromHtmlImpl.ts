import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinRaceData } from '../../domain/keirinRaceData';
import { KeirinRacePlayerData } from '../../domain/keirinRacePlayerData';
import { IKeirinRaceDataHtmlGateway } from '../../gateway/interface/iKeirinRaceDataHtmlGateway';
import { KeirinGradeType } from '../../utility/data/keirin/keirinGradeType';
import {
    KeirinRaceStage,
    KeirinStageMap,
} from '../../utility/data/keirin/keirinRaceStage';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../entity/keirinRaceEntity';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * 競輪場開催データリポジトリの実装
 */
@injectable()
export class KeirinRaceRepositoryFromHtmlImpl
    implements IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
{
    constructor(
        @inject('KeirinRaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IKeirinRaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<KeirinPlaceEntity>,
    ): Promise<KeirinRaceEntity[]> {
        const keirinRaceDataList: KeirinRaceEntity[] = [];
        const placeEntityList = searchFilter.placeEntityList;
        if (placeEntityList) {
            for (const placeEntity of placeEntityList) {
                keirinRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithKeirinPlace(
                        placeEntity.placeData,
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
    async fetchRaceListFromHtmlWithKeirinPlace(
        placeData: KeirinPlaceData,
    ): Promise<KeirinRaceEntity[]> {
        try {
            const [year, month, day] = [
                placeData.dateTime.getFullYear(),
                placeData.dateTime.getMonth() + 1,
                placeData.dateTime.getDate(),
            ];
            const htmlText = await this.raceDataHtmlGateway.getRaceDataHtml(
                placeData.dateTime,
                placeData.location,
            );
            const keirinRaceEntityList: KeirinRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            // id="content"を取得
            const content = $('#content');
            const seriesRaceName = (
                content
                    .find('h2')
                    .text()
                    .split('\n')
                    .filter((name) => name)[1] ??
                `${placeData.location}${placeData.grade}`
            )
                .replace(/[！-～]/g, (s: string) =>
                    String.fromCharCode(s.charCodeAt(0) - 0xfee0),
                )
                .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s: string) =>
                    String.fromCharCode(s.charCodeAt(0) - 0xfee0),
                );
            // class="section1"を取得
            const section1 = content.find('.section1');
            section1.each((index, element) => {
                // class="w480px"を取得
                $(element)
                    .find('.w480px')
                    .each((index, element) => {
                        // 発走時間の取得 10: 50
                        const raceTime = $(element)
                            .find('.tx_blue')
                            .next()
                            .text()
                            .trim();
                        const [hour, minute] = raceTime.split(':').map(Number);
                        // レースナンバーの取得 aタグの中にある 第11R の11
                        // 第 と R の間にある
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
                            placeData.grade,
                            raceStage ?? '',
                            new Date(year, month - 1, day),
                        );
                        const racePlayerDataList: KeirinRacePlayerData[] = [];
                        // tableを取得
                        const table = $(element).find('table');
                        // class="bg-1-pl", "bg-2-pl"..."bg-9-pl"を取得
                        Array.from({ length: 9 }, (_, i) => i + 1) // 1から9までの配列を作成
                            .map((i) => {
                                const bgClassName = `bg-${i.toString()}-pl`;
                                // class="bg-1-pl"を取得
                                const tableRow = table.find(`.${bgClassName}`);
                                // class="bg-1-pl"の中にあるtdを取得
                                // <td class="no1">1</td>のような形なので、"no${i}"の中のテキストを取得、枠番になる
                                const positionNumber = tableRow
                                    .find(`.no${i.toString()}`)
                                    .text();
                                // <td class="al-left"><a href="./PlayerDetail.do?playerCd=015480">松本秀之介</a></td>
                                // 015480が選手の登録番号なので、これを取得
                                // "./PlayerDetail.do?playerCd=015480"のような形になっているので、parseして取得
                                const playerNumber =
                                    tableRow
                                        .find('.al-left')
                                        .find('a')
                                        .attr('href')
                                        ?.split('=')[1] ?? null;
                                if (positionNumber && playerNumber !== null) {
                                    racePlayerDataList.push(
                                        KeirinRacePlayerData.create(
                                            Number(positionNumber),
                                            Number(playerNumber),
                                        ),
                                    );
                                }
                            });
                        const keirinRaceData =
                            raceStage !== null
                                ? KeirinRaceData.create(
                                      raceName,
                                      raceStage,
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
                                  )
                                : null;
                        if (
                            keirinRaceData != null &&
                            racePlayerDataList.length !== 0
                        ) {
                            keirinRaceEntityList.push(
                                KeirinRaceEntity.createWithoutId(
                                    keirinRaceData,
                                    racePlayerDataList,
                                    getJSTDate(new Date()),
                                ),
                            );
                        }
                    });
            });
            return keirinRaceEntityList;
        } catch (error) {
            console.error('htmlを取得できませんでした', error);
            return [];
        }
    }

    private extractRaceName(
        raceSummaryInfoChild: string,
        raceStage: string,
    ): string {
        // raceNameに競輪祭が含まれている場合かつ
        // raceStageにガールズが含まれている場合、
        // raceNameを「競輪祭女子王座戦」にする
        if (/競輪祭/.exec(raceSummaryInfoChild) && /ガールズ/.exec(raceStage)) {
            return '競輪祭女子王座戦';
        }
        // raceNameに高松宮記念杯が含まれているかつ
        // raceStageがガールズが含まれている場合、
        // raceNameを「パールカップ」にする
        if (
            /高松宮記念杯/.exec(raceSummaryInfoChild) &&
            /ガールズ/.exec(raceStage)
        ) {
            return 'パールカップ';
        }
        // raceNameにオールスター競輪が含まれている場合かつ
        // raceStageにガールズが含まれている場合、
        // raceNameを「女子オールスター競輪」にする
        if (
            /オールスター競輪/.exec(raceSummaryInfoChild) &&
            /ガールズ/.exec(raceStage)
        ) {
            return '女子オールスター競輪';
        }
        // raceNameにサマーナイトフェスティバルが含まれている場合、
        // raceStageに「ガールズ」が含まれている場合、
        // raceNameを「ガールズケイリンフェスティバル」にする
        if (
            /サマーナイトフェスティバル/.exec(raceSummaryInfoChild) &&
            /ガールズ/.exec(raceStage)
        ) {
            return 'ガールズケイリンフェスティバル';
        }
        // raceNameにKEIRINグランプリが含まれている場合、
        // raceStageに「グランプリ」が含まれていなかったら、
        // raceNameを「寺内大吉記念杯競輪」にする
        if (
            /KEIRINグランプリ/.exec(raceSummaryInfoChild) &&
            !/グランプリ/.exec(raceStage)
        ) {
            return '寺内大吉記念杯競輪';
        }
        return raceSummaryInfoChild;
    }

    private extractRaceStage(
        raceSummaryInfoChild: string,
    ): KeirinRaceStage | null {
        for (const [pattern, stage] of Object.entries(KeirinStageMap)) {
            if (new RegExp(pattern).exec(raceSummaryInfoChild)) {
                return stage;
            }
        }
        return null;
    }

    private extractRaceGrade(
        raceName: string,
        raceGrade: KeirinGradeType,
        raceStage: KeirinRaceStage,
        raceDate: Date,
    ): KeirinGradeType {
        // raceStageが「ヤンググランプリ」の場合、GⅡを返す
        if (raceStage === 'SA混合ヤンググランプリ') {
            return 'GⅡ';
        }
        // raceNameに女子オールスター競輪が入っている場合、2024年であればFⅡ、2025年以降であればGⅠを返す
        if (
            /女子オールスター競輪/.exec(raceName) &&
            raceDate.getFullYear() >= 2025
        ) {
            return 'GⅠ';
        }
        if (
            /女子オールスター競輪/.exec(raceName) &&
            raceDate.getFullYear() === 2024
        ) {
            return 'FⅡ';
        }
        // raceNameにサマーナイトフェスティバルが入っている場合、raceStageが「ガールズ」が含まれている場合、FⅡを返す
        if (
            /サマーナイトフェスティバル/.exec(raceName) &&
            /ガールズ/.exec(raceStage)
        ) {
            return 'FⅡ';
        }
        if (/ガールズケイリンフェスティバル/.exec(raceName)) {
            return 'FⅡ';
        }
        // raceNameに寺内大吉記念杯競輪が入っている場合、FⅠを返す
        if (/寺内大吉記念杯競輪/.exec(raceName)) {
            return 'FⅠ';
        }
        return raceGrade;
    }

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param raceEntityList
     */
    @Logger
    registerRaceEntityList(raceEntityList: KeirinRaceEntity[]): Promise<void> {
        console.debug(raceEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
