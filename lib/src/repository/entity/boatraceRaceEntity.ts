import '../../utility/format';

import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../domain/calendarData';
import type { RaceData } from '../../domain/raceData';
import type { RacePlayerData } from '../../domain/racePlayerData';
import { RacePlayerRecord } from '../../gateway/record/racePlayerRecord';
import { RaceRecord } from '../../gateway/record/raceRecord';
import { type RaceId, validateRaceId } from '../../utility/data/common/raceId';
import type { RaceStage } from '../../utility/data/common/raceStage';
import { generateRaceId, generateRacePlayerId } from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRaceEntity } from './iRaceEntity';

/**
 * ボートレースのレース開催データ
 */
export class BoatraceRaceEntity implements IRaceEntity<BoatraceRaceEntity> {
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceData - レースデータ
     * @param stage - 開催ステージ
     * @param racePlayerDataList - レースの選手データ
     * @param updateDate - 更新日時
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: RaceId,
        public readonly raceData: RaceData,
        public readonly stage: RaceStage,
        public readonly racePlayerDataList: RacePlayerData[],
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceData - レースデータ
     * @param stage - 開催ステージ
     * @param racePlayerDataList - レースの選手データ
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceData: RaceData,
        stage: RaceStage,
        racePlayerDataList: RacePlayerData[],
        updateDate: Date,
    ): BoatraceRaceEntity {
        return new BoatraceRaceEntity(
            validateRaceId(raceData.raceType, id),
            raceData,
            stage,
            racePlayerDataList,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param raceData
     * @param stage
     * @param racePlayerDataList
     * @param updateDate
     */
    public static createWithoutId(
        raceData: RaceData,
        stage: RaceStage,
        racePlayerDataList: RacePlayerData[],
        updateDate: Date,
    ): BoatraceRaceEntity {
        return BoatraceRaceEntity.create(
            generateRaceId(
                raceData.raceType,
                raceData.dateTime,
                raceData.location,
                raceData.number,
            ),
            raceData,
            stage,
            racePlayerDataList,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<BoatraceRaceEntity> = {}): BoatraceRaceEntity {
        return BoatraceRaceEntity.create(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.stage ?? this.stage,
            partial.racePlayerDataList ?? this.racePlayerDataList,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * BoatraceRaceRecordに変換する
     */
    public toRaceRecord(): RaceRecord {
        return RaceRecord.create(
            this.id,
            this.raceData.raceType,
            this.raceData.name,
            this.stage,
            this.raceData.dateTime,
            this.raceData.location,
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
            RaceType.BOATRACE,
            event.summary,
            event.start?.dateTime,
            event.end?.dateTime,
            event.location,
            event.description,
        );
    }

    /**
     * BoatraceRacePlayerRecordに変換する
     */
    public toPlayerRecordList(): RacePlayerRecord[] {
        return this.racePlayerDataList.map((playerData) =>
            RacePlayerRecord.create(
                generateRacePlayerId(
                    this.raceData.raceType,
                    this.raceData.dateTime,
                    this.raceData.location,
                    this.raceData.number,
                    playerData.positionNumber,
                ),
                this.raceData.raceType,
                this.id,
                playerData.positionNumber,
                playerData.playerNumber,
                this.updateDate,
            ),
        );
    }
}
