import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import type { BoatraceRaceData } from '../../domain/boatraceRaceData';
import type { BoatraceRacePlayerData } from '../../domain/boatraceRacePlayerData';
import { CalendarData } from '../../domain/calendarData';
import { BoatraceRacePlayerRecord } from '../../gateway/record/boatraceRacePlayerRecord';
import { BoatraceRaceRecord } from '../../gateway/record/boatraceRaceRecord';
import {
    type BoatraceRaceId,
    validateBoatraceRaceId,
} from '../../utility/data/boatrace/boatraceRaceId';
import { getJSTDate } from '../../utility/date';
import { formatDate } from '../../utility/format';
import { getBoatraceGoogleCalendarColorId } from '../../utility/googleCalendar';
import {
    generateBoatraceRaceId,
    generateBoatraceRacePlayerId,
} from '../../utility/raceId';
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
     * @param racePlayerDataList - レースの選手データ
     * @param updateDate - 更新日時
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: BoatraceRaceId,
        public readonly raceData: BoatraceRaceData,
        public readonly racePlayerDataList: BoatraceRacePlayerData[],
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceData - レースデータ
     * @param racePlayerDataList - レースの選手データ
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceData: BoatraceRaceData,
        racePlayerDataList: BoatraceRacePlayerData[],
        updateDate: Date,
    ): BoatraceRaceEntity {
        return new BoatraceRaceEntity(
            validateBoatraceRaceId(id),
            raceData,
            racePlayerDataList,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param raceData
     * @param racePlayerDataList
     * @param updateDate
     */
    public static createWithoutId(
        raceData: BoatraceRaceData,
        racePlayerDataList: BoatraceRacePlayerData[],
        updateDate: Date,
    ): BoatraceRaceEntity {
        return BoatraceRaceEntity.create(
            generateBoatraceRaceId(
                raceData.dateTime,
                raceData.location,
                raceData.number,
            ),
            raceData,
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
            partial.racePlayerDataList ?? this.racePlayerDataList,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * BoatraceRaceRecordに変換する
     */
    public toRaceRecord(): BoatraceRaceRecord {
        return BoatraceRaceRecord.create(
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
     * レースデータをGoogleカレンダーのイベントに変換する
     * @param updateDate - 更新日時
     */
    public toGoogleCalendarData(
        updateDate: Date = new Date(),
    ): calendar_v3.Schema$Event {
        return {
            id: generateBoatraceRaceId(
                this.raceData.dateTime,
                this.raceData.location,
                this.raceData.number,
            ),
            summary: `${this.raceData.stage} ${this.raceData.name}`,
            location: `${this.raceData.location}ボートレース場`,
            start: {
                dateTime: formatDate(this.raceData.dateTime),
                timeZone: 'Asia/Tokyo',
            },
            end: {
                // 終了時刻は発走時刻から10分後とする
                dateTime: formatDate(
                    new Date(this.raceData.dateTime.getTime() + 10 * 60 * 1000),
                ),
                timeZone: 'Asia/Tokyo',
            },
            colorId: getBoatraceGoogleCalendarColorId(this.raceData.grade),
            description:
                `発走: ${this.raceData.dateTime.getXDigitHours(2)}:${this.raceData.dateTime.getXDigitMinutes(2)}
                          更新日時: ${format(getJSTDate(updateDate), 'yyyy/MM/dd HH:mm:ss')}
                  `.replace(/\n\s+/g, '\n'),
        };
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
    public toPlayerRecordList(): BoatraceRacePlayerRecord[] {
        return this.racePlayerDataList.map((playerData) =>
            BoatraceRacePlayerRecord.create(
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
