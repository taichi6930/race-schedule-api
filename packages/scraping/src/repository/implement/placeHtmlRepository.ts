import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import type { IPlaceDataHtmlGateway } from '../../gateway/interface/iPlaceDataHtmlGateway';
import type { IR2Gateway } from '../../gateway/interface/IR2Gateway';
import type { IPlaceHtmlRepository } from '../interface/IPlaceHtmlRepository';

/**
 * place HTMLリポジトリ
 * キャッシュ有効期限: 1週間
 */
@injectable()
export class PlaceHtmlR2Repository implements IPlaceHtmlRepository {
    private static readonly CACHE_EXPIRATION_MS =
        7 * 24 * 60 * 60 * 1000; // 1週間

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
        const key: string =
            raceType === 'JRA'
                ? `place/${raceType as string}${date.getFullYear()}.html`
                : `place/${raceType as string}${format(date, 'yyyyMM')}.html`;
        const result = await this.r2Gateway.getObjectWithMetadata(key);
        if (!result) return null;

        // キャッシュが有効期限切れの場合はnullを返す
        const age = Date.now() - result.uploaded.getTime();
        if (age > PlaceHtmlR2Repository.CACHE_EXPIRATION_MS) {
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
        const key: string =
            raceType === 'JRA'
                ? `place/${raceType as string}${date.getFullYear()}.html`
                : `place/${raceType as string}${format(date, 'yyyyMM')}.html`;

        await this.r2Gateway.putObject(key, html, 'text/html');
    }
}
