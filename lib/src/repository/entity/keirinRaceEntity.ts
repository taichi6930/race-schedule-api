import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import { CalendarData } from '../../domain/calendarData';
import type { KeirinRaceData } from '../../domain/keirinRaceData';
import type { KeirinRacePlayerData } from '../../domain/keirinRacePlayerData';
import { KeirinRacePlayerRecord } from '../../gateway/record/keirinRacePlayerRecord';
import { KeirinRaceRecord } from '../../gateway/record/keirinRaceRecord';
import { KeirinPlaceCodeMap } from '../../utility/data/common/raceCourse';
import {
    type KeirinRaceId,
    validateKeirinRaceId,
} from '../../utility/data/keirin/keirinRaceId';
import {
    getYoutubeLiveUrl,
    KeirinYoutubeUserIdMap,
} from '../../utility/data/movie';
import { getJSTDate } from '../../utility/date';
import { createAnchorTag, formatDate } from '../../utility/format';
import { getKeirinGoogleCalendarColorId } from '../../utility/googleCalendar';
import {
    generateKeirinRaceId,
    generateKeirinRacePlayerId,
} from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRaceEntity } from './iRaceEntity';

/**
 * 競輪のレース開催データ
 */
export class KeirinRaceEntity implements IRaceEntity<KeirinRaceEntity> {
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
        public readonly id: KeirinRaceId,
        public readonly raceData: KeirinRaceData,
        public readonly racePlayerDataList: KeirinRacePlayerData[],
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
        raceData: KeirinRaceData,
        racePlayerDataList: KeirinRacePlayerData[],
        updateDate: Date,
    ): KeirinRaceEntity {
        return new KeirinRaceEntity(
            validateKeirinRaceId(id),
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
        raceData: KeirinRaceData,
        racePlayerDataList: KeirinRacePlayerData[],
        updateDate: Date,
    ): KeirinRaceEntity {
        return KeirinRaceEntity.create(
            generateKeirinRaceId(
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
    public copy(partial: Partial<KeirinRaceEntity> = {}): KeirinRaceEntity {
        return KeirinRaceEntity.create(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.racePlayerDataList ?? this.racePlayerDataList,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * KeirinRaceRecordに変換する
     */
    public toRaceRecord(): KeirinRaceRecord {
        return KeirinRaceRecord.create(
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
            id: generateKeirinRaceId(
                this.raceData.dateTime,
                this.raceData.location,
                this.raceData.number,
            ),
            summary: `${this.raceData.stage} ${this.raceData.name}`,
            location: `${this.raceData.location}競輪場`,
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
            colorId: getKeirinGoogleCalendarColorId(this.raceData.grade),
            description:
                `発走: ${this.raceData.dateTime.getXDigitHours(2)}:${this.raceData.dateTime.getXDigitMinutes(2)}
                ${createAnchorTag('レース情報（netkeirin）', `https://netkeirin.page.link/?link=https%3A%2F%2Fkeirin.netkeiba.com%2Frace%2Fentry%2F%3Frace_id%3D${format(this.raceData.dateTime, 'yyyyMMdd')}${KeirinPlaceCodeMap[this.raceData.location]}${this.raceData.number.toXDigits(2)}`)}
                ${createAnchorTag('レース映像（YouTube）', getYoutubeLiveUrl(KeirinYoutubeUserIdMap[this.raceData.location]))}
                更新日時: ${format(getJSTDate(updateDate), 'yyyy/MM/dd HH:mm:ss')}
            `.replace(/\n\s+/g, '\n'),
            extendedProperties: {
                private: {
                    raceId: this.id,
                    name: this.raceData.name,
                    stage: this.raceData.stage,
                    dateTime: formatDate(this.raceData.dateTime),
                    location: this.raceData.location,
                    grade: this.raceData.grade,
                    number: this.raceData.number.toString(),
                    updateDate: formatDate(this.updateDate),
                },
            },
        };
    }

    public static fromGoogleCalendarDataToCalendarData(
        event: calendar_v3.Schema$Event,
    ): CalendarData {
        return CalendarData.create(
            event.id,
            RaceType.KEIRIN,
            event.summary,
            event.start?.dateTime,
            event.end?.dateTime,
            event.location,
            event.description,
        );
    }

    /**
     * KeirinRacePlayerRecordに変換する
     */
    public toPlayerRecordList(): KeirinRacePlayerRecord[] {
        return this.racePlayerDataList.map((playerData) =>
            KeirinRacePlayerRecord.create(
                generateKeirinRacePlayerId(
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
