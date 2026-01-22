import type { RaceType } from '../../../../packages/shared/src/types/raceType';
import type { RaceCourse } from '../../../../packages/shared/src/utilities/raceCourse';

/**
 * レース開催場所の検索フィルター
 *
 * 検索終了日も含めて検索をする仕様とする
 * レース種別リスト、開催場所リストは複数指定可能とする
 * また、指定がない場合は全てのレース種別、開催場所を対象とする
 *
 * @property startDate - 検索開始日
 * @property finishDate - 検索終了日
 * @property raceTypeList - レース種別リスト
 * @property locationList - 開催場所リスト
 */
export class OldSearchPlaceFilterEntity {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceTypeList: RaceType[],
        public readonly locationList: RaceCourse[],
    ) {}
}
