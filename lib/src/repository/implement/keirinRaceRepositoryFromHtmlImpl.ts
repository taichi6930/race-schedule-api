import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { KeirinRaceData } from '../../domain/keirinRaceData';
import { IKeirinRaceDataHtmlGateway } from '../../gateway/interface/iKeirinRaceDataHtmlGateway';
import {
    KeirinGradeType,
    KeirinRaceStage,
} from '../../utility/data/raceSpecific';
import { Logger } from '../../utility/logger';
import { KeirinPlaceEntity } from '../entity/keirinPlaceEntity';
import { KeirinRaceEntity } from '../entity/keirinRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';
import { FetchRaceListRequest } from '../request/fetchRaceListRequest';
import { RegisterRaceListRequest } from '../request/registerRaceListRequest';
import { FetchRaceListResponse } from '../response/fetchRaceListResponse';
import { RegisterRaceListResponse } from '../response/registerRaceListResponse';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class KeirinRaceRepositoryFromHtmlImpl
    implements IRaceRepository<KeirinRaceEntity, KeirinPlaceEntity>
{
    constructor(
        @inject('KeirinRaceDataHtmlGateway')
        private readonly keirinRaceDataHtmlGateway: IKeirinRaceDataHtmlGateway,
    ) {}
    /**
     * 競馬場開催データを取得する
     * @param request
     * @returns
     */
    @Logger
    async fetchRaceList(
        request: FetchRaceListRequest<KeirinPlaceEntity>,
    ): Promise<FetchRaceListResponse<KeirinRaceEntity>> {
        const keirinRaceDataList: KeirinRaceEntity[] = [];
        const placeList = request.placeDataList;
        console.log('placeList: ', placeList);
        if (placeList) {
            for (const place of placeList) {
                keirinRaceDataList.push(
                    ...(await this.fetchRaceListFromHtmlWithKeirinPlace(place)),
                );
                console.debug('1秒待ちます');
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.debug('1秒経ちました');
            }
        }
        return new FetchRaceListResponse(keirinRaceDataList);
    }

    @Logger
    async fetchRaceListFromHtmlWithKeirinPlace(
        placeEntity: KeirinPlaceEntity,
    ): Promise<KeirinRaceEntity[]> {
        try {
            const [year, month, day] = [
                placeEntity.placeData.dateTime.getFullYear(),
                placeEntity.placeData.dateTime.getMonth() + 1,
                placeEntity.placeData.dateTime.getDate(),
            ];
            const htmlText =
                await this.keirinRaceDataHtmlGateway.getRaceDataHtml(
                    placeEntity.placeData.dateTime,
                    placeEntity.placeData.location,
                );

            if (typeof htmlText !== 'string') {
                throw new Error('Expected htmlText to be a string');
            }
            const keirinRaceDataList: KeirinRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            // id="content"を取得
            const content = $('#content');
            const raceName =
                content
                    .find('h2')
                    .text()
                    .split('\n')
                    .filter((name) => name)[1] ??
                `${placeEntity.placeData.location}${placeEntity.placeData.grade}`;
            // class="section1"を取得
            const section1 = content.find('.section1');
            console.log(
                `raceInfo: ${year}/${month}/${day} ${placeEntity.placeData.location} ${placeEntity.placeData.grade} ${raceName}`,
            );
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
                        const raceGrade = this.extractRaceGrade(
                            raceName,
                            placeEntity.placeData.grade,
                            raceStage ?? '',
                            new Date(year, month - 1, day),
                        );
                        if (raceStage) {
                            const raceData = new KeirinRaceData(
                                raceName,
                                raceStage,
                                new Date(year, month - 1, day, hour, minute),
                                placeEntity.placeData.location,
                                raceGrade,
                                Number(raceNumber),
                            );
                            keirinRaceDataList.push(
                                new KeirinRaceEntity(null, raceData),
                            );
                        }
                    });
            });
            return keirinRaceDataList;
        } catch (e) {
            console.error('htmlを取得できませんでした', e);
            return [];
        }
    }
    private extractRaceStage(
        raceSummaryInfoChild: string,
    ): KeirinRaceStage | null {
        if (/Ｓ級ＧＰ/.exec(raceSummaryInfoChild)) {
            // KEIRINグランプリ
            return 'グランプリ';
        }
        if (/Ｌ級ＧＧＰ/.exec(raceSummaryInfoChild)) {
            // ガールズKEIRINグランプリ
            return 'ガールズグランプリ';
        }
        if (/ＳＡ混合ＹＧＰ/.exec(raceSummaryInfoChild)) {
            // ヤンググランプリ
            return 'ヤンググランプリ';
        }
        if (/Ｓ級ＳＴＲ/.exec(raceSummaryInfoChild)) {
            // 読売新聞社杯全日本選抜競輪
            return 'スタールビー賞';
        }
        if (/Ｓ級ＤＭＤ/.exec(raceSummaryInfoChild)) {
            // 競輪祭
            return 'ダイヤモンドレース';
        }
        if (/Ｓ級シャイ/.exec(raceSummaryInfoChild)) {
            return 'シャイニングスター賞';
        }
        if (/Ｓ級毘沙門/.exec(raceSummaryInfoChild)) {
            // ウィナーズカップ
            return '毘沙門天賞';
        }
        if (/Ｓ級一予/.exec(raceSummaryInfoChild)) {
            return '一次予選';
        }
        if (/Ｓ級特選予/.exec(raceSummaryInfoChild)) {
            return '特別選抜予選';
        }
        if (/Ｓ級特一般/.exec(raceSummaryInfoChild)) {
            return '特一般';
        }
        if (/Ｓ級二予/.exec(raceSummaryInfoChild)) {
            return '二次予選';
        }
        if (/Ｓ級準決勝/.exec(raceSummaryInfoChild)) {
            return '準決勝';
        }
        if (/Ｓ級特選/.exec(raceSummaryInfoChild)) {
            return '特選';
        }
        if (/Ｓ級選抜/.exec(raceSummaryInfoChild)) {
            return '選抜';
        }
        if (/Ｓ級一般/.exec(raceSummaryInfoChild)) {
            return '一般';
        }
        if (/Ｓ級特秀/.exec(raceSummaryInfoChild)) {
            return '特別優秀';
        }
        if (/Ｓ級優秀/.exec(raceSummaryInfoChild)) {
            return '優秀';
        }
        if (/Ｓ級決勝/.exec(raceSummaryInfoChild)) {
            return '決勝';
        }
        if (/Ｓ級初特選/.exec(raceSummaryInfoChild)) {
            return '初日特別選抜';
        }
        if (/Ｓ級西予二予/.exec(raceSummaryInfoChild)) {
            // 高松宮記念杯競輪
            return '西日本二次予選';
        }
        if (/Ｓ級西予[１２]/.exec(raceSummaryInfoChild)) {
            // 高松宮記念杯競輪
            return '西日本一次予選';
        }
        if (/Ｓ級東二予/.exec(raceSummaryInfoChild)) {
            // 高松宮記念杯競輪
            return '東日本二次予選';
        }
        if (/Ｓ級東予[１２]/.exec(raceSummaryInfoChild)) {
            // 高松宮記念杯競輪
            return '東日本一次予選';
        }
        if (/Ｓ級白虎賞/.exec(raceSummaryInfoChild)) {
            // 高松宮記念杯競輪
            return '白虎賞';
        }
        if (/Ｓ級青龍賞/.exec(raceSummaryInfoChild)) {
            // 高松宮記念杯競輪
            return '青龍賞';
        }
        if (/Ｓ級西準決/.exec(raceSummaryInfoChild)) {
            // 高松宮記念杯競輪
            return '西日本準決勝';
        }
        if (/Ｓ級東準決/.exec(raceSummaryInfoChild)) {
            // 高松宮記念杯競輪
            return '東日本準決勝';
        }
        if (/Ｓ級西特選/.exec(raceSummaryInfoChild)) {
            // 高松宮記念杯競輪
            return '西日本特別選抜予選';
        }
        if (/Ｓ級東特選/.exec(raceSummaryInfoChild)) {
            // 高松宮記念杯競輪
            return '東日本特別選抜予選';
        }
        if (/Ｓ級ＧＤＲ/.exec(raceSummaryInfoChild)) {
            // 日本選手権
            return 'ゴールデンレーサー賞';
        }
        if (/Ｓ級ＤＲＭ/.exec(raceSummaryInfoChild)) {
            // オールスター競輪
            return 'ドリームレース';
        }
        if (/Ｓ級ＯＲＩ/.exec(raceSummaryInfoChild)) {
            // オールスター競輪
            return 'オリオン賞';
        }
        if (/Ｓ級日競杯/.exec(raceSummaryInfoChild)) {
            // 寛仁親王牌・世界選手権記念トーナメント
            return '日本競輪選手会理事長杯';
        }
        if (/Ｓ級ローズ/.exec(raceSummaryInfoChild)) {
            // 寛仁親王牌・世界選手権記念トーナメント
            return 'ローズカップ';
        }
        if (/Ｓ級予選/.exec(raceSummaryInfoChild)) {
            return '予選';
        }
        if (/Ｓ級順位決/.exec(raceSummaryInfoChild)) {
            return '順位決定';
        }
        if (/Ｌ級ＤＲＭ/.exec(raceSummaryInfoChild)) {
            return 'ガールズドリームレース';
        }
        if (/Ｌ級ＡＲＴ/.exec(raceSummaryInfoChild)) {
            return 'ガールズアルテミス賞';
        }
        if (/Ｌ級ガ決勝/.exec(raceSummaryInfoChild)) {
            return 'ガールズ決勝';
        }
        if (/Ｌ級ティア/.exec(raceSummaryInfoChild)) {
            // オールガールズクラシック
            return 'ティアラカップ';
        }
        if (/Ｌ級ガ準決/.exec(raceSummaryInfoChild)) {
            return 'ガールズ準決勝';
        }
        if (/Ｌ級ガ予/.exec(raceSummaryInfoChild)) {
            return 'ガールズ予選';
        }
        if (/Ｌ級ガ特選/.exec(raceSummaryInfoChild)) {
            return 'ガールズ特選';
        }
        if (/Ｌ級ガ選抜/.exec(raceSummaryInfoChild)) {
            return 'ガールズ選抜';
        }
        if (/Ｌ級西ガ準/.exec(raceSummaryInfoChild)) {
            return 'ガールズ西日本準決勝';
        }
        if (/Ｌ級東ガ準/.exec(raceSummaryInfoChild)) {
            return 'ガールズ東日本準決勝';
        }
        if (/Ｌ級西ガ予/.exec(raceSummaryInfoChild)) {
            return 'ガールズ西日本予選';
        }
        if (/Ｌ級東ガ予/.exec(raceSummaryInfoChild)) {
            return 'ガールズ東日本予選';
        }
        if (/Ｌ級Ｇコレ/.exec(raceSummaryInfoChild)) {
            return 'ガールズコレクション';
        }
        if (/ＤＳ/.exec(raceSummaryInfoChild)) {
            return 'ダイナミックステージ';
        }
        if (/ＷＳ/.exec(raceSummaryInfoChild)) {
            return 'ワンダーステージ';
        }
        if (/ＳＰＲ/.exec(raceSummaryInfoChild)) {
            return 'スーパープロピストレーサー賞';
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
        if (raceStage === 'ヤンググランプリ') {
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
        // raceNameに寺内大吉記念杯競輪が入っている場合、FⅠを返す
        if (/寺内大吉記念杯競輪/.exec(raceName)) {
            return 'FⅠ';
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
        request: RegisterRaceListRequest<KeirinRaceEntity>,
    ): Promise<RegisterRaceListResponse> {
        console.debug(request);
        throw new Error('HTMLにはデータを登録しません');
    }
}
