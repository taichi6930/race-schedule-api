import 'reflect-metadata';

import { injectable } from 'tsyringe';

/**
 * 公営競技のレース情報コントローラー
 */
@injectable()
export class PublicGamblingController {
    /**
     * 選手データを取得する
     * @param req - リクエスト
     * @param res - レスポンス
     */
    public async getPlayerDataList(): Promise<string> {
        return 'getPlayerDataList';
    }
}
