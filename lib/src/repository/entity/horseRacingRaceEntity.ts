import '../../utility/format';

import type { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import type { RaceData } from '../../domain/raceData';
import { HorseRacingRaceRecord } from '../../gateway/record/horseRacingRaceRecord';
import {
    generateRaceId,
    type RaceId,
    validateRaceId,
} from '../../utility/data/common/raceId';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';

/**
 * 地方競馬のレース開催データ
 */
export class HorseRacingRaceEntity {
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceData - レースデータ
     * @param conditionData - レース条件データ
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
     * @param conditionData - レース条件データ
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceData: RaceData,
        conditionData: HorseRaceConditionData,
        updateDate: Date,
    ): HorseRacingRaceEntity {
        return new HorseRacingRaceEntity(
            validateRaceId(raceData.raceType, id),
            raceData,
            conditionData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param raceData - レースデータ
     * @param conditionData - レース条件データ
     * @param updateDate - 更新日時
     */
    public static createWithoutId(
        raceData: RaceData,
        conditionData: HorseRaceConditionData,
        updateDate: Date,
    ): HorseRacingRaceEntity {
        return HorseRacingRaceEntity.create(
            generateRaceId(
                raceData.raceType,
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
     * @param partial - 上書きする部分データ
     */
    public copy(
        partial: Partial<HorseRacingRaceEntity> = {},
    ): HorseRacingRaceEntity {
        return HorseRacingRaceEntity.create(
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
