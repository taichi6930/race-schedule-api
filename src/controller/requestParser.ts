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

function toStringArray(value: unknown): string[] {
    if (value == null) return [];
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === 'string') return [value];
    return [];
}

function validateDateString(
    dateStr: string | null | undefined,
    fieldName: string,
): string {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        throw new ValidationError(`Invalid ${fieldName}`);
    }
    return dateStr;
}

export function parseQueryToFilter(
    searchParams: URLSearchParams,
): SearchRaceFilterEntity {
    const raceTypeParam = searchParams.getAll('raceType');
    const gradeParam = searchParams.getAll('grade');
    const stageParam = searchParams.getAll('stage');
    const locationParam = searchParams.getAll('location');
    const startDateParam = searchParams.get('startDate') ?? undefined;
    const finishDateParam = searchParams.get('finishDate') ?? undefined;

    const s = validateDateString(startDateParam, 'startDate');
    const f = validateDateString(finishDateParam, 'finishDate');

    const raceTypeList: RaceType[] = convertRaceTypeList(raceTypeParam);
    if (raceTypeList.length === 0) {
        throw new ValidationError('Invalid raceType');
    }

    const gradeList = toStringArray(gradeParam);
    const stageList = toStringArray(stageParam);
    const locationList = toStringArray(locationParam);

    return new SearchRaceFilterEntity(
        new Date(s),
        new Date(f),
        raceTypeList,
        locationList,
        gradeList,
        stageList,
    );
}

interface RaceRequestBody {
    raceType: string | string[];
    startDate: string;
    finishDate: string;
    location?: string | string[];
    grade?: string | string[];
    stage?: string | string[];
}

export function parseBodyToFilter(
    body: RaceRequestBody,
): SearchRaceFilterEntity {
    const { raceType, startDate, finishDate, location, grade, stage } = body;

    if (typeof startDate !== 'string' || typeof finishDate !== 'string') {
        throw new ValidationError('body is missing or invalid');
    }

    const s = validateDateString(startDate, 'startDate');
    const f = validateDateString(finishDate, 'finishDate');

    let raceTypeInput: string[] = [];
    if (typeof raceType === 'string') {
        raceTypeInput = [raceType];
    } else if (Array.isArray(raceType)) {
        raceTypeInput = raceType;
    }

    const raceTypeList = convertRaceTypeList(raceTypeInput);
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
}

export function parseRaceTypeListFromSearch(
    searchParams: URLSearchParams,
): RaceType[] {
    const raceTypeParam = searchParams.getAll('raceType');
    const raceTypeList: RaceType[] = convertRaceTypeList(raceTypeParam);
    if (raceTypeList.length === 0) {
        throw new ValidationError('Invalid raceType');
    }
    return raceTypeList;
}

export function parseSearchDatesAndRaceTypes(searchParams: URLSearchParams): {
    start: Date;
    finish: Date;
    raceTypeList: RaceType[];
    locationList: string[];
} {
    const startDateParam = searchParams.get('startDate') ?? undefined;
    const finishDateParam = searchParams.get('finishDate') ?? undefined;
    const s = validateDateString(startDateParam, 'startDate');
    const f = validateDateString(finishDateParam, 'finishDate');

    const raceTypeList = parseRaceTypeListFromSearch(searchParams);

    const locationList = toStringArray(searchParams.getAll('location'));

    return {
        start: new Date(s),
        finish: new Date(f),
        raceTypeList,
        locationList,
    };
}
