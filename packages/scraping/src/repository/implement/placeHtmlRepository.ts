import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import type { IPlaceDataHtmlGateway } from '../../gateway/interface/iPlaceDataHtmlGateway';
import type { IR2Gateway } from '../../gateway/interface/IR2Gateway';
import type { IPlaceHtmlRepository } from '../interface/IPlaceHtmlRepository';

/**
 * place HTMLリポジトリ
 */
@injectable()
export class PlaceHtmlR2Repository implements IPlaceHtmlRepository {
    /** キャッシュ有効期限: 1週間（ミリ秒） */
    private static readonly CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

    public constructor(
        @inject('R2Gateway') private readonly r2Gateway: IR2Gateway,
        @inject('PlaceDataHtmlGateway')
        private readonly placeDataHtmlGateway: IPlaceDataHtmlGateway,
    ) {}

    @Logger
    public async fetchPlaceHtml(
        raceType: RaceType,
        date: Date,
    ): Promise<string> {
        const html = await this.placeDataHtmlGateway.fetch(raceType, date);
        await this.savePlaceHtml(raceType, date, html);
        return html;
    }

    @Logger
    public async loadPlaceHtml(
        raceType: RaceType,
        date: Date,
    ): Promise<string | null> {
        const key = this.generateCacheKey(raceType, date);
        const result = await this.r2Gateway.getObjectWithMetadata(key);
        if (!result) return null;

        // キャッシュが1週間以上前のものであれば期限切れとしてnullを返す
        const age = Date.now() - result.uploaded.getTime();
        if (age > PlaceHtmlR2Repository.CACHE_MAX_AGE_MS) {
            return null;
        }
        return result.body;
    }

    @Logger
    public async savePlaceHtml(
        raceType: RaceType,
        date: Date,
        html: string,
    ): Promise<void> {
        const key = this.generateCacheKey(raceType, date);
        await this.r2Gateway.putObject(key, html, 'text/html');
    }

    private generateCacheKey(raceType: RaceType, date: Date): string {
        return raceType === 'JRA'
            ? `place/${raceType as string}${date.getFullYear()}.html`
            : `place/${raceType as string}${format(date, 'yyyyMM')}.html`;
    }
}
