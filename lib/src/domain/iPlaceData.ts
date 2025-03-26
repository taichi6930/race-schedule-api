/**
 * Interface for PlaceData
 */
export interface IPlaceData<T extends IPlaceData<T>> {
    copy: (partial: Partial<T>) => T;
}
