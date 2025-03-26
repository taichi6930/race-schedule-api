/**
 * Interface for RaceData
 */
export interface IRaceData<T extends IRaceData<T>> {
    copy: (partial: Partial<T>) => T;
}
