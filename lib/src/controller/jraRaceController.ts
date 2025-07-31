import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { JraRaceData } from '../domain/jraRaceData';
import {
    IOldRaceDataUseCase,
    IRaceDataUseCase,
} from '../usecase/interface/IRaceDataUseCase';
import { JraGradeType } from '../utility/data/jra/jraGradeType';
import { JraRaceCourse } from '../utility/data/jra/jraRaceCourse';
import { Logger } from '../utility/logger';

/**
 * 中央競馬のレース情報コントローラー
 */
@injectable()
export class JraRaceController {
    public router: Router;

    public constructor(
        @inject('JraRaceDataUseCase')
        private readonly jraRaceDataUseCase: IOldRaceDataUseCase<
            JraRaceData,
            JraGradeType,
            JraRaceCourse
        >,
        @inject('PublicGamblingRaceDataUseCase')
        private readonly publicGamblingRaceDataUseCase: IRaceDataUseCase,
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * ルーティングの初期化
     */
    @Logger
    private initializeRoutes(): void {
        // RaceData関連のAPI
        this.router.get('/race', this.getRaceDataList.bind(this));
        this.router.post('/race', this.updateRaceDataList.bind(this));
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
            const races =
                await this.publicGamblingRaceDataUseCase.fetchRaceDataList(
                    new Date(startDate as string),
                    new Date(finishDate as string),
                    ['jra'],
                    {
                        jra: {
                            gradeList,
                            locationList,
                        },
                    },
                );
            res.json(races.jra);
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
                await this.jraRaceDataUseCase.updateRaceEntityList(
                    parsedStartDate,
                    parsedFinishDate,
                );
                res.status(200).send();
                return;
            }

            // raceListが指定されている場合
            if (raceList !== undefined) {
                // raceListをJraRaceDataに変換する
                const jraRaceDataList: JraRaceData[] = raceList
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .flatMap((race: any) => {
                        try {
                            return [
                                JraRaceData.create(
                                    race.name,
                                    new Date(race.dateTime),
                                    race.location,
                                    race.surfaceType,
                                    Number(race.distance),
                                    race.grade,
                                    Number(race.number),
                                    Number(race.heldTimes),
                                    Number(race.heldDayTimes),
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

                console.info(jraRaceDataList);

                // レース情報を更新する
                await this.jraRaceDataUseCase.upsertRaceDataList(
                    jraRaceDataList,
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
}
