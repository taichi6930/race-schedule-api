import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { IPlaceDataUseCase } from '../usecase/interface/IPlaceDataUseCase';
import { IPlayerDataUseCase } from '../usecase/interface/IPlayerDataUseCase';
import { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import { IRaceDataUseCase } from '../usecase/interface/IRaceDataUseCase';
import {
    AutoraceSpecifiedGradeList,
    BoatraceSpecifiedGradeList,
    JraSpecifiedGradeList,
    KeirinSpecifiedGradeList,
    NarSpecifiedGradeList,
    WorldSpecifiedGradeList,
} from '../utility/data/common/gradeType';
import { Logger } from '../utility/logger';
import { RaceType } from '../utility/raceType';

/**
 * 公営競技のレース情報コントローラー
 */
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
        this.router.post('/race', this.updateRaceEntityList.bind(this));
        // PlaceData関連のAPI
        this.router.get('/place', this.getPlaceDataList.bind(this));
        this.router.post('/place', this.updatePlaceDataList.bind(this));
        // PlayerData関連のAPI
        this.router.get('/player', this.getPlayerDataList.bind(this));
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

            const modifiedRaceTypeList: RaceType[] = raceTypeList
                .map((type) => {
                    // RaceTypeに変更
                    switch (type.toLowerCase()) {
                        case 'jra': {
                            return RaceType.JRA;
                        }
                        case 'nar': {
                            return RaceType.NAR;
                        }
                        case 'world': {
                            return RaceType.WORLD;
                        }
                        case 'keirin': {
                            return RaceType.KEIRIN;
                        }
                        case 'autorace': {
                            return RaceType.AUTORACE;
                        }
                        case 'boatrace': {
                            return RaceType.BOATRACE;
                        }
                        default: {
                            return 'undefined'; // 未知のレースタイプは除外
                        }
                    }
                })
                .filter((type): type is RaceType => type !== 'undefined');

            const races = await this.calendarUseCase.fetchRacesFromCalendar(
                new Date(startDate as string),
                new Date(finishDate as string),
                modifiedRaceTypeList,
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
            const { startDate, finishDate, raceType } = req.body;

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

            // カレンダーにレース情報を更新する
            await this.calendarUseCase.updateRacesToCalendar(
                new Date(startDate),
                new Date(finishDate),
                {
                    jra: JraSpecifiedGradeList,
                    nar: NarSpecifiedGradeList,
                    world: WorldSpecifiedGradeList,
                    keirin: KeirinSpecifiedGradeList,
                    autorace: AutoraceSpecifiedGradeList,
                    boatrace: BoatraceSpecifiedGradeList,
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

            const modifiedRaceTypeList: RaceType[] = raceTypeList
                .map((type) => {
                    // RaceTypeに変更
                    switch (type.toLowerCase()) {
                        case 'jra': {
                            return RaceType.JRA;
                        }
                        case 'nar': {
                            return RaceType.NAR;
                        }
                        case 'world': {
                            return RaceType.WORLD;
                        }
                        case 'keirin': {
                            return RaceType.KEIRIN;
                        }
                        case 'autorace': {
                            return RaceType.AUTORACE;
                        }
                        case 'boatrace': {
                            return RaceType.BOATRACE;
                        }
                        default: {
                            return 'undefined'; // 未知のレースタイプは除外
                        }
                    }
                })
                .filter((type): type is RaceType => type !== 'undefined');

            // 競馬場情報を取得する
            const placeList = await this.placeUseCase.fetchPlaceDataList(
                new Date(startDate as string),
                new Date(finishDate as string),
                modifiedRaceTypeList,
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
     * @param req - リクエスト
     * @param res - レスポンス
     */
    @Logger
    private async updatePlaceDataList(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate, raceType } = req.body;

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

            const modifiedRaceTypeList: RaceType[] = raceTypeList
                .map((type) => {
                    // RaceTypeに変更
                    switch (type.toLowerCase()) {
                        case 'jra': {
                            return RaceType.JRA;
                        }
                        case 'nar': {
                            return RaceType.NAR;
                        }
                        case 'world': {
                            return RaceType.WORLD;
                        }
                        case 'keirin': {
                            return RaceType.KEIRIN;
                        }
                        case 'autorace': {
                            return RaceType.AUTORACE;
                        }
                        case 'boatrace': {
                            return RaceType.BOATRACE;
                        }
                        default: {
                            return 'undefined'; // 未知のレースタイプは除外
                        }
                    }
                })
                .filter((type): type is RaceType => type !== 'undefined');

            // 競馬場情報を取得する
            await this.placeUseCase.updatePlaceDataList(
                new Date(startDate),
                new Date(finishDate),
                modifiedRaceTypeList,
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

    /**
     * レース情報を取得する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    @Logger
    private async getRaceDataList(req: Request, res: Response): Promise<void> {
        try {
            // gradeが複数来ることもある
            const { startDate, finishDate, raceType, grade, location, stage } =
                req.query;

            const raceTypeList =
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((r: string) => r)
                          : undefined
                      : undefined;

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

            if (!raceTypeList || raceTypeList.length === 0) {
                res.status(400).json({
                    error: 'raceTypeは必須です',
                    details: 'raceTypeを指定してください',
                });
                return;
            }

            const modifiedRaceTypeList: RaceType[] = raceTypeList
                .map((type) => {
                    // RaceTypeに変更
                    switch (type.toLowerCase()) {
                        case 'jra': {
                            return RaceType.JRA;
                        }
                        case 'nar': {
                            return RaceType.NAR;
                        }
                        case 'world': {
                            return RaceType.WORLD;
                        }
                        case 'keirin': {
                            return RaceType.KEIRIN;
                        }
                        case 'autorace': {
                            return RaceType.AUTORACE;
                        }
                        case 'boatrace': {
                            return RaceType.BOATRACE;
                        }
                        default: {
                            return 'undefined'; // 未知のレースタイプは除外
                        }
                    }
                })
                .filter((type): type is RaceType => type !== 'undefined');

            // レース情報を取得する
            const races = await this.raceDataUseCase.fetchRaceEntityList(
                new Date(startDate as string),
                new Date(finishDate as string),
                modifiedRaceTypeList,
                {
                    jra: {
                        gradeList,
                        locationList,
                    },
                    nar: {
                        gradeList,
                        locationList,
                    },
                    world: {
                        gradeList,
                        locationList,
                    },
                    keirin: {
                        gradeList,
                        locationList,
                        stageList,
                    },
                    autorace: {
                        gradeList,
                        locationList,
                        stageList,
                    },
                    boatrace: {
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

    /**
     * レース情報を更新する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    @Logger
    private async updateRaceEntityList(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const { startDate, finishDate, raceType, gradeList } = req.body;

            const raceTypeList =
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((r: string) => r)
                          : undefined
                      : undefined;

            // startDateとfinishDateが指定されていない場合はエラーを返す
            if (
                Number.isNaN(Date.parse(startDate as string)) ||
                Number.isNaN(Date.parse(finishDate as string))
            ) {
                res.status(400).send('startDate、finishDateは必須です');
                return;
            }

            if (!raceTypeList || raceTypeList.length === 0) {
                res.status(400).json({
                    error: 'raceTypeは必須です',
                    details: 'raceTypeを指定してください',
                });
                return;
            }

            // raceTypeListに応じて各種プロパティを動的に生成
            const raceTypeParams: Record<string, { gradeList?: string[] }> = {};
            for (const type of raceTypeList) {
                raceTypeParams[type] = {
                    gradeList:
                        gradeList === undefined
                            ? undefined
                            : gradeList.map((g: string) => g),
                };
            }

            const modifiedRaceTypeList: RaceType[] = raceTypeList
                .map((type) => {
                    // RaceTypeに変更
                    switch (type.toLowerCase()) {
                        case 'jra': {
                            return RaceType.JRA;
                        }
                        case 'nar': {
                            return RaceType.NAR;
                        }
                        case 'world': {
                            return RaceType.WORLD;
                        }
                        case 'keirin': {
                            return RaceType.KEIRIN;
                        }
                        case 'autorace': {
                            return RaceType.AUTORACE;
                        }
                        case 'boatrace': {
                            return RaceType.BOATRACE;
                        }
                        default: {
                            return 'undefined'; // 未知のレースタイプは除外
                        }
                    }
                })
                .filter((type): type is RaceType => type !== 'undefined');

            await this.raceDataUseCase.updateRaceEntityList(
                new Date(startDate),
                new Date(finishDate),
                modifiedRaceTypeList,
                raceTypeParams,
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

    /**
     * 選手データを取得する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    @Logger
    private async getPlayerDataList(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            // gradeが複数来ることもある
            const { raceType } = req.query;

            const raceTypeList =
                typeof raceType === 'string'
                    ? [raceType]
                    : typeof raceType === 'object'
                      ? Array.isArray(raceType)
                          ? (raceType as string[]).map((r: string) => r)
                          : undefined
                      : undefined;

            if (!raceTypeList || raceTypeList.length === 0) {
                res.status(400).json({
                    error: 'raceTypeは必須です',
                    details: 'raceTypeを指定してください',
                });
                return;
            }

            const modifiedRaceTypeList: RaceType[] = raceTypeList
                .map((type) => {
                    // RaceTypeに変更
                    switch (type.toLowerCase()) {
                        case 'jra': {
                            return RaceType.JRA;
                        }
                        case 'nar': {
                            return RaceType.NAR;
                        }
                        case 'world': {
                            return RaceType.WORLD;
                        }
                        case 'keirin': {
                            return RaceType.KEIRIN;
                        }
                        case 'autorace': {
                            return RaceType.AUTORACE;
                        }
                        case 'boatrace': {
                            return RaceType.BOATRACE;
                        }
                        default: {
                            return 'undefined'; // 未知のレースタイプは除外
                        }
                    }
                })
                .filter((type): type is RaceType => type !== 'undefined');

            // レース情報を取得する
            const players =
                await this.playerUseCase.fetchPlayerDataList(
                    modifiedRaceTypeList,
                );
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
