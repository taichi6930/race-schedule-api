import { inject, injectable } from 'tsyringe';

import type { RaceService } from '../service/raceService';

@injectable()
export class RaceUsecase {
    public constructor(
        @inject('RaceService')
        private readonly raceService: RaceService,
    ) {}

    /**
     * 指定した条件でレースデータを取得
     * @param filter - 検索フィルタ
     * @returns レースエンティティの配列
     */
    public async fetch(filter: {
        startDate: Date;
        finishDate: Date;
        raceTypeList: string[];
        locationList?: string[];
        gradeList?: string[];
    }): Promise<any[]> {
        const { startDate, finishDate, raceTypeList, locationList } = filter;
        const results: any[] = [];

        // locationListが指定されている場合は、その開催場のみ取得
        // 指定されていない場合は、全開催場を対象とする（実装によって異なる）
        // ここでは、locationListが必須と仮定

        if (!locationList || locationList.length === 0) {
            console.warn(
                'locationListが指定されていません。レース取得には開催場情報が必要です。',
            );
            return results;
        }

        for (const raceType of raceTypeList) {
            for (const location of locationList) {
                // 日付範囲でループ
                for (
                    let d = new Date(startDate);
                    d <= finishDate;
                    d.setDate(d.getDate() + 1)
                ) {
                    try {
                        // JRAとBOATRACEの場合は、レース番号ごとに取得する必要があるが、
                        // ここではシンプルに全レースを一度に取得する方式とする
                        const res = await this.raceService.fetch(
                            raceType as any,
                            new Date(d),
                            location,
                        );
                        if (Array.isArray(res)) {
                            results.push(...res);
                        } else if (res) {
                            results.push(res);
                        }
                    } catch (error) {
                        console.error(
                            `Failed to fetch race: ${raceType} ${location} ${d}`,
                            error,
                        );
                        // エラーが発生しても処理を継続
                    }
                }
            }
        }

        return results;
    }
}
