import { PlaceId } from '@race-schedule/shared/src/types/placeId';
import { inject, injectable } from 'tsyringe';

import type { IR2Gateway } from '../../gateway/interface/IR2Gateway';
import { IPlaceHtmlRepository } from '../interface/IPlaceHtmlRepository';

/**
 * place HTMLリポジトリ
 */
@injectable()
export class PlaceHtmlR2Repository implements IPlaceHtmlRepository {
    public constructor(
        @inject('R2Gateway') private readonly r2Gateway: IR2Gateway,
    ) {}

    public async fetchPlaceHtml(placeId: PlaceId): Promise<string> {
        // Webから直接取得する実装はここでは行わない
        throw new Error(`Not implemented ${placeId}`);
    }

    public async loadPlaceHtml(placeId: PlaceId): Promise<string | null> {
        const key = `place/${placeId}.html`;
        const buffer = await this.r2Gateway.getObject(key);
        return buffer ? buffer.toString('utf8') : null;
    }

    public async savePlaceHtml(placeId: PlaceId, html: string): Promise<void> {
        const key = `place/${placeId}.html`;
        await this.r2Gateway.putObject(key, html, 'text/html');
    }
}
