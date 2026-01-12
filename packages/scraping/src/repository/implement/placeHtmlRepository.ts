import { RaceType } from '@race-schedule/shared';
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

    public async fetchPlaceHtml(
        raceType: RaceType,
        date: Date,
    ): Promise<string> {
        return this.placeDataHtmlGateway.getPlaceDataHtml(raceType, date);
    }

    public async loadPlaceHtml(
        raceType: RaceType,
        date: Date,
    ): Promise<string | null> {
        const key = `place/${raceType}${date.toISOString().slice(0, 6)}.html`;
        const buffer = await this.r2Gateway.getObject(key);
        return buffer ? buffer.toString('utf8') : null;
    }

    public async savePlaceHtml(
        raceType: RaceType,
        date: Date,
        html: string,
    ): Promise<void> {
        const key = `place/${raceType}${date.toISOString().slice(0, 6)}.html`;
        await this.r2Gateway.putObject(key, html, 'text/html');
    }
}
