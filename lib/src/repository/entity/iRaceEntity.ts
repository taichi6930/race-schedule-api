import type { calendar_v3 } from 'googleapis';

/**
 * Interface for Race Entity
 */
export interface IRaceEntity<T extends IRaceEntity<T>> {
    readonly id: string;

    copy: (partial: Partial<T>) => T;
    toRaceRecord: () => object;
    toGoogleCalendarData: () => calendar_v3.Schema$Event;
}
