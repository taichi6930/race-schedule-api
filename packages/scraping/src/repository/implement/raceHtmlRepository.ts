import { RaceType } from '@race-schedule/shared/src/types/raceType';
import { Logger } from '@race-schedule/shared/src/utilities/logger';
import { format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import type { IR2Gateway } from '../../gateway/interface/IR2Gateway';
import { IRaceDataHtmlGateway } from '../../gateway/interface/iRaceDataHtmlGateway';
import { IRaceHtmlRepository } from '../interface/IRaceHtmlRepository';

/**
 * race HTMLリポジトリ
 */
@injectable()
export class RaceHtmlR2Repository implements IRaceHtmlRepository {
    public constructor(
        @inject('R2Gateway') private readonly r2Gateway: IR2Gateway,
        @inject('RaceDataHtmlGateway')
        private readonly raceDataHtmlGateway: IRaceDataHtmlGateway,
    ) {}

    @Logger
    public async fetchRaceHtml(
        raceType: RaceType,
        date: Date,
        location?: string,
        number?: number,
    ): Promise<string> {
        const html = await this.raceDataHtmlGateway.fetch(
            raceType,
            date,
            location,
            number,
        );
        await this.saveRaceHtml(raceType, date, html, location, number);
        return html;
    }

    @Logger
    public async loadRaceHtml(
        raceType: RaceType,
        date: Date,
        location?: string,
        number?: number,
    ): Promise<string | null> {
        const key = this.generateCacheKey(raceType, date, location, number);
        const html = await this.r2Gateway.getObject(key);
        return html;
    }

    @Logger
    public async saveRaceHtml(
        raceType: RaceType,
        date: Date,
        html: string,
        location?: string,
        number?: number,
    ): Promise<void> {
        const key = this.generateCacheKey(raceType, date, location, number);

        await this.r2Gateway.putObject(key, html, 'text/html');
    }

    /**
     * R2キャッシュキーを生成
     * @param raceType - レース種別
     * @param date - 日付
     * @param location - 開催場所
     * @param number - レース番号
     * @returns キャッシュキー
     */
    private generateCacheKey(
        raceType: RaceType,
        date: Date,
        location?: string,
        number?: number,
    ): string {
        const dateStr = format(date, 'yyyyMMdd');
        const locationPart = location ? `_${location}` : '';
        const numberPart = number === undefined ? '' : `_R${number}`;
        return `race/${raceType}${dateStr}${locationPart}${numberPart}.html`;
    }
}
