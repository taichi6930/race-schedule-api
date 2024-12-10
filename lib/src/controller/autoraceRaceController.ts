import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { AutoracePlaceData } from '../domain/autoracePlaceData';
import { AutoraceRaceData } from '../domain/autoraceRaceData';
import { IPlaceDataUseCase } from '../usecase/interface/IPlaceDataUseCase';
import { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import { IRaceDataUseCase } from '../usecase/interface/IRaceDataUseCase';
import {
    AUTORACE_SPECIFIED_GRADE_LIST,
    AutoraceGradeType,
    AutoraceRaceCourse,
    AutoraceRaceStage,
} from '../utility/data/autorace';
import { Logger } from '../utility/logger';

/**
 * オートレースのレース情報コントローラー
 */
@injectable()
export class AutoraceRaceController {
    public router: Router;

    constructor(
        @inject('AutoraceRaceCalendarUseCase')
        private readonly raceCalendarUseCase: IRaceCalendarUseCase,
        @inject('AutoraceRaceDataUseCase')
        private readonly autoraceRaceDataUseCase: IRaceDataUseCase<
            AutoraceRaceData,
            AutoraceGradeType,
            AutoraceRaceCourse,
            AutoraceRaceStage
        >,
        @inject('AutoracePlaceDataUseCase')
        private readonly autoracePlaceDataUseCase: IPlaceDataUseCase<AutoracePlaceData>,
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
        this.router.delete(
            '/calendar',
            this.cleansingRacesFromCalendar.bind(this),
        );

        // RaceData関連のAPI
        this.router.get('/race', this.getRaceDataList.bind(this));
        this.router.post('/race', this.updateRaceDataList.bind(this));

        // PlaceData関連のAPI
        this.router.get('/place', this.getPlaceDataList.bind(this));
        this.router.post('/place', this.updatePlaceDataList.bind(this));
    }

    /**
     * オートレースカレンダーからレース情報を取得する
     * @param req リクエスト
     * @param res レスポンス
     * @returns
     * @swagger
     * /api/races/autorace/calendar:
     *   get:
     *     description: カレンダーからレース情報を取得する
     *     parameters:
     *       - name: startDate
     *         in: query
     *         description: レース情報の開始日
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *       - name: finishDate
     *         in: query
     *         description: レース情報の終了日
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *     responses:
     *       200:
     *         description: レース情報を取得
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: レースID
     *                   title:
     *                     type: string
     *                     description: レースタイトル
     *                   startTime:
     *                     type: string
     *                     format: date-time
     *                     description: レース開始時刻
     *                   endTime:
     *                     type: string
     *                     format: date-time
     *                     description: レース終了時刻
     *                   location:
     *                     type: string
     *                     description: オートレース場の名称
     *                   description:
     *                     type: string
     *                     description: レースの説明
     *       400:
     *         description: 不正なリクエスト。`startDate` または `finishDate` が指定されていない場合
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: エラーメッセージ `startDate`、`finishDate` は必須です
     *                 details:
     *                   type: string
     *                   description: エラーの詳細（任意でより具体的な説明を提供することができます）
     *       500:
     *         description: サーバーエラー。カレンダーからのレース情報取得中にエラーが発生した場合
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: エラーメッセージ サーバーエラーが発生しました
     *                 details:
     *                   type: string
     *                   description: エラーの詳細（任意でより具体的な説明を提供することができます）
     */
    @Logger
    private async getRacesFromCalendar(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate } = req.query;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
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
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/autorace/calendar:
     *   post:
     *     description: カレンダーにレース情報を更新する
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               startDate:
     *                 type: string
     *                 format: date-time
     *                 description: レース情報の開始日
     *               finishDate:
     *                 type: string
     *                 format: date-time
     *                 description: レース情報の終了日
     *     responses:
     *       200:
     *         description: レース情報を更新
     *       400:
     *         description: 不正なリクエスト。`startDate` または `finishDate` が指定されていない場合
     *       500:
     *         description: サーバーエラー。カレンダーへのレース情報更新中にエラーが発生した場合
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
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // カレンダーにレース情報を更新する
            await this.raceCalendarUseCase.updateRacesToCalendar(
                new Date(startDate),
                new Date(finishDate),
                AUTORACE_SPECIFIED_GRADE_LIST,
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
     * カレンダーからレース情報をクレンジングする
     * @param req
     * @param res
     * @returns
     */
    @Logger
    private async cleansingRacesFromCalendar(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate } = req.query;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // カレンダーからレース情報をクレンジングする
            await this.raceCalendarUseCase.cleansingRacesFromCalendar(
                new Date(startDate as string),
                new Date(finishDate as string),
            );
            // レース情報をクレンジングする
            res.status(200).send();
        } catch (error) {
            console.error(
                'カレンダーからレース情報をクレンジング中にエラーが発生しました:',
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
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/autorace/race:
     *   get:
     *     description: レース情報を取得する
     *     parameters:
     *       - name: startDate
     *         in: query
     *         description: レース情報の開始日
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *       - name: finishDate
     *         in: query
     *         description: レース情報の終了日
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *     responses:
     *       200:
     *         description: レース情報を取得
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   name:
     *                     type: string
     *                     description: レース名
     *                   stage:
     *                     type: string
     *                     description: ステージ（決勝、準決勝、予選など）
     *                   dateTime:
     *                     type: string
     *                     format: date-time
     *                     description: レース開始時刻
     *                   location:
     *                     type: string
     *                     description: オートレース場の名称
     *                   distance:
     *                     type: number
     *                     description: 距離
     *                   grade:
     *                     type: string
     *                     description: レースのグレード
     *                   number:
     *                     type: number
     *                     description: レース番号
     *       400:
     *         description: 不正なリクエスト。`startDate` または `finishDate` が指定されていない場合
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: エラーメッセージ `startDate`、`finishDate` は必須です
     *                 details:
     *                   type: string
     *                   description: エラーの詳細（任意でより具体的な説明を提供することができます）
     *       500:
     *         description: サーバーエラー。カレンダーからのレース情報取得中にエラーが発生した場合
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: エラーメッセージ サーバーエラーが発生しました
     *                 details:
     *                   type: string
     *                   description: エラーの詳細（任意でより具体的な説明を提供することができます）
     */
    @Logger
    private async getRaceDataList(req: Request, res: Response): Promise<void> {
        try {
            // gradeが複数来ることもある
            const { startDate, finishDate, grade, location, stage } = req.query;
            // gradeが配列だった場合、配列に変換する、配列でなければ配列にしてあげる
            const gradeList =
                typeof grade === 'string'
                    ? [grade as AutoraceGradeType]
                    : typeof grade === 'object'
                      ? Array.isArray(grade)
                          ? (grade as string[]).map(
                                (g: string) => g as AutoraceGradeType,
                            )
                          : undefined
                      : undefined;

            const locationList =
                typeof location === 'string'
                    ? [location as AutoraceRaceCourse]
                    : typeof location === 'object'
                      ? Array.isArray(location)
                          ? (location as string[]).map(
                                (l: string) => l as AutoraceRaceCourse,
                            )
                          : undefined
                      : undefined;

            const stageList =
                typeof stage === 'string'
                    ? [stage as AutoraceRaceStage]
                    : typeof stage === 'object'
                      ? Array.isArray(stage)
                          ? (stage as string[]).map(
                                (s: string) => s as AutoraceRaceStage,
                            )
                          : undefined
                      : undefined;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).json({
                    error: 'startDate、finishDateは必須です',
                    details: 'startDateとfinishDateの両方を指定してください',
                });
                return;
            }

            // レース情報を取得する
            const races = await this.autoraceRaceDataUseCase.fetchRaceDataList(
                new Date(startDate as string),
                new Date(finishDate as string),
                {
                    gradeList: gradeList,
                    locationList: locationList,
                    stageList: stageList,
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
     * @swagger
     * /api/races/autorace/race:
     *   post:
     *     description: レース情報を更新する
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               startDate:
     *                 type: string
     *                 format: date-time
     *                 description: レース情報の開始日
     *               finishDate:
     *                 type: string
     *                 format: date-time
     *                 description: レース情報の終了日
     *     responses:
     *       200:
     *         description: レース情報を更新
     *       400:
     *         description: 不正なリクエスト。`startDate` または `finishDate` が指定されていない場合
     *       500:
     *         description: サーバーエラー。カレンダーへのレース情報更新中にエラーが発生した場合
     */
    @Logger
    private async updateRaceDataList(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate, raceList } = req.body;
            console.log(startDate, finishDate, raceList);

            // startDateとfinishDate、raceList全て指定されている場合のパターンはないので、エラーを返す
            if (
                startDate === undefined &&
                finishDate === undefined &&
                raceList === undefined
            ) {
                res.status(400).send(
                    'startDate、finishDate、raceList全てを入力することは出来ません',
                );
                return;
            }

            // startDateとfinishDateが指定されている場合
            if (
                typeof startDate === 'string' &&
                typeof finishDate === 'string'
            ) {
                const parsedStartDate = new Date(startDate);
                const parsedFinishDate = new Date(finishDate);

                // 日付が無効な場合はエラーを返す
                if (
                    isNaN(parsedStartDate.getTime()) ||
                    isNaN(parsedFinishDate.getTime())
                ) {
                    res.status(400).send(
                        'startDate、finishDateは有効な日付である必要があります',
                    );
                    return;
                }

                // レース情報を取得する
                await this.autoraceRaceDataUseCase.updateRaceEntityList(
                    parsedStartDate,
                    parsedFinishDate,
                );
                res.status(200).send();
                return;
            }

            // raceListが指定されている場合
            if (raceList !== undefined) {
                // raceListをAutoraceRaceDataに変換する
                const autoraceRaceDataList: AutoraceRaceData[] = raceList
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((race: any) => {
                        try {
                            return new AutoraceRaceData(
                                race.name,
                                race.stage as AutoraceRaceStage,
                                new Date(race.dateTime),
                                race.location as AutoraceRaceCourse,
                                race.grade as AutoraceGradeType,
                                Number(race.number),
                            );
                        } catch (error) {
                            console.error(
                                'レース情報の変換中にエラーが発生しました:',
                                error,
                            );
                            return null;
                        }
                    }) // nullを除外する
                    .filter(
                        (
                            raceData: AutoraceRaceData | null,
                        ): raceData is AutoraceRaceData => raceData !== null,
                    );

                // レース情報を更新する
                await this.autoraceRaceDataUseCase.upsertRaceDataList(
                    autoraceRaceDataList,
                );
                res.status(200).send();
                return;
            }

            // どちらも指定されていない場合はエラーを返す
            res.status(400).send(
                'startDateとfinishDate、もしくはraceListのいずれかを指定してください',
            );
        } catch (error) {
            console.error('Error updating race data:', error);
            res.status(500).send('レースデータの更新中にエラーが発生しました');
        }
    }

    /**
     * オートレース場情報を取得する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/autorace/place:
     *   get:
     *     description: オートレース場情報を取得する
     *     parameters:
     *       - name: startDate
     *         in: query
     *         description: レース情報の開始日
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *       - name: finishDate
     *         in: query
     *         description: レース情報の終了日
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *     responses:
     *       200:
     *         description: レース情報を取得
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   dateTime:
     *                     type: string
     *                     format: date-time
     *                     description: レース開始時刻
     *                   location:
     *                     type: string
     *                     description: オートレース場の名称
     *       400:
     *         description: 不正なリクエスト。`startDate` または `finishDate` が指定されていない場合
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: エラーメッセージ `startDate`、`finishDate` は必須です
     *                 details:
     *                   type: string
     *                   description: エラーの詳細（任意でより具体的な説明を提供することができます）
     *       500:
     *         description: サーバーエラー。カレンダーからのレース情報取得中にエラーが発生した場合
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: エラーメッセージ サーバーエラーが発生しました
     *                 details:
     *                   type: string
     *                   description: エラーの詳細（任意でより具体的な説明を提供することができます）
     */
    @Logger
    private async getPlaceDataList(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, finishDate } = req.query;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // オートレース場情報を取得する
            const placeList =
                await this.autoracePlaceDataUseCase.fetchPlaceDataList(
                    new Date(startDate as string),
                    new Date(finishDate as string),
                );
            res.json(placeList);
        } catch (error) {
            console.error(
                'オートレース場情報の取得中にエラーが発生しました:',
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
     * オートレース場情報を更新する
     * @param req
     * @param res
     * @returns
     * @swagger
     * /api/races/autorace/place:
     *   post:
     *     description: オートレース場情報を更新する
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               startDate:
     *                 type: string
     *                 format: date-time
     *                 description: レース情報の開始日
     *               finishDate:
     *                 type: string
     *                 format: date-time
     *                 description: レース情報の終了日
     *     responses:
     *       200:
     *         description: オートレース場情報を更新
     *       400:
     *         description: 不正なリクエスト。`startDate` または `finishDate` が指定されていない場合
     *       500:
     *         description: サーバーエラー。カレンダーへのレース情報更新中にエラーが発生した場合
     */
    @Logger
    private async updatePlaceDataList(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate } = req.body;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                isNaN(Date.parse(startDate as string)) ||
                isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // オートレース場情報を取得する
            await this.autoracePlaceDataUseCase.updatePlaceDataList(
                new Date(startDate),
                new Date(finishDate),
            );
            res.status(200).send();
        } catch (error) {
            console.error(
                'オートレース場情報の更新中にエラーが発生しました:',
                error,
            );
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }
}
