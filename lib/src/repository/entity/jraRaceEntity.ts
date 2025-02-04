import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../domain/calendarData';
import { JraRaceData } from '../../domain/jraRaceData';
import { JraRaceRecord } from '../../gateway/record/jraRaceRecord';
import type { JraRaceId } from '../../utility/data/jra/jraRaceId';
import { NetkeibaBabacodeMap } from '../../utility/data/netkeiba';
import { getJSTDate } from '../../utility/date';
import { createAnchorTag, formatDate } from '../../utility/format';
import { getJraGoogleCalendarColorId } from '../../utility/googleCalendar';
import { generateJraRaceId } from '../../utility/raceId';

/**
 * 中央競馬のレース開催データ
 */
export class JraRaceEntity {
    /**
     * ID
     */
    public readonly id: JraRaceId;

    /**
     * コンストラクタ
     *
     * @remarks
     * 中央競馬のレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     * @param updateDate - 更新日時
     */
    constructor(
        id: JraRaceId | null,
        public readonly raceData: JraRaceData,
        public readonly updateDate: Date,
    ) {
        this.id =
            id ??
            generateJraRaceId(
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
    copy(partial: Partial<JraRaceEntity> = {}): JraRaceEntity {
        return new JraRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * JraRaceRecordに変換する
     * @returns
     */
    toRecord(): JraRaceRecord {
        return JraRaceRecord.create(
            this.id,
            this.raceData.name,
            this.raceData.dateTime,
            this.raceData.location,
            this.raceData.surfaceType,
            this.raceData.distance,
            this.raceData.grade,
            this.raceData.number,
            this.raceData.heldTimes,
            this.raceData.heldDayTimes,
            this.updateDate,
        );
    }

    /**
     * レースデータをGoogleカレンダーのイベントに変換する
     * @param raceEntity
     * @returns
     */
    toGoogleCalendarData(
        updateDate: Date = new Date(),
    ): calendar_v3.Schema$Event {
        return {
            id: generateJraRaceId(
                this.raceData.dateTime,
                this.raceData.location,
                this.raceData.number,
            ),
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
            colorId: getJraGoogleCalendarColorId(this.raceData.grade),
            description:
                `距離: ${this.raceData.surfaceType}${this.raceData.distance.toString()}m
                    発走: ${this.raceData.dateTime.getXDigitHours(2)}:${this.raceData.dateTime.getXDigitMinutes(2)}
                    ${createAnchorTag('レース情報', `https://netkeiba.page.link/?link=https%3A%2F%2Frace.sp.netkeiba.com%2Frace%2Fshutuba.html%3Frace_id%3D${this.raceData.dateTime.getFullYear().toString()}${NetkeibaBabacodeMap[this.raceData.location]}${this.raceData.heldTimes.toXDigits(2)}${this.raceData.heldDayTimes.toXDigits(2)}${this.raceData.number.toXDigits(2)}`)}
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
                    heldTimes: this.raceData.heldTimes.toString(),
                    heldDayTimes: this.raceData.heldDayTimes.toString(),
                    updateDate: this.updateDate.toISOString(),
                },
            },
        };
    }

    static fromGoogleCalendarDataToCalendarData(
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

    static fromGoogleCalendarDataToRaceEntity(
        event: calendar_v3.Schema$Event,
    ): JraRaceEntity {
        return new JraRaceEntity(
            event.extendedProperties?.private?.raceId ?? '',
            JraRaceData.create(
                event.extendedProperties?.private?.name ?? '',
                new Date(event.extendedProperties?.private?.dateTime ?? ''),
                event.extendedProperties?.private?.location ?? '',
                event.extendedProperties?.private?.surfaceType ?? '',
                Number(event.extendedProperties?.private?.distance ?? -1),
                event.extendedProperties?.private?.grade ?? '',
                Number(event.extendedProperties?.private?.number ?? -1),
                Number(event.extendedProperties?.private?.heldTimes ?? -1),
                Number(event.extendedProperties?.private?.heldDayTimes ?? -1),
            ),
            new Date(event.extendedProperties?.private?.updateDate ?? ''),
        );
    }
}
