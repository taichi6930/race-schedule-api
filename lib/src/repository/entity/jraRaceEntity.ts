import '../../utility/format';

import type { HeldDayData } from '../../domain/heldDayData';
import type { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import type { RaceData } from '../../domain/raceData';
import { JraRaceRecord } from '../../gateway/record/jraRaceRecord';
import type { RaceId } from '../../utility/data/common/raceId';
import { validateRaceId } from '../../utility/data/common/raceId';
import { generateRaceId } from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
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
     * @param heldDayData
     * @param conditionData
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
     * @param heldDayData
     * @param conditionData
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
            validateRaceId(RaceType.JRA, id),
            raceData,
            heldDayData,
            conditionData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param raceData
     * @param heldDayData
     * @param conditionData
     * @param updateDate
     */
    public static createWithoutId(
        raceData: RaceData,
        heldDayData: HeldDayData,
        conditionData: HorseRaceConditionData,
        updateDate: Date,
    ): JraRaceEntity {
        return JraRaceEntity.create(
            generateRaceId(
                RaceType.JRA,
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
     * @param partial
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
    public toRaceRecord(): JraRaceRecord {
        return JraRaceRecord.create(
            this.id,
            this.raceData.name,
            this.raceData.dateTime,
            this.raceData.location,
            this.conditionData.surfaceType,
            this.conditionData.distance,
            this.raceData.grade,
            this.raceData.number,
            this.heldDayData.heldTimes,
            this.heldDayData.heldDayTimes,
            this.updateDate,
        );
    }
}
