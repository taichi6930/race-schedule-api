import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { WorldRaceData } from '../../domain/worldRaceData';
import { IWorldRaceDataHtmlGateway } from '../../gateway/interface/iWorldRaceDataHtmlGateway';
import { WorldGradeType } from '../../utility/data/world/worldGradeType';
import {
    validateWorldRaceCourse,
    WorldRaceCourse,
} from '../../utility/data/world/worldRaceCourse';
import { validateWorldRaceCourseType } from '../../utility/data/world/worldRaceCourseType';
import { validateWorldRaceDistance } from '../../utility/data/world/worldRaceDistance';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { processWorldRaceName } from '../../utility/raceName';
import { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import { WorldPlaceEntity } from '../entity/worldPlaceEntity';
import { WorldRaceEntity } from '../entity/worldRaceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class WorldRaceRepositoryFromHtmlImpl
    implements IRaceRepository<WorldRaceEntity, WorldPlaceEntity>
{
    constructor(
        @inject('WorldRaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IWorldRaceDataHtmlGateway,
    ) {}

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<WorldPlaceEntity>,
    ): Promise<WorldRaceEntity[]> {
        const monthList: Date[] = await this.generateMonthList(
            searchFilter.startDate,
            searchFilter.finishDate,
        );
        const worldRaceDataList: WorldRaceEntity[] = [];
        for (const month of monthList) {
            worldRaceDataList.push(
                ...(await this.fetchRaceListFromHtml(month)),
            );
            console.debug('0.8秒待ちます');
            await new Promise((resolve) => setTimeout(resolve, 800));
            console.debug('0.8秒経ちました');
        }
        return worldRaceDataList;
    }

    /**
     * ターゲットの月リストを生成する
     *startDateからfinishDateまでの月のリストを生成する
     * @param startDate
     * @param finishDate
     */
    @Logger
    private generateMonthList(
        startDate: Date,
        finishDate: Date,
    ): Promise<Date[]> {
        const monthList: Date[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= finishDate) {
            monthList.push(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            );
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        console.debug(
            `月リストを生成しました: ${monthList.map((month) => formatDate(month, 'yyyy-MM-dd')).join(', ')}`,
        );
        return Promise.resolve(monthList);
    }

    @Logger
    async fetchRaceListFromHtml(date: Date): Promise<WorldRaceEntity[]> {
        try {
            const htmlText =
                await this.raceDataHtmlGateway.getRaceDataHtml(date);
            const worldRaceDataList: WorldRaceEntity[] = [];
            const $ = cheerio.load(htmlText);
            const content = $('.racelist');
            // class="racelist__day"が複数あるのでeachで回す
            content.find('.racelist__day').each((index, element) => {
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

                            const location: WorldRaceCourse =
                                validateWorldRaceCourse(
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

                            const surfaceType: string =
                                validateWorldRaceCourseType(
                                    ['芝', 'ダート', '障害', 'AW'].find(
                                        (type) =>
                                            surfaceTypeAndDistanceText.includes(
                                                type,
                                            ),
                                    ) ?? '',
                                );
                            const distanceMatch = /\d+/.exec(
                                surfaceTypeAndDistanceText,
                            );
                            const distance: number = validateWorldRaceDistance(
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
                            const grade: WorldGradeType =
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
                            const date = new Date(
                                year,
                                month - 1,
                                day + recordDay,
                                hour,
                                minute,
                            );

                            const raceName = processWorldRaceName({
                                name: rowRaceName,
                                place: location,
                                grade: grade,
                                date: date,
                                surfaceType: surfaceType,
                                distance: distance,
                            });
                            worldRaceDataList.push(
                                WorldRaceEntity.createWithoutId(
                                    WorldRaceData.create(
                                        raceName,
                                        date,
                                        location,
                                        surfaceType,
                                        distance,
                                        grade,
                                        number,
                                    ),
                                    getJSTDate(new Date()),
                                ),
                            );
                        } catch (e) {
                            console.error(
                                'レースデータ加工中にエラーが発生しました',
                                e,
                            );
                        }
                    });
            });
            return worldRaceDataList;
        } catch (e) {
            console.error('htmlを取得できませんでした', e);
            return [];
        }
    }

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param raceEntityList
     */
    @Logger
    registerRaceEntityList(raceEntityList: WorldRaceEntity[]): Promise<void> {
        console.debug(raceEntityList);
        throw new Error('HTMLにはデータを登録出来ません');
    }
}
