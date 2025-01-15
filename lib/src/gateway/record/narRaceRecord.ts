import '../../utility/format';

import { NarRaceData } from '../../domain/narRaceData';
import { NarRaceEntity } from '../../repository/entity/narRaceEntity';
import {
    type NarGradeType,
    validateNarGradeType,
} from '../../utility/data/nar/narGradeType';
import {
    type NarRaceCourse,
    validateNarRaceCourse,
} from '../../utility/data/nar/narRaceCourse';
import {
    type NarRaceCourseType,
    validateNarRaceCourseType,
} from '../../utility/data/nar/narRaceCourseType';
import {
    type NarRaceDateTime,
    validateNarRaceDateTime,
} from '../../utility/data/nar/narRaceDateTime';
import {
    type NarRaceDistance,
    validateNarRaceDistance,
} from '../../utility/data/nar/narRaceDistance';
import {
    type NarRaceName,
    validateNarRaceName,
} from '../../utility/data/nar/narRaceName';
import {
    type NarRaceNumber,
    validateNarRaceNumber,
} from '../../utility/data/nar/narRaceNumber';
import { type NarRaceId, validateNarRaceId } from '../../utility/raceId';

/**
 * 地方競馬のレース開催データ
 */
export class NarRaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * 地方競馬のレース開催データを生成する
     * @param id - ID
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     * @param updateDate - 更新日時
     *
     */
    private constructor(
        public readonly id: NarRaceId,
        public readonly name: NarRaceName,
        public readonly dateTime: NarRaceDateTime,
        public readonly location: NarRaceCourse,
        public readonly surfaceType: NarRaceCourseType,
        public readonly distance: NarRaceDistance,
        public readonly grade: NarGradeType,
        public readonly number: NarRaceNumber,
        public readonly updateDate: Date,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param name - レース名
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param surfaceType - 馬場種別
     * @param distance - 距離
     * @param grade - グレード
     * @param number - レース番号
     * @param updateDate - 更新日時
     */
    static create(
        id: string,
        name: string,
        dateTime: Date,
        location: string,
        surfaceType: string,
        distance: number,
        grade: string,
        number: number,
        updateDate: Date,
    ): NarRaceRecord {
        try {
            return new NarRaceRecord(
                validateNarRaceId(id),
                validateNarRaceName(name),
                validateNarRaceDateTime(dateTime),
                validateNarRaceCourse(location),
                validateNarRaceCourseType(surfaceType),
                validateNarRaceDistance(distance),
                validateNarGradeType(grade),
                validateNarRaceNumber(number),
                updateDate,
            );
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<NarRaceRecord> = {}): NarRaceRecord {
        return NarRaceRecord.create(
            partial.id ?? this.id,
            partial.name ?? this.name,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.surfaceType ?? this.surfaceType,
            partial.distance ?? this.distance,
            partial.grade ?? this.grade,
            partial.number ?? this.number,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * NarRaceEntityに変換する
     * @returns
     */
    toEntity(): NarRaceEntity {
        return new NarRaceEntity(
            this.id,
            NarRaceData.create(
                this.name,
                this.dateTime,
                this.location,
                this.surfaceType,
                this.distance,
                this.grade,
                this.number,
            ),
            this.updateDate,
        );
    }
}
