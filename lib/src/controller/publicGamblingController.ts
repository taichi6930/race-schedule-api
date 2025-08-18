import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { IPlaceDataUseCase } from '../usecase/interface/IPlaceDataUseCase';
import { IPlayerDataUseCase } from '../usecase/interface/IPlayerDataUseCase';
import { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import { IRaceDataUseCase } from '../usecase/interface/IRaceDataUseCase';
import { SpecifiedGradeList } from '../utility/data/common/gradeType';
import { Logger } from '../utility/logger';
import { convertRaceTypeList, RaceType } from '../utility/raceType';


@injectable()
export class PublicGamblingController {
    public router: Router;

    public constructor(
        @inject('PublicGamblingCalendarUseCase')
        private readonly calendarUseCase: IRaceCalendarUseCase,
        @inject('PublicGamblingPlaceUseCase')
        private readonly placeUseCase: IPlaceDataUseCase,
        @inject('PublicGamblingRaceDataUseCase')
        private readonly raceDataUseCase: IRaceDataUseCase,
        @inject('PublicGamblingPlayerUseCase')
        private readonly playerUseCase: IPlayerDataUseCase,
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    
    @Logger
    private initializeRoutes(): void {
        
        this.router.get('/calendar', this.getRacesFromCalendar.bind(this));
        this.router.post('/calendar', this.updateRacesToCalendar.bind(this));
        
        this.router.get('/race', this.getRaceDataList.bind(this));
        this.router.post('/race', this.updateRaceEntityList.bind(this));
        
        this.router.get('/place', this.getPlaceDataList.bind(this));
        this.router.post('/place', this.updatePlaceDataList.bind(this));
        
        this.router.get('/player', this.getPlayerDataList.bind(this));
    }

    
    @Logger
    private async getRacesFromCalendar(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate, raceType } = req.query;

            
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            
            const raceTypeList = convertRaceTypeList(
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((r: string) => r)
                          : undefined
                      : undefined,
            );

            if (raceTypeList.length === 0) {
                res.status(400).send(
                    'raceTypeは必須です もしくは raceTypeが不正です',
                );
                return;
            }

            const races = await this.calendarUseCase.fetchRacesFromCalendar(
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

    
    @Logger
    private async updateRacesToCalendar(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate, raceType } = req.body;

            
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            
            const raceTypeList = convertRaceTypeList(
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((r: string) => r)
                          : undefined
                      : undefined,
            );

            if (raceTypeList.length === 0) {
                res.status(400).send(
                    'raceTypeは必須です もしくは raceTypeが不正です',
                );
                return;
            }

            
            await this.calendarUseCase.updateRacesToCalendar(
                new Date(startDate),
                new Date(finishDate),
                raceTypeList,
                {
                    [RaceType.JRA]: SpecifiedGradeList(RaceType.JRA),
                    [RaceType.NAR]: SpecifiedGradeList(RaceType.NAR),
                    [RaceType.OVERSEAS]: SpecifiedGradeList(RaceType.OVERSEAS),
                    [RaceType.KEIRIN]: SpecifiedGradeList(RaceType.KEIRIN),
                    [RaceType.AUTORACE]: SpecifiedGradeList(RaceType.AUTORACE),
                    [RaceType.BOATRACE]: SpecifiedGradeList(RaceType.BOATRACE),
                },
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

    
    @Logger
    private async getPlaceDataList(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, finishDate, raceType } = req.query;

            
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            
            const raceTypeList = convertRaceTypeList(
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((r: string) => r)
                          : undefined
                      : undefined,
            );

            if (raceTypeList.length === 0) {
                res.status(400).send(
                    'raceTypeは必須です もしくは raceTypeが不正です',
                );
                return;
            }

            
            const placeList = await this.placeUseCase.fetchPlaceDataList(
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

    
    @Logger
    private async updatePlaceDataList(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate, raceType } = req.body;

            
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            
            const raceTypeList = convertRaceTypeList(
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((r: string) => r)
                          : undefined
                      : undefined,
            );

            if (raceTypeList.length === 0) {
                res.status(400).send(
                    'raceTypeは必須です もしくは raceTypeが不正です',
                );
                return;
            }

            
            const response = await this.placeUseCase.updatePlaceDataList(
                new Date(startDate),
                new Date(finishDate),
                raceTypeList,
            );
            res.status(response.code).send({
                message: response.message,
                successDataCount: response.successDataCount,
                failureDataCount: response.failureDataCount,
            });
        } catch (error) {
            console.error('競馬場情報の更新中にエラーが発生しました:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }

    
    @Logger
    private async getRaceDataList(req: Request, res: Response): Promise<void> {
        try {
            
            const { startDate, finishDate, raceType, grade, location, stage } =
                req.query;

            const raceTypeList = convertRaceTypeList(
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((r: string) => r)
                          : undefined
                      : undefined,
            );

            
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

            if (raceTypeList.length === 0) {
                res.status(400).json({
                    error: 'raceTypeは必須です もしくは raceTypeが不正です',
                    details: 'raceTypeを指定してください',
                });
                return;
            }

            
            const races = await this.raceDataUseCase.fetchRaceEntityList(
                new Date(startDate as string),
                new Date(finishDate as string),
                raceTypeList,
                {
                    [RaceType.JRA]: {
                        gradeList,
                        locationList,
                    },
                    [RaceType.NAR]: {
                        gradeList,
                        locationList,
                    },
                    [RaceType.OVERSEAS]: {
                        gradeList,
                        locationList,
                    },
                    [RaceType.KEIRIN]: {
                        gradeList,
                        locationList,
                        stageList,
                    },
                    [RaceType.AUTORACE]: {
                        gradeList,
                        locationList,
                        stageList,
                    },
                    [RaceType.BOATRACE]: {
                        gradeList,
                        locationList,
                        stageList,
                    },
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

    
    @Logger
    private async updateRaceEntityList(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate, raceType, gradeList } = req.body;

            const raceTypeList = convertRaceTypeList(
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((r: string) => r)
                          : undefined
                      : undefined,
            );

            
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            if (raceTypeList.length === 0) {
                res.status(400).json({
                    error: 'raceTypeは必須です もしくは raceTypeが不正です',
                    details: 'raceTypeを指定してください',
                });
                return;
            }

            
            const raceTypeParams: Record<string, { gradeList?: string[] }> = {};
            for (const type of raceTypeList) {
                raceTypeParams[type] = {
                    gradeList:
                        gradeList === undefined
                            ? undefined
                            : gradeList.map((g: string) => g),
                };
            }

            const response = await this.raceDataUseCase.updateRaceEntityList(
                new Date(startDate),
                new Date(finishDate),
                raceTypeList,
                raceTypeParams,
            );
            res.status(response.code).send({
                message: response.message,
                successDataCount: response.successDataCount,
                failureDataCount: response.failureDataCount,
            });
        } catch (error) {
            console.error('レース情報の更新中にエラーが発生しました:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            res.status(500).send(
                `サーバーエラーが発生しました: ${errorMessage}`,
            );
        }
    }

    
    @Logger
    private async getPlayerDataList(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            
            const { raceType } = req.query;

            const raceTypeList = convertRaceTypeList(
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((r: string) => r)
                          : undefined
                      : undefined,
            );

            if (raceTypeList.length === 0) {
                res.status(400).json({
                    error: 'raceTypeは必須です もしくは raceTypeが不正です',
                    details: 'raceTypeを指定してください',
                });
                return;
            }

            
            const players =
                await this.playerUseCase.fetchPlayerDataList(raceTypeList);
            res.json(players);
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
}
