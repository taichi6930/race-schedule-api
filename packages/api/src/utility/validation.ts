import type { RaceType } from '@race-schedule/shared/src/types/raceType';

export class ValidationError extends Error {
    public readonly status: number;

    public constructor(message: string, status = 400) {
        super(message);
        this.name = 'ValidationError';
        this.status = status;
    }
}

/**
 * race_type文字列をRaceTypeに変換する
 */
const validateRaceType = (raceType: string): RaceType => {
    const validRaceTypes = ['JRA', 'NAR', 'KEIRIN', 'AUTORACE', 'BOATRACE'];
    if (!validRaceTypes.includes(raceType)) {
        throw new Error(`Invalid race_type: ${raceType}`);
    }
    return raceType as RaceType;
};

/**
 * race_type文字列の配列をRaceType配列に変換する
 */
const convertRaceTypeList = (raceTypeValues: string[]): RaceType[] => {
    return raceTypeValues
        .map((v) => {
            try {
                return validateRaceType(v);
            } catch {
                return null;
            }
        })
        .filter((v): v is RaceType => v !== null);
};

/**
 * URLSearchParamsからraceTypeリストを取得する
 */
export const parseRaceTypeListFromSearch = (
    searchParams: URLSearchParams,
): RaceType[] => {
    const raceTypeValues = searchParams.getAll('raceType');
    const raceTypeList = convertRaceTypeList(raceTypeValues);
    if (raceTypeList.length === 0) {
        throw new ValidationError('Invalid raceType');
    }
    return raceTypeList;
};
