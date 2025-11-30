/**
 * リクエストパーサーモジュール
 *
 * HTTPリクエストのクエリパラメータやボディを解析し、
 * 検索フィルターエンティティに変換するユーティリティ関数を提供します。
 */

import { SearchRaceFilterEntity } from '../repository/entity/filter/searchRaceFilterEntity';
import type { RaceType } from '../utility/raceType';
import { convertRaceTypeList } from '../utility/raceType';

/**
 * バリデーションエラーを表すカスタムエラークラス
 *
 * リクエストパラメータの検証に失敗した場合にスローされます。
 */
export class ValidationError extends Error {
    /** HTTPステータスコード */
    public readonly status: number;

    /**
     * ValidationErrorを生成する
     *
     * @param message - エラーメッセージ
     * @param status - HTTPステータスコード（デフォルト: 400）
     */
    public constructor(message: string, status = 400) {
        super(message);
        this.name = 'ValidationError';
        this.status = status;
    }
}

/**
 * 任意の値を文字列配列に変換する
 *
 * @param value - 変換対象の値
 * @returns 文字列配列
 */
const toStringArray = (value: unknown): string[] => {
    if (value == null) return [];
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === 'string') return [value];
    return [];
};

/**
 * 日付文字列を検証する
 *
 * YYYY-MM-DD形式の日付文字列かどうかを検証し、
 * 不正な場合はValidationErrorをスローします。
 *
 * @param dateStr - 検証対象の日付文字列
 * @param fieldName - フィールド名（エラーメッセージ用）
 * @returns 検証済みの日付文字列
 * @throws ValidationError - 日付形式が不正な場合
 */
const validateDateString = (
    dateStr: string | null | undefined,
    fieldName: string,
): string => {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        throw new ValidationError(`Invalid ${fieldName}`);
    }
    return dateStr;
};

/**
 * URLクエリパラメータをレース検索フィルターに変換する
 *
 * @param searchParams - URLSearchParamsオブジェクト
 * @returns レース検索フィルターエンティティ
 * @throws ValidationError - パラメータが不正な場合
 */
export const parseQueryToFilter = (
    searchParams: URLSearchParams,
): SearchRaceFilterEntity => {
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
};

/**
 * レースリクエストボディの型定義
 */
interface RaceRequestBody {
    /** レース種別（単一または複数） */
    raceType: string | string[];
    /** 検索開始日（YYYY-MM-DD形式） */
    startDate: string;
    /** 検索終了日（YYYY-MM-DD形式） */
    finishDate: string;
    /** 開催場所（オプション） */
    location?: string | string[];
    /** グレード（オプション） */
    grade?: string | string[];
    /** ステージ（オプション） */
    stage?: string | string[];
}

/**
 * リクエストボディをレース検索フィルターに変換する
 *
 * @param body - リクエストボディ
 * @returns レース検索フィルターエンティティ
 * @throws ValidationError - ボディの形式が不正な場合
 */
export const parseBodyToFilter = (
    body: RaceRequestBody,
): SearchRaceFilterEntity => {
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
};

/**
 * URLクエリパラメータからレース種別リストを取得する
 *
 * @param searchParams - URLSearchParamsオブジェクト
 * @returns レース種別の配列
 * @throws ValidationError - レース種別が不正な場合
 */
export const parseRaceTypeListFromSearch = (
    searchParams: URLSearchParams,
): RaceType[] => {
    const raceTypeParam = searchParams.getAll('raceType');
    const raceTypeList: RaceType[] = convertRaceTypeList(raceTypeParam);
    if (raceTypeList.length === 0) {
        throw new ValidationError('Invalid raceType');
    }
    return raceTypeList;
};

/**
 * URLクエリパラメータから日付範囲とレース種別を取得する
 *
 * @param searchParams - URLSearchParamsオブジェクト
 * @returns 検索開始日、終了日、レース種別リスト、開催場所リストを含むオブジェクト
 * @throws ValidationError - パラメータが不正な場合
 */
export const parseSearchDatesAndRaceTypes = (
    searchParams: URLSearchParams,
): {
    start: Date;
    finish: Date;
    raceTypeList: RaceType[];
    locationList: string[];
} => {
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
};
