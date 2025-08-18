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
import { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRaceEntity } from './iRaceEntity';

/**
 * 競馬のレース開催データ
 */
export class RaceEntity implements IRaceEntity<RaceEntity> {
    private readonly _heldDayData: HeldDayData | undefined;
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
        public readonly heldDayData: HeldDayData | undefined,
        public readonly conditionData: HorseRaceConditionData,
        public readonly updateDate: UpdateDate,
    ) {
        this._heldDayData = heldDayData;
    }

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
        heldDayData: HeldDayData | undefined,
        conditionData: HorseRaceConditionData,
        updateDate: Date,
    ): RaceEntity {
        try {
            if (
                (raceData.raceType === RaceType.JRA &&
                    heldDayData === undefined) ||
                (raceData.raceType !== RaceType.JRA &&
                    heldDayData !== undefined)
            ) {
                throw new Error(`HeldDayData is incorrect`);
            }
            return new RaceEntity(
                validateRaceId(raceData.raceType, id),
                raceData,
                heldDayData,
                conditionData,
                validateUpdateDate(updateDate),
            );
        } catch {
            throw new Error(`Failed to create RaceEntity:
                id: ${id},
                raceData: ${JSON.stringify(raceData)},
                heldDayData: ${JSON.stringify(heldDayData)},
                conditionData: ${JSON.stringify(conditionData)},
                updateDate: ${JSON.stringify(updateDate)}
            `);
        }
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
        heldDayData: HeldDayData | undefined,
        conditionData: HorseRaceConditionData,
        updateDate: Date,
    ): RaceEntity {
        return RaceEntity.create(
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
    public copy(partial: Partial<RaceEntity> = {}): RaceEntity {
        return RaceEntity.create(
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
