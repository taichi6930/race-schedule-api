import '../../utility/format';

import type { BoatraceRaceId } from '../../utility/raceId';

/**
 * ボートレースのレース選手データ
 */
export class BoatraceRacePlayerRecord {
    /**
     * コンストラクタ
     *
     * @remarks
     * ボートレースのレース開催データを生成する
     * @param id - ID
     * @param raceId - レースID
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     *
     *
     */
    constructor(
        public readonly id: string,
        public readonly raceId: BoatraceRaceId,
        public readonly positionNumber: number,
        public readonly playerNumber: number,
    ) {}

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(
        partial: Partial<BoatraceRacePlayerRecord> = {},
    ): BoatraceRacePlayerRecord {
        return new BoatraceRacePlayerRecord(
            partial.id ?? this.id,
            partial.raceId ?? this.raceId,
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }
}
