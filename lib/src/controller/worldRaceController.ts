import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { WorldRaceData } from '../domain/worldRaceData';
import { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import { IRaceDataUseCase } from '../usecase/interface/IRaceDataUseCase';
import {
    WorldGradeType,
    WorldSpecifiedGradeList,
} from '../utility/data/world/worldGradeType';
import { WorldRaceCourse } from '../utility/data/world/worldRaceCourse';
import { Logger } from '../utility/logger';

/**
 * 海外競馬のレース情報コントローラー
 */
@injectable()
export class WorldRaceController {
    public router: Router;

    public constructor(
        @inject('WorldRaceCalendarUseCase')
        private readonly raceCalendarUseCase: IRaceCalendarUseCase,
        @inject('WorldRaceDataUseCase')
        private readonly worldRaceDataUseCase: IRaceDataUseCase<
            WorldRaceData,
            WorldGradeType,
            WorldRaceCourse,
            undefined
        >,
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * ルーティングの初期化
     */
    @Logger
    private initializeRoutes(): void {
        // Calendar関連のAPI
        this.router.get('/calendar', this.getRacesFromCalendar.bind(this));
        this.router.post('/calendar', this.updateRacesToCalendar.bind(this));
        // RaceData関連のAPI
        this.router.get('/race', this.getRaceDataList.bind(this));
        this.router.post('/race', this.updateRaceDataList.bind(this));
    }

    /**
     * 海外競馬カレンダーからレース情報を取得する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    @Logger
    private async getRacesFromCalendar(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate } = req.query;

            // startDateとfinishDateが指定されていないかつ、日付形式でない場合はエラーを返す
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // カレンダーからレース情報を取得する
            const races = await this.raceCalendarUseCase.getRacesFromCalendar(
                new Date(startDate as string),
                new Date(finishDate as string),
            );
            // レース情報を返す
            res.json(races);
        } catch (error) {
            console.error(
                'カレンダーからレース情報を取得中にエラーが発生しました:',
                error,
            );
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }

    /**
     * カレンダーにレース情報を更新する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    @Logger
    private async updateRacesToCalendar(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate } = req.body;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // カレンダーにレース情報を更新する
            await this.raceCalendarUseCase.updateRacesToCalendar(
                new Date(startDate),
                new Date(finishDate),
                WorldSpecifiedGradeList,
            );
            res.status(200).send();
        } catch (error) {
            console.error(
                'カレンダーにレース情報を更新中にエラーが発生しました:',
                error,
            );
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }

    /**
     * レース情報を取得する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    @Logger
    private async getRaceDataList(req: Request, res: Response): Promise<void> {
        try {
            // gradeが複数来ることもある
            const { startDate, finishDate, grade, location } = req.query;
            // gradeが配列だった場合、配列に変換する、配列でなければ配列にしてあげる
            const gradeList =
                typeof grade === 'string'
                    ? [grade]
                    : typeof grade === 'object'
                      ? Array.isArray(grade)
                          ? (grade as string[]).map((g: string) => g)
                          : undefined
                      : undefined;

            const locationList =
                typeof location === 'string'
                    ? [location]
                    : typeof location === 'object'
                      ? Array.isArray(location)
                          ? (location as string[]).map((l: string) => l)
                          : undefined
                      : undefined;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).json({
                    error: 'startDate、finishDateは必須です',
                    details: 'startDateとfinishDateの両方を指定してください',
                });
                return;
            }

            // レース情報を取得する
            const races = await this.worldRaceDataUseCase.fetchRaceDataList(
                new Date(startDate as string),
                new Date(finishDate as string),
                {
                    gradeList,
                    locationList,
                },
            );
            res.json(races);
        } catch (error) {
            console.error('レース情報の取得中にエラーが発生しました:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).json({
                error: 'サーバーエラーが発生しました',
                details: `レース情報の取得中にエラーが発生しました: ${errorMessage}`,
            });
        }
    }

    /**
     * レース情報を更新する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    @Logger
    private async updateRaceDataList(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate } = req.body;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // レース情報を取得する
            await this.worldRaceDataUseCase.updateRaceEntityList(
                new Date(startDate),
                new Date(finishDate),
            );
            res.status(200).send();
        } catch (error) {
            console.error('レース情報の更新中にエラーが発生しました:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }
}
