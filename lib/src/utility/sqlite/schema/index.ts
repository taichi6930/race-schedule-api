import {
    CREATE_PLACE_DATA_TABLE,
    CREATE_PLACE_DATA_TRIGGER,
} from './placeData';
import {
    CREATE_PLACE_HELD_DATA_TABLE,
    CREATE_PLACE_HELD_DATA_TRIGGER,
} from './placeHeldData';
import {
    CREATE_PLACE_MEDIA_TABLE,
    CREATE_PLACE_MEDIA_TRIGGER,
} from './placeMedia';
import { CREATE_PLACES_TABLE, CREATE_PLACES_TRIGGER } from './places';


export const SCHEMA_QUERIES = [
    CREATE_PLACES_TABLE,
    CREATE_PLACES_TRIGGER,
    CREATE_PLACE_MEDIA_TABLE,
    CREATE_PLACE_MEDIA_TRIGGER,
    CREATE_PLACE_DATA_TABLE,
    CREATE_PLACE_DATA_TRIGGER,
    CREATE_PLACE_HELD_DATA_TABLE,
    CREATE_PLACE_HELD_DATA_TRIGGER,
];

export * from './placeData';
export * from './placeHeldData';
export * from './placeMedia';
export * from './places';
