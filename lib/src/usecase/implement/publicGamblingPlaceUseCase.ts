import { inject, injectable } from 'tsyringe';

import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { BoatracePlaceData } from '../../domain/boatracePlaceData';
import { JraPlaceData } from '../../domain/jraPlaceData';
import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { NarPlaceData } from '../../domain/narPlaceData';
import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import { BoatracePlaceEntity } from '../../repository/entity/boatracePlaceEntity';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import { NarPlaceEntity } from '../../repository/entity/narPlaceEntity';
import type { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

/**
 * 公開用開催場データユースケース（JRA/NAR共通）
 * 期間拡張ロジックを注入することで、JRA/NAR両方に対応
 */
@injectable()
export class PublicGamblingPlaceUseCase implements IPlaceDataUseCase {
    public constructor(
        @inject('JraPlaceDataService')
        private readonly jraPlaceDataService: IPlaceDataService<JraPlaceEntity>,
        @inject('NarPlaceDataService')
        private readonly narPlaceDataService: IPlaceDataService<NarPlaceEntity>,
        @inject('KeirinPlaceDataService')
        private readonly keirinPlaceDataService: IPlaceDataService<KeirinPlaceEntity>,
        @inject('AutoracePlaceDataService')
        private readonly autoracePlaceDataService: IPlaceDataService<AutoracePlaceEntity>,
        @inject('BoatracePlaceDataService')
        private readonly boatracePlaceDataService: IPlaceDataService<BoatracePlaceEntity>,
    ) {}

    /**
     * 開催場データを取得する
     * @param startDate
     * @param finishDate
     * @param raceTypeList
     */
    @Logger
    public async fetchPlaceDataList(
        startDate: Date,
        finishDate: Date,
        raceTypeList: string[],
    ): Promise<
        | JraPlaceData[]
        | NarPlaceData[]
        | KeirinPlaceData[]
        | AutoracePlaceData[]
        | BoatracePlaceData[]
    > {
        const placeEntityList: (
            | JraPlaceEntity
            | NarPlaceEntity
            | KeirinPlaceEntity
            | AutoracePlaceEntity
            | BoatracePlaceEntity
        )[] = [];
        if (raceTypeList.includes('jra')) {
            const jraPlaceEntityList: JraPlaceEntity[] =
                await this.jraPlaceDataService.fetchPlaceEntityList(
                    startDate,
                    finishDate,
                    DataLocation.Storage,
                );
            placeEntityList.push(...jraPlaceEntityList);
        }
        if (raceTypeList.includes('nar')) {
            const narPlaceEntityList: NarPlaceEntity[] =
                await this.narPlaceDataService.fetchPlaceEntityList(
                    startDate,
                    finishDate,
                    DataLocation.Storage,
                );
            placeEntityList.push(...narPlaceEntityList);
        }
        if (raceTypeList.includes('keirin')) {
            const keirinPlaceEntityList: KeirinPlaceEntity[] =
                await this.keirinPlaceDataService.fetchPlaceEntityList(
                    startDate,
                    finishDate,
                    DataLocation.Storage,
                );
            placeEntityList.push(...keirinPlaceEntityList);
        }
        if (raceTypeList.includes('autorace')) {
            const autoracePlaceEntityList: AutoracePlaceEntity[] =
                await this.autoracePlaceDataService.fetchPlaceEntityList(
                    startDate,
                    finishDate,
                    DataLocation.Storage,
                );
            placeEntityList.push(...autoracePlaceEntityList);
        }
        if (raceTypeList.includes('boatrace')) {
            const boatracePlaceEntityList: BoatracePlaceEntity[] =
                await this.boatracePlaceDataService.fetchPlaceEntityList(
                    startDate,
                    finishDate,
                    DataLocation.Storage,
                );
            placeEntityList.push(...boatracePlaceEntityList);
        }
        // 全ての開催場データを結合して返す
        // それぞれのplaceDataを抽出して返す
        return placeEntityList.map(({ placeData }) => placeData);
    }

    /**
     * 開催場データを更新する
     */
    @Logger
    public async updatePlaceDataList(): Promise<void> {
        throw new Error('Not implemented');
        await Promise.resolve();
    }
}
