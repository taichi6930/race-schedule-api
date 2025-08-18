
export interface IRecord<T extends IRecord<T>> {
    
    copy: (partial: Partial<T>) => T;
}
