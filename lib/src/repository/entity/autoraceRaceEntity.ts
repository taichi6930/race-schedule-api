import '../../utility/format';

import type { AutoraceRaceData } from '../../domain/autoraceRaceData';
import type { AutoraceRacePlayerData } from '../../domain/autoraceRacePlayerData';
import { AutoraceRacePlayerRecord } from '../../gateway/record/autoraceRacePlayerRecord';
import { AutoraceRaceRecord } from '../../gateway/record/autoraceRaceRecord';
import type { AutoraceRaceId } from '../../utility/raceId';
import {
    generateAutoraceRaceId,
    generateAutoraceRacePlayerId,
} from '../../utility/raceId';

/**
 * オートレースのレース開催データ
 */
export class AutoraceRaceEntity {
    /**
     * ID
     */
    public readonly id: AutoraceRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     * @param racePlayerDataList - レースの選手データ
     * @param updateDate - 更新日時
     *
     */
    constructor(
        id: AutoraceRaceId | null,
        public readonly raceData: AutoraceRaceData,
        public readonly racePlayerDataList: AutoraceRacePlayerData[],
        public readonly updateDate: Date,
    ) {
        this.id =
            id ??
            generateAutoraceRaceId(
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
    copy(partial: Partial<AutoraceRaceEntity> = {}): AutoraceRaceEntity {
        return new AutoraceRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.racePlayerDataList ?? this.racePlayerDataList,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * AutoraceRaceRecordに変換する
     * @returns
     */
    toRaceRecord(): AutoraceRaceRecord {
        return new AutoraceRaceRecord(
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
     * AutoraceRacePlayerRecordに変換する
     * @returns
     */
    toPlayerRecordList(): AutoraceRacePlayerRecord[] {
        return this.racePlayerDataList.map(
            (playerData) =>
                new AutoraceRacePlayerRecord(
                    generateAutoraceRacePlayerId(
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
