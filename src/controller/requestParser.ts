import { SearchRaceFilterEntity } from '../repository/entity/filter/searchRaceFilterEntity';
import type { RaceType } from '../utility/raceType';
import { convertRaceTypeList } from '../utility/raceType';

export class ValidationError extends Error {
    public readonly status: number;

    public constructor(message: string, status = 400) {
        super(message);
        this.name = 'ValidationError';
        this.status = status;
    }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const toStringArray = (value: unknown): string[] => {
    if (value == null) return [];
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === 'string') return [value];
    return [];
};

const validateDateString = (
    dateStr: string | null | undefined,
    fieldName: string,
): string => {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        throw new ValidationError(`Invalid ${fieldName}`);
    }
    return dateStr;
};

const ensureDateRange = (
    startDate: string | null | undefined,
    finishDate: string | null | undefined,
): { start: Date; finish: Date } => {
    const s = validateDateString(startDate, 'startDate');
    const f = validateDateString(finishDate, 'finishDate');
    return {
        start: new Date(s),
        finish: new Date(f),
    };
};

const ensureRaceTypeList = (raceTypeValues: string[]): RaceType[] => {
    const raceTypeList = convertRaceTypeList(raceTypeValues);
    if (raceTypeList.length === 0) {
        throw new ValidationError('Invalid raceType');
    }
    return raceTypeList;
};

interface SearchRaceFilterInput {
    startDate: string | null | undefined;
    finishDate: string | null | undefined;
    raceTypeValues: string[];
    locationValues?: string[];
    gradeValues?: string[];
    stageValues?: string[];
}

const createSearchRaceFilter = (
    input: SearchRaceFilterInput,
): SearchRaceFilterEntity => {
    const { start, finish } = ensureDateRange(
        input.startDate,
        input.finishDate,
    );
    const raceTypeList = ensureRaceTypeList(input.raceTypeValues);
    return new SearchRaceFilterEntity(
        start,
        finish,
        raceTypeList,
        input.locationValues ?? [],
        input.gradeValues ?? [],
        input.stageValues ?? [],
    );
};

export const parseQueryToFilter = (
    searchParams: URLSearchParams,
): SearchRaceFilterEntity => {
    return createSearchRaceFilter({
        startDate: searchParams.get('startDate'),
        finishDate: searchParams.get('finishDate'),
        raceTypeValues: searchParams.getAll('raceType'),
        locationValues: searchParams.getAll('location'),
        gradeValues: searchParams.getAll('grade'),
        stageValues: searchParams.getAll('stage'),
    });
};

export const parseBodyToFilter = (body: unknown): SearchRaceFilterEntity => {
    if (!isRecord(body)) {
        throw new ValidationError('body is missing or invalid');
    }

    const { raceType, startDate, finishDate, location, grade, stage } = body;

    if (typeof startDate !== 'string' || typeof finishDate !== 'string') {
        throw new ValidationError('body is missing or invalid');
    }

    const s = validateDateString(startDate, 'startDate');
    const f = validateDateString(finishDate, 'finishDate');

    const raceTypeList = convertRaceTypeList(toStringArray(raceType));
    if (raceTypeList.length === 0) {
        throw new ValidationError('Invalid raceType');
    }

    const locationList = toStringArray(location);
    const gradeList = toStringArray(grade);
    const stageList = toStringArray(stage);

    return new SearchRaceFilterEntity(
        new Date(s),
        new Date(f),
        raceTypeList,
        locationList,
        gradeList,
        stageList,
    );
};

export const parseRaceTypeListFromSearch = (
    searchParams: URLSearchParams,
): RaceType[] => {
    return ensureRaceTypeList(searchParams.getAll('raceType'));
};

export const parseSearchDatesAndRaceTypes = (
    searchParams: URLSearchParams,
): {
    start: Date;
    finish: Date;
    raceTypeList: RaceType[];
    locationList: string[];
} => {
    const { start, finish } = ensureDateRange(
        searchParams.get('startDate'),
        searchParams.get('finishDate'),
    );

    return {
        start,
        finish,
        raceTypeList: ensureRaceTypeList(searchParams.getAll('raceType')),
        locationList: searchParams.getAll('location'),
    };
};
