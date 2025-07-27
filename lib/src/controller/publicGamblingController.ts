import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { AutoracePlaceData } from '../domain/autoracePlaceData';
import { AutoraceRaceData } from '../domain/autoraceRaceData';
import { BoatracePlaceData } from '../domain/boatracePlaceData';
import { BoatraceRaceData } from '../domain/boatraceRaceData';
import { CalendarData } from '../domain/calendarData';
import { JraPlaceData } from '../domain/jraPlaceData';
import { JraRaceData } from '../domain/jraRaceData';
import { KeirinPlaceData } from '../domain/keirinPlaceData';
import { KeirinRaceData } from '../domain/keirinRaceData';
import { NarPlaceData } from '../domain/narPlaceData';
import { NarRaceData } from '../domain/narRaceData';
import { WorldRaceData } from '../domain/worldRaceData';
import { IPlaceDataUseCase } from '../usecase/interface/IPlaceDataUseCase';
import { IRaceCalendarUseCase } from '../usecase/interface/IRaceCalendarUseCase';
import { IRaceDataUseCase } from '../usecase/interface/IRaceDataUseCase';
import { AutoraceGradeType } from '../utility/data/autorace/autoraceGradeType';
import { AutoraceRaceCourse } from '../utility/data/autorace/autoraceRaceCourse';
import { AutoraceRaceStage } from '../utility/data/autorace/autoraceRaceStage';
import { BoatraceGradeType } from '../utility/data/boatrace/boatraceGradeType';
import { BoatraceRaceCourse } from '../utility/data/boatrace/boatraceRaceCourse';
import { BoatraceRaceStage } from '../utility/data/boatrace/boatraceRaceStage';
import { JraGradeType } from '../utility/data/jra/jraGradeType';
import { JraRaceCourse } from '../utility/data/jra/jraRaceCourse';
import { KeirinGradeType } from '../utility/data/keirin/keirinGradeType';
import { KeirinRaceCourse } from '../utility/data/keirin/keirinRaceCourse';
import { KeirinRaceStage } from '../utility/data/keirin/keirinRaceStage';
import { NarGradeType } from '../utility/data/nar/narGradeType';
import { NarRaceCourse } from '../utility/data/nar/narRaceCourse';
import { WorldGradeType } from '../utility/data/world/worldGradeType';
import { WorldRaceCourse } from '../utility/data/world/worldRaceCourse';
import { Logger } from '../utility/logger';

/**
 * 公営競技のレース情報コントローラー
 */
@injectable()
export class PublicGamblingController {
    public router: Router;

    public constructor(
        @inject('JraRaceCalendarUseCase')
        private readonly jraRaceCalendarUseCase: IRaceCalendarUseCase,
        @inject('JraRaceDataUseCase')
        private readonly jraRaceDataUseCase: IRaceDataUseCase<
            JraRaceData,
            JraGradeType,
            JraRaceCourse,
            undefined
        >,
        @inject('JraPlaceDataUseCase')
        private readonly jraPlaceDataUseCase: IPlaceDataUseCase<JraPlaceData>,
        @inject('NarRaceCalendarUseCase')
        private readonly narRaceCalendarUseCase: IRaceCalendarUseCase,
        @inject('NarRaceDataUseCase')
        private readonly narRaceDataUseCase: IRaceDataUseCase<
            NarRaceData,
            NarGradeType,
            NarRaceCourse,
            undefined
        >,
        @inject('NarPlaceDataUseCase')
        private readonly narPlaceDataUseCase: IPlaceDataUseCase<NarPlaceData>,
        @inject('WorldRaceCalendarUseCase')
        private readonly worldRaceCalendarUseCase: IRaceCalendarUseCase,
        @inject('WorldRaceDataUseCase')
        private readonly worldRaceDataUseCase: IRaceDataUseCase<
            WorldRaceData,
            WorldGradeType,
            WorldRaceCourse,
            undefined
        >,
        @inject('KeirinRaceCalendarUseCase')
        private readonly keirinRaceCalendarUseCase: IRaceCalendarUseCase,
        @inject('KeirinRaceDataUseCase')
        private readonly keirinRaceDataUseCase: IRaceDataUseCase<
            KeirinRaceData,
            KeirinGradeType,
            KeirinRaceCourse,
            KeirinRaceStage
        >,
        @inject('KeirinPlaceDataUseCase')
        private readonly keirinPlaceDataUseCase: IPlaceDataUseCase<KeirinPlaceData>,
        @inject('AutoraceRaceCalendarUseCase')
        private readonly autoraceRaceCalendarUseCase: IRaceCalendarUseCase,
        @inject('AutoraceRaceDataUseCase')
        private readonly autoraceRaceDataUseCase: IRaceDataUseCase<
            AutoraceRaceData,
            AutoraceGradeType,
            AutoraceRaceCourse,
            AutoraceRaceStage
        >,
        @inject('AutoracePlaceDataUseCase')
        private readonly autoracePlaceDataUseCase: IPlaceDataUseCase<AutoracePlaceData>,
        @inject('BoatraceRaceCalendarUseCase')
        private readonly boatraceRaceCalendarUseCase: IRaceCalendarUseCase,
        @inject('BoatraceRaceDataUseCase')
        private readonly boatraceRaceDataUseCase: IRaceDataUseCase<
            BoatraceRaceData,
            BoatraceGradeType,
            BoatraceRaceCourse,
            BoatraceRaceStage
        >,
        @inject('BoatracePlaceDataUseCase')
        private readonly boatracePlaceDataUseCase: IPlaceDataUseCase<BoatracePlaceData>,
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
        // // PlaceData関連のAPI
        // this.router.get('/place', this.getPlaceDataList.bind(this));
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

            let races: CalendarData[] = [];
            console.log('raceTypeList:', raceTypeList);
            if (Array.isArray(raceTypeList)) {
                races = await this.getRacesFromCalendarsByTypes(
                    raceTypeList,
                    new Date(startDate as string),
                    new Date(finishDate as string),
                );
            }
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
     * raceTypeごとにカレンダーからレース情報を取得し、まとめて返す共通メソッド
     * @param raceTypeList - レース種別のリスト
     * @param startDate - 開始日
     * @param finishDate - 終了日
     * @returns レース情報の配列
     */
    private async getRacesFromCalendarsByTypes(
        raceTypeList: string[],
        startDate: Date,
        finishDate: Date,
    ): Promise<CalendarData[]> {
        const useCaseMap: Record<string, IRaceCalendarUseCase> = {
            jra: this.jraRaceCalendarUseCase,
            nar: this.narRaceCalendarUseCase,
            world: this.worldRaceCalendarUseCase,
            keirin: this.keirinRaceCalendarUseCase,
            autorace: this.autoraceRaceCalendarUseCase,
            boatrace: this.boatraceRaceCalendarUseCase,
        };
        const allRaces: CalendarData[] = [];
        for (const type of raceTypeList) {
            const useCase = useCaseMap[type];
            const races = await useCase.getRacesFromCalendar(
                startDate,
                finishDate,
            );
            allRaces.push(...races);
        }
        return allRaces;
    }
}
