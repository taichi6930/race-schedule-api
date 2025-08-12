import '../../utility/format';

import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../domain/calendarData';
import type { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import type { RaceData } from '../../domain/raceData';
import { NarRaceRecord } from '../../gateway/record/narRaceRecord';
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
    public toRaceRecord(): NarRaceRecord {
        return NarRaceRecord.create(
            this.id,
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

    public static fromGoogleCalendarDataToCalendarData(
        event: calendar_v3.Schema$Event,
    ): CalendarData {
        return CalendarData.create(
            event.id,
            RaceType.NAR,
            event.summary,
            event.start?.dateTime,
            event.end?.dateTime,
            event.location,
            event.description,
        );
    }

    // public static fromGoogleCalendarDataToRaceEntity(
    //     event: calendar_v3.Schema$Event,
    // ): NarRaceEntity {
    //     return NarRaceEntity.create(
    //         event.extendedProperties?.private?.raceId ?? '',
    //         NarRaceData.create(
    //             event.extendedProperties?.private?.name ?? '',
    //             new Date(event.extendedProperties?.private?.dateTime ?? ''),
    //             event.extendedProperties?.private?.location ?? '',
    //             event.extendedProperties?.private?.surfaceType ?? '',
    //             Number(event.extendedProperties?.private?.distance),
    //             event.extendedProperties?.private?.grade ?? '',
    //             Number(event.extendedProperties?.private?.number),
    //         ),
    //         validateUpdateDate(event.extendedProperties?.private?.updateDate),
    //     );
    // }
}
