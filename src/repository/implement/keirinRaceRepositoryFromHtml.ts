import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { RaceData } from '../../domain/raceData';
import { RacePlayerData } from '../../domain/racePlayerData';
import { IRaceDataHtmlGateway } from '../../gateway/interface/iRaceDataHtmlGateway';
import { CommonParameter } from '../../utility/commonParameter';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { UpsertResult } from '../../utility/upsertResult';
import { GradeType } from '../../utility/validateAndType/gradeType';
import { RaceStage, StageMap } from '../../utility/validateAndType/raceStage';
import { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import { PlaceEntity } from '../entity/placeEntity';
import { RaceEntity } from '../entity/raceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * 競輪場開催データリポジトリの実装
 */
@injectable()
export class KeirinRaceRepositoryFromHtml implements IRaceRepository {
    public constructor(
        @inject('RaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IRaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * @param commonParameter
     * @param searchRaceFilter
     * @param searchFilter
     * @param placeEntityList
     */
    @Logger
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        placeEntityList?: PlaceEntity[],
    ): Promise<RaceEntity[]> {
        const raceEntityList: RaceEntity[] = [];
        if (!placeEntityList) return raceEntityList;

        for (const placeEntity of placeEntityList) {
            raceEntityList.push(
                ...(await this.fetchRaceListFromHtml(placeEntity)),
            );
            // HTML_FETCH_DELAY_MSの環境変数から遅延時間を取得
            const delayedTimeMs = 1000;
            console.debug(`待機時間: ${delayedTimeMs}ms`);
            await new Promise((resolve) => setTimeout(resolve, delayedTimeMs));
            console.debug('待機時間が経ちました');
        }
        return raceEntityList;
    }

    @Logger
    private async fetchRaceListFromHtml(
        placeEntity: PlaceEntity,
    ): Promise<RaceEntity[]> {
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
            const raceEntityList: RaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            // id="content"を取得
            const content = $('#content');
            const seriesRaceName = (
                content.find('h2').text().split('\n').filter(Boolean)[1] ??
                `${placeEntity.placeData.location}${placeEntity.grade}`
            )
                .replaceFromCodePoint(/[！-～]/g)
                .replaceFromCodePoint(/[０-９Ａ-Ｚａ-ｚ]/g);
            // class="section1"を取得
            const section1 = content.find('.section1');
            section1.each((_, section1Element) => {
                // class="w480px"を取得
                $(section1Element)
                    .find('.w480px')
                    .each((__, element) => {
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
                            placeEntity.grade,
                            raceStage ?? '',
                            new Date(year, month - 1, day),
                        );
                        const racePlayerDataList: RacePlayerData[] = [];
                        // tableを取得
                        const table = $(element).find('table');
                        // class="bg-1-pl", "bg-2-pl"..."bg-9-pl"を取得
                        Array.from({ length: 9 }, (___, i) => i + 1) // 1から9までの配列を作成
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
                                        RacePlayerData.create(
                                            placeEntity.placeData.raceType,
                                            Number(positionNumber),
                                            Number(playerNumber),
                                        ),
                                    );
                                }
                            });
                        const raceData =
                            raceStage === null
                                ? null
                                : RaceData.create(
                                      placeEntity.placeData.raceType,
                                      raceName,
                                      new Date(
                                          year,
                                          month - 1,
                                          day,
                                          hour,
                                          minute,
                                      ),
                                      placeEntity.placeData.location,
                                      raceGrade,
                                      Number(raceNumber),
                                  );
                        if (
                            raceData != null &&
                            racePlayerDataList.length > 0 &&
                            raceStage != null
                        ) {
                            raceEntityList.push(
                                RaceEntity.createWithoutId(
                                    raceData,
                                    undefined, // heldDayDataは未設定
                                    undefined, // conditionDataは未設定
                                    raceStage,
                                    racePlayerDataList,
                                ),
                            );
                        }
                    });
            });
            return raceEntityList;
        } catch (error) {
            console.error('HTMLの取得に失敗しました', error);
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
        if (
            raceSummaryInfoChild.includes('競輪祭') &&
            raceStage.includes('ガールズ')
        ) {
            return '競輪祭女子王座戦';
        }
        // raceNameに高松宮記念杯が含まれているかつ
        // raceStageがガールズが含まれている場合、
        // raceNameを「パールカップ」にする
        if (
            raceSummaryInfoChild.includes('高松宮記念杯') &&
            raceStage.includes('ガールズ')
        ) {
            return 'パールカップ';
        }
        // raceNameにオールスター競輪が含まれている場合かつ
        // raceStageにガールズが含まれている場合、
        // raceNameを「女子オールスター競輪」にする
        if (
            raceSummaryInfoChild.includes('オールスター競輪') &&
            raceStage.includes('ガールズ')
        ) {
            return '女子オールスター競輪';
        }
        // raceNameにサマーナイトフェスティバルが含まれている場合、
        // raceStageに「ガールズ」が含まれている場合、
        // raceNameを「ガールズケイリンフェスティバル」にする
        if (
            raceSummaryInfoChild.includes('サマーナイトフェスティバル') &&
            raceStage.includes('ガールズ')
        ) {
            return 'ガールズケイリンフェスティバル';
        }
        // raceNameにKEIRINグランプリが含まれている場合、
        // raceStageに「グランプリ」が含まれていなかったら、
        // raceNameを「寺内大吉記念杯競輪」にする
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
        // raceStageが「ヤンググランプリ」の場合、GⅡを返す
        if (raceStage === 'SA混合ヤンググランプリ') {
            return 'GⅡ';
        }
        // raceNameに女子オールスター競輪が入っている場合、2024年であればFⅡ、2025年以降であればGⅠを返す
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
        // raceNameにサマーナイトフェスティバルが入っている場合、raceStageが「ガールズ」が含まれている場合、FⅡを返す
        if (
            raceName.includes('サマーナイトフェスティバル') &&
            raceStage.includes('ガールズ')
        ) {
            return 'FⅡ';
        }
        if (raceName.includes('ガールズケイリンフェスティバル')) {
            return 'FⅡ';
        }
        // raceNameに寺内大吉記念杯競輪が入っている場合、FⅠを返す
        if (raceName.includes('寺内大吉記念杯競輪')) {
            return 'FⅠ';
        }
        return raceGrade;
    }

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param _commonParameter - unused
     * @param _entityList - unused
     */
    @Logger
    public async upsertRaceEntityList(
        _commonParameter: CommonParameter,
        _entityList: RaceEntity[],
    ): Promise<UpsertResult> {
        void _commonParameter;
        void _entityList;
        return { successCount: 0, failureCount: 0, failures: [] };
    }
}
