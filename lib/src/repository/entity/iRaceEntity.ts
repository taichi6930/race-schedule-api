
export interface IRaceEntity<T extends IRaceEntity<T>> {
    
    readonly id: string;

    
    copy: (partial: Partial<T>) => T;

    
    toRaceRecord: () => object;
}
