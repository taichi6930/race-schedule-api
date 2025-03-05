import { AutoracePlaceData } from '../../domain/autoracePlaceData';
import { AutoracePlaceEntity } from '../../repository/entity/autoracePlaceEntity';
import {
    type AutoraceGradeType,
    validateAutoraceGradeType,
} from '../../utility/data/autorace/autoraceGradeType';
import type { AutoracePlaceId } from '../../utility/data/autorace/autoracePlaceId';
import { validateAutoracePlaceId } from '../../utility/data/autorace/autoracePlaceId';
import {
    type AutoraceRaceCourse,
    validateAutoraceRaceCourse,
} from '../../utility/data/autorace/autoraceRaceCourse';
import {
    type AutoraceRaceDateTime,
    validateAutoraceRaceDateTime,
} from '../../utility/data/autorace/autoraceRaceDateTime';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRecord } from './iRecord';

/**
 * Repository層のRecord オートレースのレース開催場所データ
 */
export class AutoracePlaceRecord implements IRecord<AutoracePlaceRecord> {
    /**
     * コンストラクタ
     * @remarks
     * レース開催場所データを生成する
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: AutoracePlaceId,
        public readonly dateTime: AutoraceRaceDateTime,
        public readonly location: AutoraceRaceCourse,
        public readonly grade: AutoraceGradeType,
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param updateDate - 更新日時
     */
    static create(
        id: AutoracePlaceId,
        dateTime: Date,
        location: string,
        grade: string,
        updateDate: Date,
    ): AutoracePlaceRecord {
        try {
            return new AutoracePlaceRecord(
                validateAutoracePlaceId(id),
                validateAutoraceRaceDateTime(dateTime),
                validateAutoraceRaceCourse(location),
                validateAutoraceGradeType(grade),
                validateUpdateDate(updateDate),
            );
        } catch (e) {
            throw new Error(
                `Failed to create AutoracePlaceRecord: ${(e as Error).message}`,
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     */
    copy(partial: Partial<AutoracePlaceRecord> = {}): AutoracePlaceRecord {
        return AutoracePlaceRecord.create(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * AutoracePlaceEntityに変換する
     */
    toEntity(): AutoracePlaceEntity {
        return AutoracePlaceEntity.create(
            this.id,
            AutoracePlaceData.create(this.dateTime, this.location, this.grade),
            this.updateDate,
        );
    }
}
