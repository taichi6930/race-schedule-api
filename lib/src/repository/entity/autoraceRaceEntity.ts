import '../../utility/format';

import { format } from 'date-fns';
import type { calendar_v3 } from 'googleapis';

import type { AutoraceRaceData } from '../../domain/autoraceRaceData';
import { CalendarData } from '../../domain/calendarData';
import type { RacePlayerData } from '../../domain/racePlayerData';
import { AutoraceRaceRecord } from '../../gateway/record/autoraceRaceRecord';
import { RacePlayerRecord } from '../../gateway/record/racePlayerRecord';
import { type RaceId, validateRaceId } from '../../utility/data/common/raceId';
import { getJSTDate } from '../../utility/date';
import { formatDate } from '../../utility/format';
import { getAutoraceGoogleCalendarColorId } from '../../utility/googleCalendar';
import {
    generateAutoraceRaceId,
    generateAutoraceRacePlayerId,
} from '../../utility/raceId';
import { RaceType } from '../../utility/raceType';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRaceEntity } from './iRaceEntity';

/**
 * オートレースのレース開催データ
 */
export class AutoraceRaceEntity implements IRaceEntity<AutoraceRaceEntity> {
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
        public readonly id: RaceId,
        public readonly raceData: AutoraceRaceData,
        public readonly racePlayerDataList: RacePlayerData[],
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
        raceData: AutoraceRaceData,
        racePlayerDataList: RacePlayerData[],
        updateDate: Date,
    ): AutoraceRaceEntity {
        return new AutoraceRaceEntity(
            validateRaceId(RaceType.AUTORACE, id),
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
        raceData: AutoraceRaceData,
        racePlayerDataList: RacePlayerData[],
        updateDate: Date,
    ): AutoraceRaceEntity {
        return AutoraceRaceEntity.create(
            generateAutoraceRaceId(
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
    public copy(partial: Partial<AutoraceRaceEntity> = {}): AutoraceRaceEntity {
        return AutoraceRaceEntity.create(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.racePlayerDataList ?? this.racePlayerDataList,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * AutoraceRaceRecordに変換する
     */
    public toRaceRecord(): AutoraceRaceRecord {
        return AutoraceRaceRecord.create(
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
            id: generateAutoraceRaceId(
                this.raceData.dateTime,
                this.raceData.location,
                this.raceData.number,
            ),
            summary: `${this.raceData.stage} ${this.raceData.name}`,
            location: `${this.raceData.location}オートレース場`,
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
            colorId: getAutoraceGoogleCalendarColorId(this.raceData.grade),
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
            RaceType.AUTORACE,
            event.summary,
            event.start?.dateTime,
            event.end?.dateTime,
            event.location,
            event.description,
        );
    }

    /**
     * AutoraceRacePlayerRecordに変換する
     */
    public toPlayerRecordList(): RacePlayerRecord[] {
        return this.racePlayerDataList.map((playerData) =>
            RacePlayerRecord.create(
                generateAutoraceRacePlayerId(
                    this.raceData.dateTime,
                    this.raceData.location,
                    this.raceData.number,
                    playerData.positionNumber,
                ),
                RaceType.AUTORACE,
                this.id,
                playerData.positionNumber,
                playerData.playerNumber,
                this.updateDate,
            ),
        );
    }
}
