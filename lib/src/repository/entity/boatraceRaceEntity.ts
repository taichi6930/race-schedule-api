import '../../utility/format';

import type { BoatraceRaceData } from '../../domain/boatraceRaceData';
import type { BoatraceRacePlayerData } from '../../domain/boatraceRacePlayerData';
import { BoatraceRacePlayerRecord } from '../../gateway/record/boatraceRacePlayerRecord';
import { BoatraceRaceRecord } from '../../gateway/record/boatraceRaceRecord';
import type { BoatraceRaceId } from '../../utility/raceId';
import {
    generateBoatraceRaceId,
    generateBoatraceRacePlayerId,
} from '../../utility/raceId';

/**
 * ボートレースのレース開催データ
 */
export class BoatraceRaceEntity {
    /**
     * ID
     */
    public readonly id: BoatraceRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     * @param racePlayerDataList - レースの選手データ
     * @param updateDate - 更新日時
     *
     */
    constructor(
        id: BoatraceRaceId | null,
        public readonly raceData: BoatraceRaceData,
        public readonly racePlayerDataList: BoatraceRacePlayerData[],
        public readonly updateDate: Date,
    ) {
        this.id =
            id ??
            generateBoatraceRaceId(
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
    copy(partial: Partial<BoatraceRaceEntity> = {}): BoatraceRaceEntity {
        return new BoatraceRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.racePlayerDataList ?? this.racePlayerDataList,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * BoatraceRaceRecordに変換する
     * @returns
     */
    toRaceRecord(): BoatraceRaceRecord {
        return new BoatraceRaceRecord(
            this.id,
            this.raceData.name,
            this.raceData.stage,
            this.raceData.dateTime,
            this.raceData.location,
            this.raceData.grade,
            this.raceData.number,
            this.updateDate,
        );
    }

    /**
     * BoatraceRacePlayerRecordに変換する
     * @returns
     */
    toPlayerRecordList(): BoatraceRacePlayerRecord[] {
        return this.racePlayerDataList.map(
            (playerData) =>
                new BoatraceRacePlayerRecord(
                    generateBoatraceRacePlayerId(
                        this.raceData.dateTime,
                        this.raceData.location,
                        this.raceData.number,
                        playerData.positionNumber,
                    ),
                    this.id,
                    playerData.positionNumber,
                    playerData.playerNumber,
                    this.updateDate,
                ),
        );
    }
}
