import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../domain/calendarData';
import type { JraRaceData } from '../../domain/jraRaceData';
import { JraRaceRecord } from '../../gateway/record/jraRaceRecord';
import { validateRaceId } from '../../utility/data/common/raceId';
import type { RaceId } from '../../utility/data/jra/jraRaceId';
import { NetkeibaBabacodeMap } from '../../utility/data/netkeiba';
import {
    createNetkeibaJraRaceVideoUrl,
    createNetkeibaJraShutubaUrl,
} from '../../utility/data/url';
import { getJSTDate } from '../../utility/date';
import { createAnchorTag, formatDate } from '../../utility/format';
import { getJraGoogleCalendarColorId } from '../../utility/googleCalendar';
import { generateJraRaceId } from '../../utility/raceId';
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
     * @param updateDate - 更新日時
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: RaceId,
        public readonly raceData: JraRaceData,
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
        raceData: JraRaceData,
        updateDate: Date,
    ): JraRaceEntity {
        return new JraRaceEntity(
            validateRaceId(RaceType.JRA, id),
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
        raceData: JraRaceData,
        updateDate: Date,
    ): JraRaceEntity {
        return JraRaceEntity.create(
            generateJraRaceId(
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
    public copy(partial: Partial<JraRaceEntity> = {}): JraRaceEntity {
        return new JraRaceEntity(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
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
     * @param updateDate - 更新日時
     */
    public toGoogleCalendarData(
        updateDate: Date = new Date(),
    ): calendar_v3.Schema$Event {
        const raceIdForNetkeiba = `${this.raceData.dateTime.getFullYear().toString()}${NetkeibaBabacodeMap[this.raceData.location]}${this.raceData.heldTimes.toXDigits(2)}${this.raceData.heldDayTimes.toXDigits(2)}${this.raceData.number.toXDigits(2)}`;
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
                    ${createAnchorTag(
                        'レース情報',
                        `https://netkeiba.page.link/?link=${encodeURIComponent(
                            createNetkeibaJraShutubaUrl(raceIdForNetkeiba),
                        )}`,
                    )}
                    ${createAnchorTag(
                        'レース動画',
                        `https://netkeiba.page.link/?link=${encodeURIComponent(
                            createNetkeibaJraRaceVideoUrl(raceIdForNetkeiba),
                        )}`,
                    )}
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

    public static fromGoogleCalendarDataToCalendarData(
        event: calendar_v3.Schema$Event,
    ): CalendarData {
        return CalendarData.create(
            event.id,
            RaceType.JRA,
            event.summary,
            event.start?.dateTime,
            event.end?.dateTime,
            event.location,
            event.description,
        );
    }

    // public static fromGoogleCalendarDataToRaceEntity(
    //     event: calendar_v3.Schema$Event,
    // ): JraRaceEntity {
    //     return new JraRaceEntity(
    //         validateRaceId(RaceType.JRA,event.extendedProperties?.private?.raceId ?? ''),
    //         JraRaceData.create(
    //             event.extendedProperties?.private?.name ?? '',
    //             new Date(event.extendedProperties?.private?.dateTime ?? ''),
    //             event.extendedProperties?.private?.location ?? '',
    //             event.extendedProperties?.private?.surfaceType ?? '',
    //             Number(event.extendedProperties?.private?.distance),
    //             event.extendedProperties?.private?.grade ?? '',
    //             Number(event.extendedProperties?.private?.number),
    //             Number(event.extendedProperties?.private?.heldTimes),
    //             Number(event.extendedProperties?.private?.heldDayTimes),
    //         ),
    //         validateUpdateDate(event.extendedProperties?.private?.updateDate),
    //     );
    // }
}
