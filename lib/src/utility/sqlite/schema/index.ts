import {
    CREATE_PLACE_MEDIA_TABLE,
    CREATE_PLACE_MEDIA_TRIGGER,
} from './placeMedia';
import { CREATE_PLACES_TABLE, CREATE_PLACES_TRIGGER } from './places';

/**
 * 全てのテーブル作成クエリの配列
 */
export const SCHEMA_QUERIES = [
    CREATE_PLACES_TABLE,
    CREATE_PLACES_TRIGGER,
    CREATE_PLACE_MEDIA_TABLE,
    CREATE_PLACE_MEDIA_TRIGGER,
];

export * from './placeMedia';
export * from './places';
