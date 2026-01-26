import { inject, injectable } from 'tsyringe';

import type { IPlaceService } from '../service/interface/IPlaceService';
import type { IPlaceUsecase } from './interface/IPlaceUsecase';

@injectable()
export class PlaceUsecase implements IPlaceUsecase {
    public constructor(
        @inject('PlaceService')
        private readonly placeService: IPlaceService,
    ) {}

    public async getAllPlaces(raceType: string, date: Date): Promise<any[]> {
        // raceTypeは本来enum型だが、ここではstringで受けてserviceで変換する想定
        return this.placeService.fetch(raceType as any, date);
    }

    // api互換: filter引数で日付範囲・raceTypeList・locationListを受けて配列返却
    public async fetch(filter: {
        startDate: Date;
        finishDate: Date;
        raceTypeList: string[];
        locationList?: string[];
    }): Promise<any[]> {
        const { startDate, finishDate, raceTypeList } = filter;
        const results: any[] = [];
        for (const raceType of raceTypeList) {
            if (raceType === 'JRA') {
                // 年単位で取得
                const startYear = startDate.getFullYear();
                const endYear = finishDate.getFullYear();
                for (let year = startYear; year <= endYear; year++) {
                    const d = new Date(year, 0, 1);
                    const res = await this.getAllPlaces(raceType, d);
                    results.push(...res);
                }
            } else if (
                raceType === 'NAR' ||
                raceType === 'OVERSEAS' ||
                raceType === 'KEIRIN' ||
                raceType === 'AUTORACE' ||
                raceType === 'BOATRACE'
            ) {
                // 月単位で取得
                const d = new Date(
                    startDate.getFullYear(),
                    startDate.getMonth(),
                    1,
                );
                const end = new Date(
                    finishDate.getFullYear(),
                    finishDate.getMonth(),
                    1,
                );
                while (d <= end) {
                    const res = await this.getAllPlaces(raceType, new Date(d));
                    results.push(...res);
                    d.setMonth(d.getMonth() + 1);
                }
            } else {
                // デフォルト:日単位
                for (
                    let d = new Date(startDate);
                    d <= finishDate;
                    d.setDate(d.getDate() + 1)
                ) {
                    const res = await this.getAllPlaces(raceType, new Date(d));
                    results.push(...res);
                }
            }
        }
        return results;
    }
}
