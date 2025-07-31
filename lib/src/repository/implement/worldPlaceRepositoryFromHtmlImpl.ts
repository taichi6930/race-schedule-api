import 'reflect-metadata';

import * as cheerio from 'cheerio';
import { formatDate } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { WorldPlaceData } from '../../domain/worldPlaceData';
import { IWorldPlaceDataHtmlGateway } from '../../gateway/interface/iWorldPlaceDataHtmlGateway';
import {
    validateWorldRaceCourse,
    WorldRaceCourse,
} from '../../utility/data/world/worldRaceCourse';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { WorldPlaceEntity } from '../entity/worldPlaceEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

/**
 * 競馬場開催データリポジトリの実装
 */
@injectable()
export class WorldPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<WorldPlaceEntity>
{
    public constructor(
        @inject('WorldPlaceDataHtmlGateway')
        private readonly placeDataHtmlGateway: IWorldPlaceDataHtmlGateway,
    ) {}

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     * @param placeEntityList
     */
    @Logger
    public async registerPlaceEntityList(
        placeEntityList: WorldPlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }

    /**
     * 開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<WorldPlaceEntity[]> {
        const monthList: Date[] = this.generateMonthList(
            searchFilter.startDate,
            searchFilter.finishDate,
        );
        const worldPlaceDataList: WorldPlaceEntity[] = [];
        for (const month of monthList) {
            worldPlaceDataList.push(
                ...(await this.fetchPlaceListFromHtml(month)),
            );
            console.debug('0.8秒待ちます');
            await new Promise((resolve) => setTimeout(resolve, 800));
            console.debug('0.8秒経ちました');
        }
        return worldPlaceDataList;
    }

    /**
     * ターゲットの月リストを生成する
     *startDateからfinishDateまでの月のリストを生成する
     * @param startDate
     * @param finishDate
     */
    private generateMonthList(startDate: Date, finishDate: Date): Date[] {
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
        return monthList;
    }

    @Logger
    public async fetchPlaceListFromHtml(
        date: Date,
    ): Promise<WorldPlaceEntity[]> {
        try {
            const htmlText =
                await this.placeDataHtmlGateway.getPlaceDataHtml(date);
            const worldPlaceDataList: WorldPlaceEntity[] = [];
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

                            const location: WorldRaceCourse =
                                validateWorldRaceCourse(
                                    $(raceElement)
                                        .find('.racelist__race__sub')
                                        .find('.course')
                                        .text()
                                        .trim(),
                                );

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
                            }
                            recordPlace = location;

                            // 日付が変わっているのでrecordDayを増やす
                            if (recordHour > hour) {
                                recordDay++;
                            }
                            recordHour = hour;

                            const raceDate = new Date(
                                year,
                                month - 1,
                                day + recordDay,
                                hour,
                                minute,
                            );

                            worldPlaceDataList.push(
                                WorldPlaceEntity.createWithoutId(
                                    WorldPlaceData.create(raceDate, location),
                                    getJSTDate(new Date()),
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
            // 重複していると思うので、raceDateとlocationで重複分を取り除く
            return worldPlaceDataList.filter(
                (item, index, self) =>
                    index ===
                    self.findIndex(
                        (e) =>
                            e.placeData.dateTime.getTime() ===
                                item.placeData.dateTime.getTime() &&
                            e.placeData.location === item.placeData.location,
                    ),
            );
        } catch (error) {
            console.error('htmlを取得できませんでした', error);
            return [];
        }
    }
}
