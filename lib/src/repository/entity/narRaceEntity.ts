import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../domain/calendarData';
import type { NarRaceData } from '../../domain/narRaceData';
import { NarRaceRecord } from '../../gateway/record/narRaceRecord';
import {
    CHIHO_KEIBA_LIVE_URL,
    ChihoKeibaYoutubeUserIdMap,
    getYoutubeLiveUrl,
} from '../../utility/data/movie';
import { NarBabacodeMap } from '../../utility/data/nar/narRaceCourse';
import {
    type NarRaceId,
    validateNarRaceId,
} from '../../utility/data/nar/narRaceId';
import { NetkeibaBabacodeMap } from '../../utility/data/netkeiba';
import { getJSTDate } from '../../utility/date';
import { createAnchorTag, formatDate } from '../../utility/format';
import { getNarGoogleCalendarColorId } from '../../utility/googleCalendar';
import { generateNarRaceId } from '../../utility/raceId';
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
     * @param updateDate - 更新日時
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: NarRaceId,
        public readonly raceData: NarRaceData,
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
        raceData: NarRaceData,
        updateDate: Date,
    ): NarRaceEntity {
        return new NarRaceEntity(
            validateNarRaceId(id),
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
        raceData: NarRaceData,
        updateDate: Date,
    ): NarRaceEntity {
        return NarRaceEntity.create(
            generateNarRaceId(
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
    public copy(partial: Partial<NarRaceEntity> = {}): NarRaceEntity {
        return NarRaceEntity.create(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
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
            id: generateNarRaceId(
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
            colorId: getNarGoogleCalendarColorId(this.raceData.grade),
            description:
                `距離: ${this.raceData.surfaceType}${this.raceData.distance.toString()}m
                発走: ${this.raceData.dateTime.getXDigitHours(2)}:${this.raceData.dateTime.getXDigitMinutes(2)}
                ${createAnchorTag('レース映像（地方競馬LIVE）', CHIHO_KEIBA_LIVE_URL)}
                ${createAnchorTag('レース映像（YouTube）', getYoutubeLiveUrl(ChihoKeibaYoutubeUserIdMap[this.raceData.location]))}
                ${createAnchorTag('レース情報（netkeiba）', `https://netkeiba.page.link/?link=https%3A%2F%2Fnar.sp.netkeiba.com%2Frace%2Fshutuba.html%3Frace_id%3D${this.raceData.dateTime.getFullYear().toString()}${NetkeibaBabacodeMap[this.raceData.location]}${(this.raceData.dateTime.getMonth() + 1).toXDigits(2)}${this.raceData.dateTime.getDate().toXDigits(2)}${this.raceData.number.toXDigits(2)}`)}
                ${createAnchorTag('レース情報（NAR）', `https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/DebaTable?k_RaceDateTime=${this.raceData.dateTime.getFullYear().toString()}%2f${this.raceData.dateTime.getXDigitMonth(2)}%2f${this.raceData.dateTime.getXDigitDays(2)}&k_raceNo=${this.raceData.number.toXDigits(2)}&k_babaCode=${NarBabacodeMap[this.raceData.location]}`)}
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
