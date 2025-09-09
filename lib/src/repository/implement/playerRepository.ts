import '../../utility/format';

import { inject, injectable } from 'tsyringe';

import { RaceType } from '../../../../src/utility/raceType';
import { IS3Gateway } from '../../gateway/interface/iS3Gateway';
import { PlayerRecord } from '../../gateway/record/playerRecord';
import { CSV_FILE_NAME, CSV_HEADER_KEYS } from '../../utility/constants';
import { Logger } from '../../utility/logger';
import { PlayerEntityForAWS } from '../entity/playerEntity';
import { SearchPlayerFilterEntityForAWS } from '../entity/searchPlayerFilterEntity';
import { IPlayerRepository } from '../interface/IPlayerRepository';

@injectable()
export class PlayerRepository implements IPlayerRepository {
    public constructor(
        @inject('S3Gateway')
        private readonly s3Gateway: IS3Gateway,
    ) {}

    /**
     * 開催データを取得する
     * このメソッドで日付の範囲を指定して開催データを取得する
     * @param searchFilter
     */
    @Logger
    public async findAll(
        searchFilter: SearchPlayerFilterEntityForAWS,
    ): Promise<PlayerEntityForAWS[]> {
        // 開催データを取得
        const playerRecordList: PlayerRecord[] =
            await this.getPlayerRecordListFromS3(searchFilter.raceType);

        return playerRecordList.map((playerRecord) => playerRecord.toEntity());
    }

    /**
     * S3からプレイヤーデータを取得する
     * @param raceType - レース種別
     */
    @Logger
    private async getPlayerRecordListFromS3(
        raceType: RaceType,
    ): Promise<PlayerRecord[]> {
        const csv = await this.s3Gateway.fetchDataFromS3(
            `data/`,
            CSV_FILE_NAME.PLAYER_LIST,
        );

        // ファイルが空の場合は空のリストを返す
        if (!csv) {
            return [];
        }

        // CSVを行ごとに分割
        const lines = csv.split('\n');

        // ヘッダー行を解析
        const headers = lines[0].split(',');

        // ヘッダーに基づいてインデックスを取得
        const indices = {
            playerNo: headers.indexOf(CSV_HEADER_KEYS.PLAYER_NO),
            playerName: headers.indexOf(CSV_HEADER_KEYS.PLAYER_NAME),
            priority: headers.indexOf(CSV_HEADER_KEYS.PRIORITY),
        };

        const playerRecordList: PlayerRecord[] = lines
            .slice(1)
            .flatMap((line: string): PlayerRecord[] => {
                try {
                    const columns = line.split(',');

                    return [
                        PlayerRecord.create(
                            raceType,
                            columns[indices.playerNo],
                            columns[indices.playerName],
                            Number.parseInt(columns[indices.priority], 10),
                        ),
                    ];
                } catch (error) {
                    console.error(error);
                    return [];
                }
            });

        return playerRecordList;
    }
}
