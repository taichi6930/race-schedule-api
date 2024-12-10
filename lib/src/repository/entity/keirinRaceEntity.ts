import '../../utility/format';

import type { KeirinRaceData } from '../../domain/keirinRaceData';
import type { KeirinRacePlayerData } from '../../domain/keirinRacePlayerData';
import { KeirinRacePlayerRecord } from '../../gateway/record/keirinRacePlayerRecord';
import { KeirinRaceRecord } from '../../gateway/record/keirinRaceRecord';
import type { KeirinRaceId } from '../../utility/raceId';
import {
    generateKeirinRaceId,
    generateKeirinRacePlayerId,
} from '../../utility/raceId';

/**
 * 競輪のレース開催データ
 */
export class KeirinRaceEntity {
    /**
     * ID
     */
    public readonly id: KeirinRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     * @param racePlayerDataList - レースの選手データ
     *
     */
    constructor(
        id: KeirinRaceId | null,
        public readonly raceData: KeirinRaceData,
        public readonly racePlayerDataList: KeirinRacePlayerData[],
    ) {
        this.id =
            id ??
            generateKeirinRaceId(
                raceData.dateTime,
                raceData.location,
                raceData.number,
            );
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinRaceEntity> = {}): KeirinRaceEntity {
        return new KeirinRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.racePlayerDataList ?? this.racePlayerDataList,
        );
    }

    /**
     * KeirinRaceRecordに変換する
     * @returns
     */
    toRaceRecord(): KeirinRaceRecord {
        return new KeirinRaceRecord(
            this.id,
            this.raceData.name,
            this.raceData.stage,
            this.raceData.dateTime,
            this.raceData.location,
            this.raceData.grade,
            this.raceData.number,
        );
    }

    /**
     * KeirinRacePlayerRecordに変換する
     * @returns
     */
    toPlayerRecordList(): KeirinRacePlayerRecord[] {
        return this.racePlayerDataList.map(
            (playerData) =>
                new KeirinRacePlayerRecord(
                    generateKeirinRacePlayerId(
                        this.raceData.dateTime,
                        this.raceData.location,
                        this.raceData.number,
                        playerData.positionNumber,
                    ),
                    this.id,
                    playerData.positionNumber,
                    playerData.playerNumber,
                ),
        );
    }
}
