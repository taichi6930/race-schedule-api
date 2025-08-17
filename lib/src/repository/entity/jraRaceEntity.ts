import '../../utility/format';

import type { HeldDayData } from '../../domain/heldDayData';
import type { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import type { RaceData } from '../../domain/raceData';
import { HorseRacingRaceRecord } from '../../gateway/record/horseRacingRaceRecord';
import type { RaceId } from '../../utility/data/common/raceId';
import {
    generateRaceId,
    validateRaceId,
} from '../../utility/data/common/raceId';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRaceEntity } from './iRaceEntity';

/**
 * 中央競馬のレース開催データ
 */
export class JraRaceEntity implements IRaceEntity<JraRaceEntity> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceData - レースデータ
     * @param heldDayData - 開催日データ
     * @param conditionData - レース条件データ
     * @param updateDate - 更新日時
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: RaceId,
        public readonly raceData: RaceData,
        public readonly heldDayData: HeldDayData,
        public readonly conditionData: HorseRaceConditionData,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceData - レースデータ
     * @param heldDayData - 開催日データ
     * @param conditionData - レース条件データ
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceData: RaceData,
        heldDayData: HeldDayData,
        conditionData: HorseRaceConditionData,
        updateDate: Date,
    ): JraRaceEntity {
        return new JraRaceEntity(
            validateRaceId(raceData.raceType, id),
            raceData,
            heldDayData,
            conditionData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param raceData - レースデータ
     * @param heldDayData - 開催日データ
     * @param conditionData - レース条件データ
     * @param updateDate - 更新日時
     */
    public static createWithoutId(
        raceData: RaceData,
        heldDayData: HeldDayData,
        conditionData: HorseRaceConditionData,
        updateDate: Date,
    ): JraRaceEntity {
        return JraRaceEntity.create(
            generateRaceId(
                raceData.raceType,
                raceData.dateTime,
                raceData.location,
                raceData.number,
            ),
            raceData,
            heldDayData,
            conditionData,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<JraRaceEntity> = {}): JraRaceEntity {
        return JraRaceEntity.create(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.heldDayData ?? this.heldDayData,
            partial.conditionData ?? this.conditionData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * JraRaceRecordに変換する
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
