import 'reflect-metadata';
import '../../utility/format';

import { IRaceEntity } from '../../repository/entity/iRaceEntity';
import { ICalendarRepository } from '../../repository/interface/ICalendarRepository';
import { Logger } from '../../utility/logger';
import { IOldCalendarService } from '../interface/IOldCalendarService';

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
export abstract class BaseCalendarService<R extends IRaceEntity<R>>
    implements IOldCalendarService<R>
{
    protected abstract calendarRepository: ICalendarRepository<R>;
    /**
     * レース情報をカレンダーイベントとして登録・更新します
     *
     * このメソッドは、レースエンティティの情報をGoogleカレンダーの
     * イベントとして同期します。既存のイベントは更新され、
     * 新しいレースは新規イベントとして作成されます。
     *
     * 空の配列が渡された場合は早期リターンし、不要な
     * API呼び出しを防止します。
     * @param raceEntityList - 登録・更新するレースエンティティの配列
     * @throws カレンダーAPIとの通信エラーなど
     * @remarks Loggerデコレータにより、処理の開始・終了・エラーが自動的にログに記録されます
     */
    @Logger
    public async upsertEvents(raceEntityList: R[]): Promise<void> {
        if (raceEntityList.length === 0) {
            console.debug('更新対象のイベントが見つかりませんでした。');
            return;
        }
        await this.calendarRepository.upsertEvents(raceEntityList);
    }
}
