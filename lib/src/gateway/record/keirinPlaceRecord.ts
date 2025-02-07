import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KeirinPlaceEntity } from '../../repository/entity/keirinPlaceEntity';
import {
    type KeirinGradeType,
    validateKeirinGradeType,
} from '../../utility/data/keirin/keirinGradeType';
import {
    type KeirinPlaceId,
    validateKeirinPlaceId,
} from '../../utility/data/keirin/keirinPlaceId';
import {
    type KeirinRaceCourse,
    validateKeirinRaceCourse,
} from '../../utility/data/keirin/keirinRaceCourse';
import {
    type KeirinRaceDate,
    validateKeirinRaceDate,
} from '../../utility/data/keirin/keirinRaceDate';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';

/**
 * Repository層のRecord 競輪のレース開催場所データ
 */
export class KeirinPlaceRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * レース開催場所データを生成する
     * @param id - ID
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param grade - グレード
     * @param updateDate - 更新日時
     */
    private constructor(
        public readonly id: KeirinPlaceId,
        public readonly dateTime: KeirinRaceDate,
        public readonly location: KeirinRaceCourse,
        public readonly grade: KeirinGradeType,
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
        id: string,
        dateTime: Date,
        location: string,
        grade: string,
        updateDate: Date,
    ): KeirinPlaceRecord {
        try {
            return new KeirinPlaceRecord(
                validateKeirinPlaceId(id),
                validateKeirinRaceDate(dateTime),
                validateKeirinRaceCourse(location),
                validateKeirinGradeType(grade),
                validateUpdateDate(updateDate),
            );
        } catch (error) {
            throw new Error(
                `KeirinPlaceRecord create error: ${(error as Error).message}`,
            );
        }
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(partial: Partial<KeirinPlaceRecord> = {}): KeirinPlaceRecord {
        return KeirinPlaceRecord.create(
            partial.id ?? this.id,
            partial.dateTime ?? this.dateTime,
            partial.location ?? this.location,
            partial.grade ?? this.grade,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * KeirinPlaceEntityに変換する
     * @returns
     */
    toEntity(): KeirinPlaceEntity {
        return KeirinPlaceEntity.create(
            this.id,
            KeirinPlaceData.create(this.dateTime, this.location, this.grade),
            this.updateDate,
        );
    }
}
