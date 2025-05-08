import type { SearchPlayerFilterEntity } from '../entity/searchPlayerFilterEntity';

export interface IPlayerQueryBuilder {
    buildFetchByRaceTypeQuery: () => string;
    getParams: (filter: SearchPlayerFilterEntity) => Record<string, string>;
}
