import { format } from 'date-fns';

import { KeirinRaceData } from '../../domain/keirinRaceData';
import { KEIRIN_PLACE_CODE } from '../../utility/data/keirin';
import type { KeirinRaceCourse } from '../../utility/data/raceSpecific';

/**
 * 競輪のレース開催データ
 */
export class KeirinRaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催データを生成する
     * @param id - ID
     * @param raceData - レースデータ
     */
    constructor(
        id: string | null,
        public readonly raceData: KeirinRaceData, // レースデータ
    ) {
        this.id =
            id ??
            this.generateId(
                raceData.dateTime,
                raceData.location,
                raceData.number,
            );
    }

    /**
     * IDを生成する
     *
     * @private
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @param number - レース番号
     * @returns 生成されたID
     */
    private generateId(
        dateTime: Date,
        location: KeirinRaceCourse,
        number: number,
    ): string {
        return `keirin${format(dateTime, 'yyyyMMdd')}${KEIRIN_PLACE_CODE[location]}${number.toXDigits(2)}`;
    }
}
