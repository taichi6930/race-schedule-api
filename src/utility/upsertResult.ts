export interface FailureDetail {
    db: string; // table or DB identifier
    id: string;
    reason: string;
}

export interface UpsertResult {
    successCount: number;
    failureCount: number;
    failures: FailureDetail[];
}
