import { RacePlayerData } from '../../../../../lib/src/domain/racePlayerData';
import { RaceType } from '../../../../../lib/src/utility/raceType';

/**
 * 基本的なレースプレイヤーデータのリストを生成します。
 * @param raceType
 */
export const baseRacePlayerDataList = (raceType: RaceType): RacePlayerData[] =>
    Array.from({ length: createMaxFrameNumber(raceType) }, (_, i) => {
        return RacePlayerData.create(raceType, i + 1, i + 1);
    });

/**
 * 枠順の最高値を取得します。
 * @param playerDataList
 * @param raceType
 */
export const createMaxFrameNumber = (raceType: RaceType): number => {
    switch (raceType) {
        case RaceType.BOATRACE: {
            return 6;
        }
        case RaceType.AUTORACE: {
            return 8;
        }
        case RaceType.KEIRIN: {
            return 9;
        }
        case RaceType.JRA: {
            return 18;
        }
        case RaceType.NAR: {
            return 16;
        }
        case RaceType.WORLD: {
            // 一旦大きめに48にする
            return 48;
        }
        default: {
            return 0;
        }
    }
};
