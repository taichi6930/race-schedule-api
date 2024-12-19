import '../../utility/format';

import type { WorldRaceData } from '../../domain/worldRaceData';
import { WorldRaceRecord } from '../../gateway/record/worldRaceRecord';
import type { WorldRaceId } from '../../utility/raceId';
import { generateWorldRaceId } from '../../utility/raceId';

/**
 * 海外競馬のレース開催データ
 */
export class WorldRaceEntity {
    /**
     * ID
     */
    public readonly id: WorldRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * 海外競馬のレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     * @param updateDate - 更新日時
     */
    constructor(
        id: WorldRaceId | null,
        public readonly raceData: WorldRaceData,
        public readonly updateDate: Date,
    ) {
        this.id =
            id ??
            generateWorldRaceId(
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
    copy(partial: Partial<WorldRaceEntity> = {}): WorldRaceEntity {
        return new WorldRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * WorldRaceRecordに変換する
     * @returns
     */
    toRecord(): WorldRaceRecord {
        return new WorldRaceRecord(
            this.id,
            this.raceData.name,
            this.raceData.dateTime,
            this.raceData.location,
            this.raceData.surfaceType,
            this.raceData.distance,
            this.raceData.grade,
            this.raceData.number,
            this.updateDate,
        );
    }
}
