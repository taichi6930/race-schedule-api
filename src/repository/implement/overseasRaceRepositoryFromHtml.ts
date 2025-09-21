import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { inject, injectable } from 'tsyringe';

import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { IRaceDataHtmlGateway } from '../../gateway/interface/iRaceDataHtmlGateway';
import { CommonParameter } from '../../utility/commonParameter';
import { processOverseasRaceName } from '../../utility/createRaceName';
import { Logger } from '../../utility/logger';
import type { UpsertResult } from '../../utility/upsertResult';
import { GradeType } from '../../utility/validateAndType/gradeType';
import {
    RaceCourse,
    validateRaceCourse,
} from '../../utility/validateAndType/raceCourse';
import { validateRaceDistance } from '../../utility/validateAndType/raceDistance';
import { RaceSurfaceType } from '../../utility/validateAndType/raceSurfaceType';
import { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import { PlaceEntity } from '../entity/placeEntity';
import { RaceEntity } from '../entity/raceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class OverseasRaceRepositoryFromHtml implements IRaceRepository {
    public constructor(
        @inject('RaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IRaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * @param commonParameter
     * @param searchRaceFilter
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
                ...(await this.fetchRaceListFromHtmlForOverseas(placeEntity)),
            );
            // HTML_FETCH_DELAY_MSの環境変数から遅延時間を取得
            const delayedTimeMs = Number.parseInt(
                commonParameter.env.HTML_FETCH_DELAY_MS || '1000',
            );
            console.debug(`待機時間: ${delayedTimeMs}ms`);
            await new Promise((resolve) => setTimeout(resolve, delayedTimeMs));
            console.debug('待機時間が経ちました');
        }
        return raceEntityList;
    }

    @Logger
    private async fetchRaceListFromHtmlForOverseas(
        placeEntity: PlaceEntity,
    ): Promise<RaceEntity[]> {
        const extractSurfaceType = (race: string[]): RaceSurfaceType => {
            const typeList = ['芝', 'ダート', '障害', 'AW'];
            const found = typeList.find((type) =>
                race.some((item) => item.includes(type)),
            );
            return found ?? '不明';
        };
        try {
            const htmlText = await this.raceDataHtmlGateway.getRaceDataHtml(
                placeEntity.placeData.raceType,
                placeEntity.placeData.dateTime,
            );
            const raceEntityList: RaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            const content = $('.racelist');
            // class="racelist__day"が複数あるのでeachで回す
            content.find('.racelist__day').each((__, element) => {
                // class="un-trigger"があればskipする
                if ($(element).find('.un-trigger').length > 0) {
                    return;
                }
                const dayElement = $(element);
                const dataTarget = dayElement.attr('data-target'); // data-target属性を取得
                const [year, month, day] = [
                    dataTarget?.slice(0, 4),
                    dataTarget?.slice(4, 6),
                    dataTarget?.slice(6, 8),
                ].map(Number);

                // 同じ日付になっているが、日本時間では日付がずれている場合があるのでそのための変数
                let recordHour = -1;
                let recordDay = 0;
                let recordPlace = '';
                let recordNumber = 0;

                $(dayElement)
                    .find('.racelist__race')
                    .each((_, raceElement) => {
                        try {
                            // classにnolinkがある場合はスキップ
                            if (
                                $(raceElement).find('.nolink').text().length > 0
                            ) {
                                return;
                            }

                            const rowRaceName = $(raceElement)
                                .find('.racelist__race__title')
                                .find('.name')
                                .text();

                            const location: RaceCourse = validateRaceCourse(
                                placeEntity.placeData.raceType,
                                $(raceElement)
                                    .find('.racelist__race__sub')
                                    .find('.course')
                                    .text()
                                    .trim(),
                            );
                            // 芝1600mのような文字列からsurfaceTypeを取得
                            // 芝、ダート、障害、AWがある
                            const surfaceTypeAndDistanceText = $(raceElement)
                                .find('.racelist__race__sub')
                                .find('.type')
                                .text()
                                .trim(); // テキストをトリムして不要な空白を削除

                            const surfaceType: string = extractSurfaceType(
                                ['芝', 'ダート', '障害', 'AW'].filter((type) =>
                                    surfaceTypeAndDistanceText.includes(type),
                                ),
                            );
                            const distanceMatch = /\d+/.exec(
                                surfaceTypeAndDistanceText,
                            );
                            const distance: number = validateRaceDistance(
                                distanceMatch ? Number(distanceMatch[0]) : -1,
                            );
                            const gradeText: string = rowRaceName.includes(
                                '（L）',
                            )
                                ? 'Listed'
                                : $(raceElement)
                                      .find('.racelist__race__title')
                                      .find('.grade')
                                      .find('span')
                                      .text()
                                      .replace('G1', 'GⅠ')
                                      .replace('G2', 'GⅡ')
                                      .replace('G3', 'GⅢ');
                            const grade: GradeType =
                                gradeText === '' ? '格付けなし' : gradeText;

                            // timeは<span class="time">23:36発走</span>の"23:36"を取得
                            const timeText = $(raceElement)
                                .find('.racelist__race__sub')
                                .find('.time')
                                .text()
                                .trim();

                            const timeMatch = /\d{2}:\d{2}/.exec(timeText);
                            const time = timeMatch ? timeMatch[0] : '';
                            const [hour, minute] = time.split(':').map(Number);

                            // 競馬場が異なる場合はrecordDayをリセット
                            if (recordPlace !== location) {
                                recordHour = -1;
                                recordDay = 0;
                                recordNumber = 0;
                            }
                            recordPlace = location;

                            // 日付が変わっているのでrecordDayを増やす
                            if (recordHour > hour) {
                                recordDay++;
                            }
                            recordHour = hour;

                            recordNumber++;
                            const number = recordNumber;
                            const raceDate = new Date(
                                year,
                                month - 1,
                                day + recordDay,
                                hour,
                                minute,
                            );

                            const raceName = processOverseasRaceName({
                                name: rowRaceName,
                                location,
                                grade,
                                date: raceDate,
                                surfaceType,
                                distance,
                            });
                            raceEntityList.push(
                                RaceEntity.createWithoutId(
                                    RaceData.create(
                                        placeEntity.placeData.raceType,
                                        raceName,
                                        raceDate,
                                        location,
                                        grade,
                                        number,
                                    ),
                                    undefined, // heldDayData は未指定
                                    HorseRaceConditionData.create(
                                        surfaceType,
                                        distance,
                                    ),
                                    undefined, // stage は未指定
                                    undefined, // racePlayerDataList は未指定
                                ),
                            );
                        } catch (error) {
                            console.error(
                                'レースデータ加工中にエラーが発生しました',
                                error,
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

    @Logger
    /**
     * レースデータを登録する
     * HTMLリポジトリはDB書き込みを行わないため、デフォルト結果を返す
     */
    public async upsertRaceEntityList(
        _commonParameter: CommonParameter,
        _entityList: RaceEntity[],
    ): Promise<UpsertResult> {
        void _commonParameter;
        void _entityList;
        return { successCount: 0, failureCount: 0, failures: [] };
    }
}
