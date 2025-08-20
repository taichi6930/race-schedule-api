import { container } from 'tsyringe';

import type { PlaceEntity } from '../../src/repository/entity/placeEntity';
import type { RaceEntity } from '../../src/repository/entity/raceEntity';
import { AutoracePlaceRepositoryFromHtml } from '../../src/repository/implement/autoracePlaceRepositoryFromHtml';
import { AutoraceRaceRepositoryFromHtml } from '../../src/repository/implement/autoraceRaceRepositoryFromHtml';
import { BoatracePlaceRepositoryFromHtmlImpl } from '../../src/repository/implement/boatracePlaceRepositoryFromHtmlImpl';
import { BoatraceRaceRepositoryFromHtmlImpl } from '../../src/repository/implement/boatraceRaceRepositoryFromHtmlImpl';
import { JraPlaceRepositoryFromHtmlImpl } from '../../src/repository/implement/jraPlaceRepositoryFromHtmlImpl';
import { JraRaceRepositoryFromHtmlImpl } from '../../src/repository/implement/jraRaceRepositoryFromHtmlImpl';
import { KeirinPlaceRepositoryFromHtmlImpl } from '../../src/repository/implement/keirinPlaceRepositoryFromHtmlImpl';
import { KeirinRaceRepositoryFromHtmlImpl } from '../../src/repository/implement/keirinRaceRepositoryFromHtmlImpl';
import { NarPlaceRepositoryFromHtmlImpl } from '../../src/repository/implement/narPlaceRepositoryFromHtmlImpl';
import { NarRaceRepositoryFromHtmlImpl } from '../../src/repository/implement/narRaceRepositoryFromHtmlImpl';
import { OverseasRaceRepositoryFromHtmlImpl } from '../../src/repository/implement/overseasRaceRepositoryFromHtmlImpl';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../src/repository/interface/IRaceRepository';
import { MockHorseRacingRaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockHorseRacingRaceRepositoryFromHtmlImpl';
import { MockMechanicalRacingRaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockMechanicalRacingRaceRepositoryFromHtmlImpl';
import { MockPlaceRepositoryFromHtmlImpl } from '../../src/repository/mock/mockPlaceRepositoryFromHtmlImpl';
import { allowedEnvs, ENV } from '../../src/utility/env';
// Repositoryの実装クラスをDIコンテナに登録する

// 環境ごとの設定
switch (ENV) {
    case allowedEnvs.production:
    case allowedEnvs.local: {
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'NarRaceRepositoryFromHtml',
            {
                useClass: NarRaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            {
                useClass: NarPlaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'JraRaceRepositoryFromHtml',
            { useClass: JraRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            {
                useClass: JraPlaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'KeirinRaceRepositoryFromHtml',
            {
                useClass: KeirinRaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: KeirinPlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'AutoraceRaceRepositoryFromHtml',
            {
                useClass: AutoraceRaceRepositoryFromHtml,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            { useClass: AutoracePlaceRepositoryFromHtml },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'OverseasRaceRepositoryFromHtml',
            {
                useClass: OverseasRaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'AutoraceRaceRepositoryFromHtml',
            {
                useClass: AutoraceRaceRepositoryFromHtml,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'BoatracePlaceRepositoryFromHtml',
            { useClass: BoatracePlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'BoatraceRaceRepositoryFromHtml',
            {
                useClass: BoatraceRaceRepositoryFromHtmlImpl,
            },
        );
        break;
    }
    case allowedEnvs.test:
    case allowedEnvs.localNoInitData:
    case allowedEnvs.localInitMadeData:
    case allowedEnvs.githubActionsCi: {
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'NarRaceRepositoryFromHtml',
            {
                useClass: MockHorseRacingRaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            {
                useClass: MockPlaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'JraRaceRepositoryFromHtml',
            { useClass: MockHorseRacingRaceRepositoryFromHtmlImpl },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            {
                useClass: MockPlaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'KeirinRaceRepositoryFromHtml',
            {
                useClass: MockMechanicalRacingRaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: MockPlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'AutoraceRaceRepositoryFromHtml',
            {
                useClass: MockMechanicalRacingRaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            { useClass: MockPlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'OverseasRaceRepositoryFromHtml',
            {
                useClass: MockHorseRacingRaceRepositoryFromHtmlImpl,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'BoatracePlaceRepositoryFromHtml',
            { useClass: MockPlaceRepositoryFromHtmlImpl },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'BoatraceRaceRepositoryFromHtml',
            {
                useClass: MockMechanicalRacingRaceRepositoryFromHtmlImpl,
            },
        );
        break;
    }
    default: {
        throw new Error('Invalid ENV value');
    }
}
