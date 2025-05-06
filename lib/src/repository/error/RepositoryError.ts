export class RepositoryError extends Error {
    public constructor(
        message: string,
        public readonly cause?: unknown,
        public readonly code?: string,
    ) {
        super(message);
        this.name = 'RepositoryError';
    }

    public static fromError(error: unknown, code?: string): RepositoryError {
        if (error instanceof RepositoryError) {
            return error;
        }
        const message = error instanceof Error ? error.message : String(error);
        return new RepositoryError(message, error, code);
    }
}

export class QueryError extends RepositoryError {
    public constructor(message: string, cause?: unknown) {
        super(message, cause, 'QUERY_ERROR');
        this.name = 'QueryError';
    }
}

export class ValidationError extends RepositoryError {
    public constructor(message: string, cause?: unknown) {
        super(message, cause, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}
