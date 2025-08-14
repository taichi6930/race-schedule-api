import { RacePlayerData } from '../../../../../lib/src/domain/racePlayerData';
import { createMaxFrameNumber } from '../../../../../lib/src/utility/data/common/positionNumber';
import type { RaceType } from '../../../../../lib/src/utility/raceType';

/**
 * 基本的なレースプレイヤーデータのリストを生成します。
 * @param raceType - レース種別
 */
export const baseRacePlayerDataList = (raceType: RaceType): RacePlayerData[] =>
    Array.from({ length: createMaxFrameNumber(raceType) }, (_, i) => {
        return RacePlayerData.create(raceType, i + 1, i + 1);
    });
