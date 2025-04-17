import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { NarPlaceData } from '../domain/narPlaceData';
import { NarRaceData } from '../domain/narRaceData';
import { IPlaceDataUseCase } from '../usecase/interface/IPlaceDataUseCase';
import { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import { IRaceDataUseCase } from '../usecase/interface/IRaceDataUseCase';
import {
    NarGradeType,
    NarSpecifiedGradeList,
} from '../utility/data/nar/narGradeType';
import { NarRaceCourse } from '../utility/data/nar/narRaceCourse';
import { Logger } from '../utility/logger';

/**
 * 地方競馬のレース情報コントローラー
 */
@injectable()
export class NarRaceController {
    public router: Router;

    public constructor(
        @inject('NarRaceCalendarUseCase')
        private readonly raceCalendarUseCase: IRaceCalendarUseCase,
        @inject('NarRaceDataUseCase')
        private readonly narRaceDataUseCase: IRaceDataUseCase<
            NarRaceData,
            NarGradeType,
            NarRaceCourse,
            undefined
        >,
        @inject('NarPlaceDataUseCase')
        private readonly narPlaceDataUseCase: IPlaceDataUseCase<NarPlaceData>,
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
     * NARカレンダーからレース情報を取得する
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
                NarSpecifiedGradeList,
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
            const races = await this.narRaceDataUseCase.fetchRaceDataList(
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
                await this.narRaceDataUseCase.updateRaceEntityList(
                    parsedStartDate,
                    parsedFinishDate,
                );
                res.status(200).send();
                return;
            }

            // raceListが指定されている場合
            if (raceList !== undefined) {
                // raceListをNarRaceDataに変換する
                const narRaceDataList: NarRaceData[] = raceList
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .flatMap((race: any) => {
                        try {
                            return [
                                NarRaceData.create(
                                    race.name,
                                    new Date(race.dateTime),
                                    race.location,
                                    race.surfaceType,
                                    Number(race.distance),
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

                console.info(narRaceDataList);

                // レース情報を更新する
                await this.narRaceDataUseCase.upsertRaceDataList(
                    narRaceDataList,
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
     * 競馬場情報を取得する
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

            // 競馬場情報を取得する
            const placeList = await this.narPlaceDataUseCase.fetchPlaceDataList(
                new Date(startDate as string),
                new Date(finishDate as string),
            );
            res.json(placeList);
        } catch (error) {
            console.error('競馬場情報の取得中にエラーが発生しました:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }

    /**
     * 競馬場情報を更新する
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

            // 競馬場情報を取得する
            await this.narPlaceDataUseCase.updatePlaceDataList(
                new Date(startDate),
                new Date(finishDate),
            );
            res.status(200).send();
        } catch (error) {
            console.error('競馬場情報の更新中にエラーが発生しました:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }
}
