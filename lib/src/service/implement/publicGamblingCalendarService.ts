import 'reflect-metadata';
import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { CalendarData } from '../../domain/calendarData';
import { AutoraceRaceEntity } from '../../repository/entity/autoraceRaceEntity';
import { BoatraceRaceEntity } from '../../repository/entity/boatraceRaceEntity';
import { JraRaceEntity } from '../../repository/entity/jraRaceEntity';
import { KeirinRaceEntity } from '../../repository/entity/keirinRaceEntity';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import { SearchCalendarFilterEntity } from '../../repository/entity/searchCalendarFilterEntity';
import { WorldRaceEntity } from '../../repository/entity/worldRaceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { Logger } from '../../utility/logger';
import { ICalendarService } from '../interface/ICalendarService';

/**
 * Googleカレンダーとの連携機能を提供する基底サービスクラス
 *
 * このクラスは、各種競技のレース情報をGoogleカレンダーと
 * 同期するための共通機能を提供する抽象基底クラスです。主な責務：
 * - カレンダーイベントの取得
 * - イベントの作成・更新
 * - イベントの削除
 * - ロギングとエラーハンドリング
 *
 * 特徴：
 * - Google Calendar APIとの統合
 * - カレンダーイベントのライフサイクル管理
 * - バッチ処理による効率的な操作
 * - 詳細なロギング機能
 * @typeParam R - レースエンティティの型。IRaceEntityを実装している必要があります。
 *               このエンティティの情報がカレンダーイベントに変換されます。
 * @example
 * ```typescript
 * class MyCalendarService extends BaseCalendarService<MyRaceEntity> {
 *   protected calendarRepository = new MyCalendarRepository();
 * }
 * ```
 */
@injectable()
export class PublicGamblingCalendarService implements ICalendarService {
    public constructor(
        @inject('JraCalendarRepository')
        protected readonly jraCalendarRepository: ICalendarRepository<JraRaceEntity>,
        @inject('NarCalendarRepository')
        protected readonly narCalendarRepository: ICalendarRepository<NarRaceEntity>,
        @inject('KeirinCalendarRepository')
        protected readonly keirinCalendarRepository: ICalendarRepository<KeirinRaceEntity>,
        @inject('WorldCalendarRepository')
        protected readonly worldCalendarRepository: ICalendarRepository<WorldRaceEntity>,
        @inject('BoatraceCalendarRepository')
        protected readonly boatraceCalendarRepository: ICalendarRepository<BoatraceRaceEntity>,
        @inject('AutoraceCalendarRepository')
        protected readonly autoraceRaceCalendarRepository: ICalendarRepository<AutoraceRaceEntity>,
    ) {}
    /**
     * 指定された期間のカレンダーイベントを取得します
     *
     * このメソッドは、Googleカレンダーから指定された期間の
     * レース関連イベントを取得します。取得されたイベントは
     * アプリケーション固有のCalendarData形式に変換されます。
     * @param startDate - 取得開始日
     * @param finishDate - 取得終了日（この日を含む）
     * @param raceTypeList
     * @returns カレンダーイベントの配列
     * @throws カレンダーAPIとの通信エラーなど
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async fetchEvents(
        startDate: Date,
        finishDate: Date,
        raceTypeList: string[],
    ): Promise<CalendarData[]> {
        const searchFilter = new SearchCalendarFilterEntity(
            startDate,
            finishDate,
        );
        const calendarDataList: CalendarData[] = [];
        if (raceTypeList.includes('jra')) {
            calendarDataList.push(
                ...(await this.jraCalendarRepository.getEvents(searchFilter)),
            );
        }
        if (raceTypeList.includes('nar')) {
            calendarDataList.push(
                ...(await this.narCalendarRepository.getEvents(searchFilter)),
            );
        }
        if (raceTypeList.includes('keirin')) {
            calendarDataList.push(
                ...(await this.keirinCalendarRepository.getEvents(
                    searchFilter,
                )),
            );
        }
        if (raceTypeList.includes('world')) {
            calendarDataList.push(
                ...(await this.worldCalendarRepository.getEvents(searchFilter)),
            );
        }
        if (raceTypeList.includes('boatrace')) {
            calendarDataList.push(
                ...(await this.boatraceCalendarRepository.getEvents(
                    searchFilter,
                )),
            );
        }
        if (raceTypeList.includes('autorace')) {
            calendarDataList.push(
                ...(await this.autoraceRaceCalendarRepository.getEvents(
                    searchFilter,
                )),
            );
        }
        return calendarDataList;
    }

    /**
     * 指定されたカレンダーイベントを削除します
     *
     * このメソッドは、不要になったレースイベント（中止された
     * レースなど）をカレンダーから削除します。削除は完全な
     * 削除であり、元に戻すことはできません。
     *
     * 空の配列が渡された場合は早期リターンし、不要な
     * API呼び出しを防止します。
     * @param calendarDataList - 削除するカレンダーイベントの配列
     * @param calendarDataList.jra
     * @param calendarDataList.nar
     * @param calendarDataList.keirin
     * @param calendarDataList.world
     * @param calendarDataList.boatrace
     * @param calendarDataList.autorace
     * @throws カレンダーAPIとの通信エラーなど
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async deleteEvents(calendarDataList: {
        jra: CalendarData[];
        nar: CalendarData[];
        keirin: CalendarData[];
        world: CalendarData[];
        boatrace: CalendarData[];
        autorace: CalendarData[];
    }): Promise<void> {
        if (
            calendarDataList.jra.length === 0 &&
            calendarDataList.nar.length === 0 &&
            calendarDataList.keirin.length === 0 &&
            calendarDataList.world.length === 0 &&
            calendarDataList.boatrace.length === 0 &&
            calendarDataList.autorace.length === 0
        ) {
            console.debug('削除対象のイベントが見つかりませんでした。');
            return;
        }
        if (calendarDataList.jra.length > 0) {
            await this.jraCalendarRepository.deleteEvents(calendarDataList.jra);
        }
        if (calendarDataList.nar.length > 0) {
            await this.narCalendarRepository.deleteEvents(calendarDataList.nar);
        }
        if (calendarDataList.keirin.length > 0) {
            await this.keirinCalendarRepository.deleteEvents(
                calendarDataList.keirin,
            );
        }
        if (calendarDataList.world.length > 0) {
            await this.worldCalendarRepository.deleteEvents(
                calendarDataList.world,
            );
        }
        if (calendarDataList.boatrace.length > 0) {
            await this.boatraceCalendarRepository.deleteEvents(
                calendarDataList.boatrace,
            );
        }
        if (calendarDataList.autorace.length > 0) {
            await this.autoraceRaceCalendarRepository.deleteEvents(
                calendarDataList.autorace,
            );
        }
    }
}
