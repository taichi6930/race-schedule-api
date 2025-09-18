import type { calendar_v3 } from 'googleapis';

import { formatDate } from '../../../../src/utility/format';
import type { RaceType } from '../../../../src/utility/raceType';
import { RACE_TYPE_LIST_ALL_FOR_AWS } from '../../../../src/utility/raceType';
import {
    generateId,
    IdType,
} from '../../../../src/utility/validateAndType/idUtility';
import { defaultLocation } from '../../../../test/unittest/src/mock/common/baseCommonData';
import { allowedEnvs, ENV } from '../../utility/env';

/**
 * Googleカレンダーとの連携を担当するゲートウェイインターフェース
 *
 * このインターフェースは、レース開催情報をGoogleカレンダーのイベントとして
 * 管理するための機能を提供します。主な責務：
 * - カレンダーイベントの取得（一括・個別）
 * - イベントの作成・更新
 * - イベントの削除
 *
 * 特徴：
 * - Google Calendar API v3を使用
 * - イベントの一意識別子（eventId）による管理
 * - バッチ処理による効率的な操作
 * - APIレート制限への対応
 *
 * 注意事項：
 * - APIの呼び出し回数に制限があります
 * - 認証情報の適切な管理が必要です
 * - タイムゾーンの正確な処理が重要です
 */
interface ICalendarGatewayForAWS {
    /**
     * 指定された期間のカレンダーイベントを一括取得します
     *
     * このメソッドは以下の処理を行います：
     * 1. 指定された期間のイベントをクエリ
     * 2. ページネーション処理による全イベントの取得
     * 3. タイムゾーンの正規化
     * @param raceType - レース種別
     * @param startDate - 取得開始日（この日を含む）
     * @param finishDate - 取得終了日（この日を含む）
     * @returns イベントオブジェクトの配列。イベントが存在しない場合は空配列
     * @throws Error 以下の場合にエラーが発生：
     *               - API呼び出しに失敗
     *               - レート制限に到達
     *               - 認証/認可エラー
     */
    fetchCalendarDataList: (
        raceType: RaceType,
        startDate: Date,
        finishDate: Date,
    ) => Promise<calendar_v3.Schema$Event[]>;

    /**
     * 指定されたIDのカレンダーイベントを取得します
     *
     * このメソッドは、個別のイベントの詳細情報が必要な場合に使用します。
     * イベントが存在しない場合はエラーとなります。
     * @param raceType - レース種別
     * @param eventId - 取得するイベントの一意識別子
     * @returns イベントオブジェクト
     * @throws Error 以下の場合にエラーが発生：
     *               - 指定されたイベントが存在しない
     *               - API呼び出しに失敗
     *               - 認証/認可エラー
     */
    fetchCalendarData: (
        raceType: RaceType,
        eventId: string,
    ) => Promise<calendar_v3.Schema$Event>;

    /**
     * 既存のカレンダーイベントを更新します
     *
     * このメソッドは既存のイベントの内容を更新します。
     * イベントが存在しない場合はエラーとなります。
     *
     * 更新可能な主な項目：
     * - イベントのタイトル
     * - 開始・終了日時
     * - 場所情報
     * - イベントの説明
     * @param raceType - レース種別
     * @param calendarData - 更新するイベントの完全なデータ
     * eventIdを含む必要があります
     * @throws Error 以下の場合にエラーが発生：
     *               - 指定されたイベントが存在しない
     *               - データの形式が不正
     *               - API呼び出しに失敗
     *               - 認証/認可エラー
     */
    updateCalendarData: (
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ) => Promise<void>;

    /**
     * 新しいカレンダーイベントを作成します
     *
     * このメソッドは、レース開催情報を新しいイベントとして
     * カレンダーに追加します。
     *
     * イベントデータに含める必要がある項目：
     * - イベントのタイトル（必須）
     * - 開始日時（必須）
     * - 終了日時（必須）
     * - 場所情報（推奨）
     * - イベントの説明（推奨）
     * @param raceType - レース種別
     * @param calendarData - 作成するイベントのデータ
     * eventIdは指定しないでください
     * @throws Error 以下の場合にエラーが発生：
     *               - 必須項目が不足
     *               - データの形式が不正
     *               - API呼び出しに失敗
     *               - 認証/認可エラー
     */
    insertCalendarData: (
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ) => Promise<void>;

    /**
     * 指定されたカレンダーイベントを削除します
     *
     * このメソッドは、不要になったイベントをカレンダーから
     * 完全に削除します。この操作は取り消すことができません。
     *
     * 主な使用ケース：
     * - レースが中止になった場合
     * - イベント情報が誤っていた場合
     * - 重複したイベントを整理する場合
     * @param raceType - レース種別
     * @param eventId - 削除するイベントの一意識別子
     * @throws Error 以下の場合にエラーが発生：
     *               - 指定されたイベントが存在しない
     *               - API呼び出しに失敗
     *               - 認証/認可エラー
     */
    deleteCalendarData: (raceType: RaceType, eventId: string) => Promise<void>;
}

/**
 * Googleカレンダーのモックサービス
 */
export class MockGoogleCalendarGateway implements ICalendarGatewayForAWS {
    public constructor() {
        this.setCalendarData();
    }
    private static readonly mockCalendarData: Record<
        string,
        calendar_v3.Schema$Event[]
    > = {
        JRA: [],
        NAR: [],
        OVERSEAS: [],
        KEIRIN: [],
        AUTORACE: [],
        BOATRACE: [],
    };

