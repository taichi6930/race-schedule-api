import { RaceType } from './raceType';

/**
 * 「競馬場」「競輪場」「オートレース場」などの文言を表示するためのユーティリティ
 * @param raceType
 */
export function getVenueTypeLabel(raceType: RaceType): string {
    switch (raceType) {
        case RaceType.JRA:
        case RaceType.NAR:
        case RaceType.WORLD: {
            return '競馬場';
        }
        case RaceType.KEIRIN: {
            return '競輪場';
        }
        case RaceType.AUTORACE: {
            return 'オートレース場';
        }
        case RaceType.BOATRACE: {
            return 'ボートレース場';
        }
        default: {
            return '不明な競技場';
        }
    }
}
