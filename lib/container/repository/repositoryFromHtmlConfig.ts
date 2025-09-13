import { container } from 'tsyringe';

import { PlaceRepositoryFromHtmlForAWS } from '../../src/repository/implement/placeRepositoryFromHtml';
import { AutoraceRaceRepositoryFromHtmlForAWS } from '../../src/repository/implement/raceRepositoryFromHtml/autoraceRaceRepositoryFromHtml';
import { BoatraceRaceRepositoryFromHtmlForAWS } from '../../src/repository/implement/raceRepositoryFromHtml/boatraceRaceRepositoryFromHtml';
import { JraRaceRepositoryFromHtml } from '../../src/repository/implement/raceRepositoryFromHtml/jraRaceRepositoryFromHtml';
import { KeirinRaceRepositoryFromHtmlForAWS } from '../../src/repository/implement/raceRepositoryFromHtml/keirinRaceRepositoryFromHtml';
import { NarRaceRepositoryFromHtml } from '../../src/repository/implement/raceRepositoryFromHtml/narRaceRepositoryFromHtml';
import { OverseasRaceRepositoryFromHtmlForAWS } from '../../src/repository/implement/raceRepositoryFromHtml/overseasRaceRepositoryFromHtmlForAWS';
import type { IPlaceRepositoryForAWS } from '../../src/repository/interface/IPlaceRepositoryForAWS';
import type { IRaceRepositoryForAWS } from '../../src/repository/interface/IRaceRepositoryForAWS';
import { MockHorseRacingRaceRepositoryFromHtml } from '../../src/repository/mock/mockHorseRacingRaceRepositoryFromHtml';
import { MockMechanicalRacingRaceRepositoryFromHtml } from '../../src/repository/mock/mockMechanicalRacingRaceRepositoryFromHtml';
import { MockPlaceRepositoryFromHtml } from '../../src/repository/mock/mockPlaceRepositoryFromHtml';
import { allowedEnvs, ENV } from '../../src/utility/env';
// Repositoryの実装クラスをDIコンテナに登録する

// 環境ごとの設定
switch (ENV) {
    case allowedEnvs.production:
    case allowedEnvs.local: {
        container.register<IRaceRepositoryForAWS>('NarRaceRepositoryFromHtml', {
            useClass: NarRaceRepositoryFromHtml,
        });
        container.register<IRaceRepositoryForAWS>('JraRaceRepositoryFromHtml', {
            useClass: JraRaceRepositoryFromHtml,
        });
        container.register<IRaceRepositoryForAWS>(
            'KeirinRaceRepositoryFromHtml',
            {
                useClass: KeirinRaceRepositoryFromHtmlForAWS,
            },
        );
        container.register<IRaceRepositoryForAWS>(
            'AutoraceRaceRepositoryFromHtml',
            {
                useClass: AutoraceRaceRepositoryFromHtmlForAWS,
            },
        );
        container.register<IPlaceRepositoryForAWS>('PlaceRepositoryFromHtml', {
            useClass: PlaceRepositoryFromHtmlForAWS,
        });
        container.register<IRaceRepositoryForAWS>(
            'OverseasRaceRepositoryFromHtml',
            {
                useClass: OverseasRaceRepositoryFromHtmlForAWS,
            },
        );
        container.register<IRaceRepositoryForAWS>(
            'AutoraceRaceRepositoryFromHtml',
            {
                useClass: AutoraceRaceRepositoryFromHtmlForAWS,
            },
        );
        container.register<IRaceRepositoryForAWS>(
            'BoatraceRaceRepositoryFromHtml',
            {
                useClass: BoatraceRaceRepositoryFromHtmlForAWS,
            },
        );
        break;
    }
    case allowedEnvs.test:
    case allowedEnvs.localNoInitData:
    case allowedEnvs.localInitMadeData:
    case allowedEnvs.githubActionsCi: {
        container.register<IRaceRepositoryForAWS>('NarRaceRepositoryFromHtml', {
            useClass: MockHorseRacingRaceRepositoryFromHtml,
        });
        container.register<IRaceRepositoryForAWS>('JraRaceRepositoryFromHtml', {
            useClass: MockHorseRacingRaceRepositoryFromHtml,
        });
        container.register<IRaceRepositoryForAWS>(
            'KeirinRaceRepositoryFromHtml',
            {
                useClass: MockMechanicalRacingRaceRepositoryFromHtml,
            },
        );
        container.register<IRaceRepositoryForAWS>(
            'AutoraceRaceRepositoryFromHtml',
            {
                useClass: MockMechanicalRacingRaceRepositoryFromHtml,
            },
        );
        container.register<IPlaceRepositoryForAWS>('PlaceRepositoryFromHtml', {
            useClass: MockPlaceRepositoryFromHtml,
        });
        container.register<IRaceRepositoryForAWS>(
            'OverseasRaceRepositoryFromHtml',
            {
                useClass: MockHorseRacingRaceRepositoryFromHtml,
            },
        );
        container.register<IRaceRepositoryForAWS>(
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
