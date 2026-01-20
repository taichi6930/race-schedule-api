import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { IPlaceDataHtmlGateway } from '../../gateway/interface/iPlaceDataHtmlGateway';
import type { IR2Gateway } from '../../gateway/interface/IR2Gateway';
import { IPlaceHtmlRepository } from '../interface/IPlaceHtmlRepository';

/**
 * place HTMLリポジトリ
 */
@injectable()
export class PlaceHtmlR2Repository implements IPlaceHtmlRepository {
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
        const html = await this.r2Gateway.getObject(key);
        return html;
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
