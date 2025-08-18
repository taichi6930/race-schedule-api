


export const createErrorMessage = (prefix: string, error: unknown): string => {
    if (error instanceof Error) {
        return `${prefix}: ${error.message}`;
    }
    return `${prefix}: Unknown error`;
};
