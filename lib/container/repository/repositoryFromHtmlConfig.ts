import { container } from 'tsyringe';

import type { PlaceEntity } from '../../src/repository/entity/placeEntity';
import type { RaceEntity } from '../../src/repository/entity/raceEntity';
import { AutoracePlaceRepositoryFromHtml } from '../../src/repository/implement/autoracePlaceRepositoryFromHtml';
import { AutoraceRaceRepositoryFromHtml } from '../../src/repository/implement/autoraceRaceRepositoryFromHtml';
import { BoatracePlaceRepositoryFromHtml } from '../../src/repository/implement/boatracePlaceRepositoryFromHtml';
import { BoatraceRaceRepositoryFromHtml } from '../../src/repository/implement/boatraceRaceRepositoryFromHtml';
import { JraPlaceRepositoryFromHtml } from '../../src/repository/implement/jraPlaceRepositoryFromHtml';
import { JraRaceRepositoryFromHtml } from '../../src/repository/implement/jraRaceRepositoryFromHtml';
import { KeirinPlaceRepositoryFromHtml } from '../../src/repository/implement/keirinPlaceRepositoryFromHtml';
import { KeirinRaceRepositoryFromHtml } from '../../src/repository/implement/keirinRaceRepositoryFromHtml';
import { NarPlaceRepositoryFromHtml } from '../../src/repository/implement/narPlaceRepositoryFromHtml';
import { NarRaceRepositoryFromHtml } from '../../src/repository/implement/narRaceRepositoryFromHtml';
import { OverseasRaceRepositoryFromHtml } from '../../src/repository/implement/overseasRaceRepositoryFromHtml';
import type { IPlaceRepository } from '../../src/repository/interface/IPlaceRepository';
import type { IRaceRepository } from '../../src/repository/interface/IRaceRepository';
import { MockHorseRacingRaceRepositoryFromHtml } from '../../src/repository/mock/mockHorseRacingRaceRepositoryFromHtml';
import { MockMechanicalRacingRaceRepositoryFromHtml } from '../../src/repository/mock/mockMechanicalRacingRaceRepositoryFromHtml';
import { MockPlaceRepositoryFromHtml } from '../../src/repository/mock/mockPlaceRepositoryFromHtml';
import { allowedEnvs, ENV } from '../../src/utility/env';
// Repositoryの実装クラスをDIコンテナに登録する

// 環境ごとの設定
switch (ENV) {
    case allowedEnvs.production:
    case allowedEnvs.local: {
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'NarRaceRepositoryFromHtml',
            {
                useClass: NarRaceRepositoryFromHtml,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            {
                useClass: NarPlaceRepositoryFromHtml,
            },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'JraRaceRepositoryFromHtml',
            { useClass: JraRaceRepositoryFromHtml },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            {
                useClass: JraPlaceRepositoryFromHtml,
            },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'KeirinRaceRepositoryFromHtml',
            {
                useClass: KeirinRaceRepositoryFromHtml,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: KeirinPlaceRepositoryFromHtml },
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
                useClass: OverseasRaceRepositoryFromHtml,
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
            { useClass: BoatracePlaceRepositoryFromHtml },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'BoatraceRaceRepositoryFromHtml',
            {
                useClass: BoatraceRaceRepositoryFromHtml,
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
                useClass: MockHorseRacingRaceRepositoryFromHtml,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'NarPlaceRepositoryFromHtml',
            {
                useClass: MockPlaceRepositoryFromHtml,
            },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'JraRaceRepositoryFromHtml',
            { useClass: MockHorseRacingRaceRepositoryFromHtml },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'JraPlaceRepositoryFromHtml',
            {
                useClass: MockPlaceRepositoryFromHtml,
            },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'KeirinRaceRepositoryFromHtml',
            {
                useClass: MockMechanicalRacingRaceRepositoryFromHtml,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'KeirinPlaceRepositoryFromHtml',
            { useClass: MockPlaceRepositoryFromHtml },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'AutoraceRaceRepositoryFromHtml',
            {
                useClass: MockMechanicalRacingRaceRepositoryFromHtml,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'AutoracePlaceRepositoryFromHtml',
            { useClass: MockPlaceRepositoryFromHtml },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'OverseasRaceRepositoryFromHtml',
            {
                useClass: MockHorseRacingRaceRepositoryFromHtml,
            },
        );
        container.register<IPlaceRepository<PlaceEntity>>(
            'BoatracePlaceRepositoryFromHtml',
            { useClass: MockPlaceRepositoryFromHtml },
        );
        container.register<IRaceRepository<RaceEntity, PlaceEntity>>(
            'BoatraceRaceRepositoryFromHtml',
            {
                useClass: MockMechanicalRacingRaceRepositoryFromHtml,
            },
        );
        break;
    }
    default: {
        throw new Error('Invalid ENV value');
    }
}
