/**
 * エラーレスポンスの構造
 */
export interface ErrorResponse {
    error: string;
    message?: string;
    details?: unknown;
}

/**
 * アプリケーションエラーの基底クラス
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: unknown;

    public constructor(
        message: string,
        statusCode: number = 500,
        isOperational: boolean = true,
        details?: unknown,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;

        // TypeScriptのプロトタイプチェーン修正
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * バリデーションエラー (400)
 */
export class ValidationError extends AppError {
    public constructor(message: string, details?: unknown) {
        super(message, 400, true, details);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * 認証エラー (401)
 */
export class AuthenticationError extends AppError {
    public constructor(message: string = '認証に失敗しました') {
        super(message, 401, true);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

/**
 * 権限エラー (403)
 */
export class ForbiddenError extends AppError {
    public constructor(message: string = 'アクセスが拒否されました') {
        super(message, 403, true);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

/**
 * リソースが見つからないエラー (404)
 */
export class NotFoundError extends AppError {
    public constructor(message: string = 'リソースが見つかりません') {
        super(message, 404, true);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * エラーハンドラーユーティリティ
 */
export class ErrorHandler {
    /**
     * エラーをログ出力する
     */
    public static logError(error: Error, context?: string): void {
        const errorInfo = {
            name: error.name,
            message: error.message,
            stack: error.stack,
            context,
            ...(error instanceof AppError && {
                statusCode: error.statusCode,
                isOperational: error.isOperational,
                details: error.details,
            }),
        };

        console.error('Error occurred:', JSON.stringify(errorInfo, null, 2));
    }

    /**
     * エラーからHTTPレスポンスを生成する
     */
    public static toResponse(error: unknown, context?: string): Response {
        // エラーをログ出力
        if (error instanceof Error) {
            this.logError(error, context);
        } else {
            console.error('Unknown error occurred:', error, 'context:', context);
        }

        // AppErrorの場合は構造化されたレスポンスを返す
        if (error instanceof AppError) {
            const errorResponse: ErrorResponse = {
                error: error.message,
            };

            if (error.details) {
                errorResponse.details = error.details;
            }

            return Response.json(errorResponse, {
                status: error.statusCode,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 予期しないエラーの場合は500を返す
        return Response.json(
            { error: 'Internal Server Error' },
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    /**
     * 非同期関数をラップしてエラーハンドリングを自動化する
     */
    public static wrapAsync(
        handler: (
            ...args: unknown[]
        ) => Promise<Response> | Response,
        context?: string,
    ): (...args: unknown[]) => Promise<Response> {
        return async (...args: unknown[]): Promise<Response> => {
            try {
                return await handler(...args);
            } catch (error) {
                return this.toResponse(error, context);
            }
        };
    }
}
