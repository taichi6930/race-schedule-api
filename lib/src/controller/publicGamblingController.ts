import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { IPlaceDataUseCase } from '../usecase/interface/IPlaceDataUseCase';
import { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import { Logger } from '../utility/logger';

/**
 * 公営競技のレース情報コントローラー
 */
@injectable()
export class PublicGamblingController {
    public router: Router;

    public constructor(
        @inject('PublicGamblingCalendarUseCase')
        private readonly publicGamblingCalendarUseCase: IRaceCalendarUseCase,
        @inject('PublicGamblingPlaceUseCase')
        private readonly publicGamblingPlaceUseCase: IPlaceDataUseCase,
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
        // this.router.post('/calendar', this.updateRacesToCalendar.bind(this));
        // // RaceData関連のAPI
        // this.router.get('/race', this.getRaceDataList.bind(this));
        // this.router.post('/race', this.updateRaceDataList.bind(this));
        // PlaceData関連のAPI
        this.router.get('/place', this.getPlaceDataList.bind(this));
        // this.router.post('/place', this.updatePlaceDataList.bind(this));
    }

    /**
     * 公営競技のカレンダーからレース情報を取得する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    @Logger
    private async getRacesFromCalendar(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate, raceType } = req.query;

            // startDateとfinishDateが指定されていないかつ、日付形式でない場合はエラーを返す
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // raceTypeが配列だった場合、配列に変換する、配列でなければ配列にしてあげる
            const raceTypeList =
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((g: string) => g)
                          : undefined
                      : undefined;

            if (!raceTypeList || raceTypeList.length === 0) {
                res.status(400).send('raceTypeは必須です');
                return;
            }

            const races =
                await this.publicGamblingCalendarUseCase.fetchRacesFromCalendar(
                    new Date(startDate as string),
                    new Date(finishDate as string),
                    raceTypeList,
                );
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
     * 競馬場情報を取得する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    @Logger
    private async getPlaceDataList(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, finishDate, raceType } = req.query;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            // raceTypeが配列だった場合、配列に変換する、配列でなければ配列にしてあげる
            const raceTypeList =
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((g: string) => g)
                          : undefined
                      : undefined;

            if (!raceTypeList || raceTypeList.length === 0) {
                res.status(400).send('raceTypeは必須です');
                return;
            }

            // 競馬場情報を取得する
            const placeList =
                await this.publicGamblingPlaceUseCase.fetchPlaceDataList(
                    new Date(startDate as string),
                    new Date(finishDate as string),
                    raceTypeList,
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
}
