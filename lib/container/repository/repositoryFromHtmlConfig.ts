import { container } from 'tsyringe';

import { PlaceRepositoryFromHtmlForAWS } from '../../src/repository/implement/placeRepositoryFromHtml';
import { BoatraceRaceRepositoryFromHtmlForAWS } from '../../src/repository/implement/raceRepositoryFromHtml/boatraceRaceRepositoryFromHtml';
import { KeirinRaceRepositoryFromHtmlForAWS } from '../../src/repository/implement/raceRepositoryFromHtml/keirinRaceRepositoryFromHtml';
import type { IPlaceRepositoryForAWS } from '../../src/repository/interface/IPlaceRepositoryForAWS';
import type { IRaceRepositoryForAWS } from '../../src/repository/interface/IRaceRepositoryForAWS';
import { MockMechanicalRacingRaceRepositoryFromHtml } from '../../src/repository/mock/mockMechanicalRacingRaceRepositoryFromHtml';
import { MockPlaceRepositoryFromHtml } from '../../src/repository/mock/mockPlaceRepositoryFromHtml';
import { allowedEnvs, ENV } from '../../src/utility/env';
// Repositoryの実装クラスをDIコンテナに登録する

// 環境ごとの設定
switch (ENV) {
    case allowedEnvs.production:
    case allowedEnvs.local: {
        container.register<IPlaceRepositoryForAWS>('PlaceRepositoryFromHtml', {
            useClass: PlaceRepositoryFromHtmlForAWS,
        });
        container.register<IRaceRepositoryForAWS>(
            'KeirinRaceRepositoryFromHtml',
            {
                useClass: KeirinRaceRepositoryFromHtmlForAWS,
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
        container.register<IPlaceRepositoryForAWS>('PlaceRepositoryFromHtml', {
            useClass: MockPlaceRepositoryFromHtml,
        });
        container.register<IRaceRepositoryForAWS>(
            'KeirinRaceRepositoryFromHtml',
            {
                useClass: MockMechanicalRacingRaceRepositoryFromHtml,
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
