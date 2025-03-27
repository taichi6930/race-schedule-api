import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../domain/calendarData';
import type { WorldRaceData } from '../../domain/worldRaceData';
import { WorldRaceRecord } from '../../gateway/record/worldRaceRecord';
import type { WorldRaceId } from '../../utility/data/world/worldRaceId';
import { getJSTDate } from '../../utility/date';
import { formatDate } from '../../utility/format';
import { getWorldGoogleCalendarColorId } from '../../utility/googleCalendar';
import { generateWorldRaceId } from '../../utility/raceId';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRaceEntity } from './iRaceEntity';

/**
 * 海外競馬のレース開催データ
 */
export class WorldRaceEntity implements IRaceEntity<WorldRaceEntity> {
    /**
     * コンストラクタ
     * @remarks
     * レース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: WorldRaceId,
        public readonly raceData: WorldRaceData,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceData - レースデータ
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceData: WorldRaceData,
        updateDate: Date,
    ): WorldRaceEntity {
        return new WorldRaceEntity(
            id,
            raceData,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param raceData
     * @param updateDate
     */
    public static createWithoutId(
        raceData: WorldRaceData,
        updateDate: Date,
    ): WorldRaceEntity {
        return WorldRaceEntity.create(
            generateWorldRaceId(
                raceData.dateTime,
                raceData.location,
                raceData.number,
            ),
            raceData,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial
     */
    public copy(partial: Partial<WorldRaceEntity> = {}): WorldRaceEntity {
        return new WorldRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * WorldRaceRecordに変換する
     */
    public toRaceRecord(): WorldRaceRecord {
        return WorldRaceRecord.create(
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

    /**
     * レースデータをGoogleカレンダーのイベントに変換する
     * @param updateDate - 更新日時
     */
    public toGoogleCalendarData(
        updateDate: Date = new Date(),
    ): calendar_v3.Schema$Event {
        return {
            id: generateWorldRaceId(
                this.raceData.dateTime,
                this.raceData.location,
                this.raceData.number,
            )
                // GoogleカレンダーのIDにwxyzは入れられない
                // そのため、wxyzを置換する
                // TODO: 正しい置換方法を検討する
                .replace(/w/g, 'vv')
                .replace(/x/g, 'cs')
                .replace(/y/g, 'v')
                .replace(/z/g, 's')
                .replace(/-/g, ''),
            summary: this.raceData.name,
            location: `${this.raceData.location}競馬場`,
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
            colorId: getWorldGoogleCalendarColorId(this.raceData.grade),
            description:
                `距離: ${this.raceData.surfaceType}${this.raceData.distance.toString()}m
                発走: ${this.raceData.dateTime.getXDigitHours(2)}:${this.raceData.dateTime.getXDigitMinutes(2)}
                更新日時: ${format(getJSTDate(updateDate), 'yyyy/MM/dd HH:mm:ss')}
            `.replace(/\n\s+/g, '\n'),
            extendedProperties: {
                private: {
                    raceId: this.id,
                    name: this.raceData.name,
                    dateTime: this.raceData.dateTime.toISOString(),
                    location: this.raceData.location,
                    distance: this.raceData.distance.toString(),
                    surfaceType: this.raceData.surfaceType,
                    grade: this.raceData.grade,
                    number: this.raceData.number.toString(),
                    updateDate: this.updateDate.toISOString(),
                },
            },
        };
    }

    public static fromGoogleCalendarDataToCalendarData(
        event: calendar_v3.Schema$Event,
    ): CalendarData {
        return CalendarData.create(
            event.id,
            event.summary,
            event.start?.dateTime,
            event.end?.dateTime,
            event.location,
            event.description,
        );
    }
}