    private static isInitialized = false;

    private setCalendarData(): void {
        if (MockGoogleCalendarGateway.isInitialized) {
            return;
        }
        MockGoogleCalendarGateway.isInitialized = true;
        switch (ENV) {
            case allowedEnvs.production: // ENV が production の場合、GoogleCalendarGateway を使用
            case allowedEnvs.test:
            case allowedEnvs.localNoInitData:
            case allowedEnvs.githubActionsCi:
            case allowedEnvs.local: {
                break;
            }
            case allowedEnvs.localInitMadeData: {
                // ENV が LOCAL_INIT_MADE_DATA の場合、データを後で設定したいので何もしない
                {
                    // 2024年のデータ366日分を作成
                    const startDate = new Date('2024-01-01');
                    const currentDate = new Date(startDate);
                    // whileで回していって、最初の日付の年数と異なったら終了
                    while (
                        currentDate.getFullYear() === startDate.getFullYear()
                    ) {
                        for (const raceType of RACE_TYPE_LIST_ALL_FOR_AWS) {
                            const location = defaultLocation[raceType];
                            for (
                                let raceNumber = 1;
                                raceNumber <= 12;
                                raceNumber++
                            ) {
                                const raceId = generateId(IdType.RACE, {
                                    raceType: raceType,
                                    dateTime: currentDate,
                                    location: location,
                                    number: raceNumber,
                                });
                                const calendarData: calendar_v3.Schema$Event = {
                                    id: raceId,
                                    summary: `テストレース${raceId}`,
                                    location: location,
                                    start: {
                                        dateTime: formatDate(
                                            new Date(
                                                currentDate.getFullYear(),
                                                currentDate.getMonth(),
                                                currentDate.getDate(),
                                                raceNumber + 6,
                                                0,
                                            ),
                                        ),
                                        timeZone: 'Asia/Tokyo',
                                    },
                                    end: {
                                        // 終了時刻は発走時刻から10分後とする
                                        dateTime: formatDate(
                                            new Date(
                                                currentDate.getFullYear(),
                                                currentDate.getMonth(),
                                                currentDate.getDate(),
                                                raceNumber + 6,
                                                10,
                                            ),
                                        ),
                                        timeZone: 'Asia/Tokyo',
                                    },
                                    colorId: '8',
                                    description: 'testDescription',
                                };
                                MockGoogleCalendarGateway.mockCalendarData[
                                    raceType
                                ].push(calendarData);
                            }
                        }
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }
                break;
            }
            default: {
                throw new Error('Invalid ENV value');
            }
        }
    }

    public async fetchCalendarDataList(
        raceType: RaceType,
        startDate: Date,
        finishDate: Date,
    ): Promise<calendar_v3.Schema$Event[]> {
        const raceData = MockGoogleCalendarGateway.mockCalendarData[raceType]
            .filter(
                (data) =>
                    new Date(data.start?.dateTime ?? '') >= startDate &&
                    new Date(data.start?.dateTime ?? '') <= finishDate,
            )
            // 日付順に並び替え
            .sort(
                (a, b) =>
                    new Date(a.start?.dateTime ?? '').getTime() -
                    new Date(b.start?.dateTime ?? '').getTime(),
            );
        await new Promise((resolve) => setTimeout(resolve, 0));
        return raceData;
    }

    public async fetchCalendarData(
        raceType: RaceType,
        eventId: string,
    ): Promise<calendar_v3.Schema$Event> {
        const raceData = MockGoogleCalendarGateway.mockCalendarData[
            raceType
        ].find((data) => data.id === eventId);
        if (!raceData) {
            throw new Error('Not found');
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return raceData;
    }

    public async updateCalendarData(
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        try {
            // mockCalendarDataに存在するかどうかの判定
            const index = MockGoogleCalendarGateway.mockCalendarData[
                raceType
            ].findIndex((data) => data.id === calendarData.id);
            // 存在しない場合は新規追加
            if (index === -1) {
                throw new Error('Event already exists');
            }
            MockGoogleCalendarGateway.mockCalendarData[raceType][index] =
                calendarData;
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
        }
        await Promise.resolve();
    }

    public async insertCalendarData(
        raceType: RaceType,
        calendarData: calendar_v3.Schema$Event,
    ): Promise<void> {
        try {
            // mockCalendarDataに存在するかどうかの判定
            const index = MockGoogleCalendarGateway.mockCalendarData[
                raceType
            ].findIndex((data) => data.id === calendarData.id);
            // 存在しない場合は新規追加
            if (index !== -1) {
                throw new Error('Not found');
            }
            MockGoogleCalendarGateway.mockCalendarData[raceType].push(
                calendarData,
            );
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
        }
        await Promise.resolve();
    }

    public async deleteCalendarData(
        raceType: RaceType,
        eventId: string,
    ): Promise<void> {
        try {
            // mockCalendarDataに存在するかどうかの判定
            const index = MockGoogleCalendarGateway.mockCalendarData[
                raceType
            ].findIndex((data) => data.id === eventId);
            // 存在しない場合はエラー
            if (index === -1) {
                throw new Error('Not found');
            }
            MockGoogleCalendarGateway.mockCalendarData[raceType].splice(
                index,
                1,
            );
        } catch (error) {
            console.error(
                'Google Calendar APIからのイベント取得に失敗しました',
                error,
            );
        }
        await Promise.resolve();
    }
}
