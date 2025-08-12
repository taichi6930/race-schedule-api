import '../../utility/format';

import type { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import type { RaceData } from '../../domain/raceData';
import { HorseRacingRaceRecord } from '../../gateway/record/horseRacingRaceRecord';
import { type RaceId, validateRaceId } from '../../utility/data/common/raceId';
import { generateRaceId } from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';

/**
 * 地方競馬のレース開催データ
 */
export class NarRaceEntity {
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceData - レースデータ
     * @param conditionData
     * @param updateDate - 更新日時
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: RaceId,
        public readonly raceData: RaceData,
        public readonly conditionData: HorseRaceConditionData,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceData - レースデータ
     * @param conditionData
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceData: RaceData,
        conditionData: HorseRaceConditionData,
        updateDate: Date,
    ): NarRaceEntity {
        return new NarRaceEntity(
            validateRaceId(RaceType.NAR, id),
            raceData,
            conditionData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param raceData
     * @param conditionData
     * @param updateDate
     */
    public static createWithoutId(
        raceData: RaceData,
        conditionData: HorseRaceConditionData,
        updateDate: Date,
    ): NarRaceEntity {
        return NarRaceEntity.create(
            generateRaceId(
                RaceType.NAR,
                raceData.dateTime,
                raceData.location,
                raceData.number,
            ),
            raceData,
            conditionData,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<NarRaceEntity> = {}): NarRaceEntity {
        return NarRaceEntity.create(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.conditionData ?? this.conditionData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * NarRaceRecordに変換する
     */
    public toRaceRecord(): HorseRacingRaceRecord {
        return HorseRacingRaceRecord.create(
            this.id,
            this.raceData.raceType,
            this.raceData.name,
            this.raceData.dateTime,
            this.raceData.location,
            this.conditionData.surfaceType,
            this.conditionData.distance,
            this.raceData.grade,
            this.raceData.number,
            this.updateDate,
        );
    }
}
