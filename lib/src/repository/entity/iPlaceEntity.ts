/**
 * Interface for Place Entity
 */
export interface IPlaceEntity<T extends IPlaceEntity<T>> {
    copy: (partial: Partial<T>) => T;
}
