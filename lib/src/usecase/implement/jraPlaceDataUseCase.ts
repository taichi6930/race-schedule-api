import { inject, injectable } from 'tsyringe';

import { JraPlaceData } from '../../domain/jraPlaceData';
import { JraPlaceEntity } from '../../repository/entity/jraPlaceEntity';
import { IPlaceDataService } from '../../service/interface/IPlaceDataService';
import { DataLocation } from '../../utility/dataType';
import { Logger } from '../../utility/logger';
import { IPlaceDataUseCase } from '../interface/IPlaceDataUseCase';

/**
 * JRAの開催場所データを管理するユースケース
 *
 * このクラスは以下の機能を提供します：
 * - 指定された期間の開催場所データの取得
 * - 開催場所データの更新（Webから最新データを取得）
 *
 * データの取得元は2種類あります：
 * - Storage: 保存済みのデータから取得（高速）
 * - Web: JRAのWebサイトから直接取得（最新）
 */
@injectable()
export class JraPlaceDataUseCase implements IPlaceDataUseCase<JraPlaceData> {
    public constructor(
        @inject('JraPlaceDataService')
        private readonly placeDataService: IPlaceDataService<JraPlaceEntity>,
    ) {}

    /**
     * 指定された期間の開催場所データを取得します
     *
     * このメソッドはStorageから保存済みのデータを取得します。
     * データが存在しない場合は空の配列を返します。
     *
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @returns JRA開催場所データの配列。開催がない場合は空の配列を返します。
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async fetchPlaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<JraPlaceData[]> {
        const placeEntityList: JraPlaceEntity[] =
            await this.placeDataService.fetchPlaceEntityList(
                startDate,
                finishDate,
                DataLocation.Storage,
            );
        return placeEntityList.map(({ placeData }) => placeData);
    }

    /**
     * 開催場所データを最新の情報に更新します
     *
     * このメソッドは以下の処理を行います：
     * 1. 指定された期間を年単位に拡張（より効率的なデータ取得のため）
     *    - 開始日は年初（1月1日）に設定
     *    - 終了日は年末（12月31日）に設定
     * 2. JRAのWebサイトから最新データを取得
     * 3. 取得したデータでStorageを更新
     *
     * @param startDate - 更新対象期間の開始日
     * @param finishDate - 更新対象期間の終了日（この日を含む）
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async updatePlaceDataList(
        startDate: Date,
        finishDate: Date,
    ): Promise<void> {
        // startDateは年の1日に設定する
        const modifyStartDate = new Date(startDate.getFullYear(), 0, 1);
        // finishDateは年の最終日に設定する
        const modifyFinishDate = new Date(finishDate.getFullYear() + 1, 0, 0);
        const placeEntityList: JraPlaceEntity[] =
            await this.placeDataService.fetchPlaceEntityList(
                modifyStartDate,
                modifyFinishDate,
                DataLocation.Web,
            );

        await this.placeDataService.updatePlaceEntityList(placeEntityList);
    }
}
