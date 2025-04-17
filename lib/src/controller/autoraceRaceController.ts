import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { AutoracePlaceData } from '../domain/autoracePlaceData';
import { AutoraceRaceData } from '../domain/autoraceRaceData';
import { IPlaceDataUseCase } from '../usecase/interface/IPlaceDataUseCase';
import { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import { IRaceDataUseCase } from '../usecase/interface/IRaceDataUseCase';
import {
    AutoraceGradeType,
    AutoraceSpecifiedGradeList,
} from '../utility/data/autorace/autoraceGradeType';
import { AutoraceRaceCourse } from '../utility/data/autorace/autoraceRaceCourse';
import { AutoraceRaceStage } from '../utility/data/autorace/autoraceRaceStage';
import { Logger } from '../utility/logger';

/**
 * オートレースのレース情報コントローラー
 */
@injectable()
export class AutoraceRaceController {
    public router: Router;

    public constructor(
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
     * @param req リクエスト
     * @param res レスポンス
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
                AutoraceSpecifiedGradeList,
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
     * @param req リクエスト
     * @param res レスポンス
     */
    @Logger
    private async getRaceDataList(req: Request, res: Response): Promise<void> {
        try {
            // gradeが複数来ることもある
            const { startDate, finishDate, grade, location, stage } = req.query;
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

            const stageList =
                typeof stage === 'string'
                    ? [stage]
                    : typeof stage === 'object'
                      ? Array.isArray(stage)
                          ? (stage as string[]).map((s: string) => s)
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
            const races = await this.autoraceRaceDataUseCase.fetchRaceDataList(
                new Date(startDate as string),
                new Date(finishDate as string),
                {
                    gradeList,
                    locationList,
                    stageList,
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
     * @param req リクエスト
     * @param res レスポンス
     */
    @Logger
    private async updateRaceDataList(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate, raceList } = req.body;

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
                    Number.isNaN(parsedStartDate.getTime()) ||
                    Number.isNaN(parsedFinishDate.getTime())
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
                    .flatMap((race: any): AutoraceRaceData[] => {
                        try {
                            return [
                                AutoraceRaceData.create(
                                    race.name,
                                    race.stage,
                                    new Date(race.dateTime),
                                    race.location,
                                    race.grade,
                                    Number(race.number),
                                ),
                            ];
                        } catch (error) {
                            console.error(
                                'レース情報の変換中にエラーが発生しました:',
                                error,
                            );
                            return [];
                        }
                    });

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
     * @param req リクエスト
     * @param res レスポンス
     */
    @Logger
    private async getPlaceDataList(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, finishDate } = req.query;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
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
     * @param req リクエスト
     * @param res レスポンス
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
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
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
