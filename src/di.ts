/**
 * 依存性注入（DI）コンテナの設定モジュール
 *
 * tsyringeを使用してアプリケーション全体の依存性を管理します。
 * 各レイヤー（Gateway、Repository、Service、UseCase）のクラスを
 * インターフェースに対して登録し、疎結合なアーキテクチャを実現します。
 */

import 'reflect-metadata';

import { container } from 'tsyringe';

import { DBGateway } from './gateway/implement/dbGateway';
import { GoogleCalendarGateway } from './gateway/implement/googleCalendarGateway';
import { PlaceDataHtmlGateway } from './gateway/implement/placeDataHtmlGateway';
import { RaceDataHtmlGateway } from './gateway/implement/raceDataHtmlGateway';
import type { ICalendarGateway } from './gateway/interface/iCalendarGateway';
import type { IDBGateway } from './gateway/interface/iDbGateway';
import type { IPlaceDataHtmlGateway } from './gateway/interface/iPlaceDataHtmlGateway';
import type { IRaceDataHtmlGateway } from './gateway/interface/iRaceDataHtmlGateway';
import { GoogleCalendarRepository } from './repository/implement/googleCalendarRepository';
import { PlaceRepositoryFromHtml } from './repository/implement/placeRepositoryFromHtml';
import { PlaceRepositoryFromStorage } from './repository/implement/placeRepositoryFromStorage';
import { PlayerRepository } from './repository/implement/playerRepository';
import { RaceRepositoryFromHtml } from './repository/implement/raceRepositoryFromHtml';
import { RaceRepositoryFromStorage } from './repository/implement/raceRepositoryFromStorage';
import type { ICalendarRepository } from './repository/interface/ICalendarRepository';
import type { IPlaceRepository } from './repository/interface/IPlaceRepository';
import type { IPlayerRepository } from './repository/interface/IPlayerRepository';
import type { IRaceRepository } from './repository/interface/IRaceRepository';
import { CalendarService } from './service/implement/calendarService';
import { PlaceService } from './service/implement/placeService';
import { PlayerService } from './service/implement/playerService';
import { RaceService } from './service/implement/raceService';
import type { ICalendarService } from './service/interface/ICalendarService';
import type { IPlaceService } from './service/interface/IPlaceService';
import type { IPlayerService } from './service/interface/IPlayerService';
import type { IRaceService } from './service/interface/IRaceService';
import { CalendarUseCase } from './usecase/implement/calendarUseCase';
import { PlaceUseCase } from './usecase/implement/placeUsecase';
import { PlayerUseCase } from './usecase/implement/playerUsecase';
import { RaceUseCase } from './usecase/implement/raceUsecase';
import type { ICalendarUseCase } from './usecase/interface/ICalendarUseCase';
import type { IPlaceUseCase } from './usecase/interface/IPlaceUsecase';
import type { IPlayerUseCase } from './usecase/interface/IPlayerUsecase';
import type { IRaceUseCase } from './usecase/interface/IRaceUsecase';

// プレイヤー関連の依存性登録
container.register<IPlayerRepository>('PlayerRepository', {
    useClass: PlayerRepository,
});
container.register<IPlayerService>('PlayerService', {
    useClass: PlayerService,
});
container.register<IPlayerUseCase>('PlayerUsecase', {
    useClass: PlayerUseCase,
});

// データベース関連の依存性登録
container.register<IDBGateway>('DBGateway', { useClass: DBGateway });

// レース関連の依存性登録
container.register<IRaceDataHtmlGateway>('RaceDataHtmlGateway', {
    useClass: RaceDataHtmlGateway,
});
container.register<IRaceRepository>('RaceRepositoryFromStorage', {
    useClass: RaceRepositoryFromStorage,
});
container.register<IRaceRepository>('RaceRepositoryFromHtml', {
    useClass: RaceRepositoryFromHtml,
});
container.register<IRaceService>('RaceService', { useClass: RaceService });
container.register<IRaceUseCase>('RaceUsecase', { useClass: RaceUseCase });

// 開催場所関連の依存性登録
container.register<IPlaceDataHtmlGateway>('PlaceDataHtmlGateway', {
    useClass: PlaceDataHtmlGateway,
});
container.register<IPlaceRepository>('PlaceRepositoryFromStorage', {
    useClass: PlaceRepositoryFromStorage,
});
container.register<IPlaceRepository>('PlaceRepositoryFromHtml', {
    useClass: PlaceRepositoryFromHtml,
});
container.register<IPlaceService>('PlaceService', { useClass: PlaceService });
container.register<IPlaceUseCase>('PlaceUsecase', { useClass: PlaceUseCase });

// カレンダー関連の依存性登録
container.register<ICalendarGateway>('GoogleCalendarGateway', {
    useClass: GoogleCalendarGateway,
});
container.register<ICalendarRepository>('CalendarRepository', {
    useClass: GoogleCalendarRepository,
});
container.register<ICalendarService>('CalendarService', {
    useClass: CalendarService,
});
container.register<ICalendarUseCase>('CalendarUsecase', {
    useClass: CalendarUseCase,
});

export { container } from 'tsyringe';
