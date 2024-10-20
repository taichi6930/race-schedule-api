import { format } from 'date-fns';

import { KeirinPlaceData } from '../../domain/keirinPlaceData';
import { KEIRIN_PLACE_CODE } from '../../utility/data/keirin';
import type { KeirinRaceCourse } from '../../utility/data/raceSpecific';

/**
 * Repository層のEntity 競輪のレース開催場所データ
 */
export class KeirinPlaceEntity {
    /**
     * ID
     */
    public readonly id: string;

    /**
     * コンストラクタ
     *
     * @remarks
     * 競輪のレース開催場所データを生成する
     * @param id - ID
     * @param placeData - 開催場所データ
     */
    constructor(
        id: string | null,
        public readonly placeData: KeirinPlaceData,
    ) {
        this.id = id ?? this.generateId(placeData.dateTime, placeData.location);
    }

    /**
     * IDを生成する
     *
     * @private
     * @param dateTime - 開催日時
     * @param location - 開催場所
     * @returns 生成されたID
     */
    private generateId(dateTime: Date, location: KeirinRaceCourse): string {
        return `keirin${format(dateTime, 'yyyyMMdd')}${KEIRIN_PLACE_CODE[location]}`;
    }
}
