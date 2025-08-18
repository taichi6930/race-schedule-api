


export interface ISQLiteGateway {
    
    run: (query: string, params?: unknown[]) => void;

    
    get: <T>(query: string, params?: unknown[]) => T | undefined;

    
    all: <T>(query: string, params?: unknown[]) => Promise<T[]>;
}
