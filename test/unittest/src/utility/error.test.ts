import { createErrorMessage } from '../../../../src/utility/error';

describe('error utility のテスト', () => {
    describe('createErrorMessage のテスト', () => {
        it('Errorオブジェクトが渡された場合、そのメッセージを含むエラーメッセージを返すことを確認', () => {
            const error = new Error('Test error message');
            const prefix = 'Test prefix';
            const result = createErrorMessage(prefix, error);
            expect(result).toBe('Test prefix: Test error message');
        });

        it('undefinedが渡された場合、Unknown errorを含むエラーメッセージを返すことを確認', () => {
            const prefix = 'Test prefix';
            const error: unknown = undefined;
            const result = createErrorMessage(prefix, error);
            expect(result).toBe('Test prefix: Unknown error');
        });

        it('Error以外のオブジェクトが渡された場合、Unknown errorを含むエラーメッセージを返すことを確認', () => {
            const error = 'This is not an error object';
            const prefix = 'Test prefix';
            const result = createErrorMessage(prefix, error);
            expect(result).toBe('Test prefix: Unknown error');
        });

        it('数値が渡された場合、Unknown errorを含むエラーメッセージを返すことを確認', () => {
            const error = 123;
            const prefix = 'Test prefix';
            const result = createErrorMessage(prefix, error);
            expect(result).toBe('Test prefix: Unknown error');
        });

        it('カスタムエラークラスが渡された場合、そのメッセージを含むエラーメッセージを返すことを確認', () => {
            class CustomError extends Error {
                public static create(message: string): CustomError {
                    return new CustomError(message);
                }

                private constructor(message: string) {
                    super(message);
                    this.name = 'CustomError';
                }
            }
            const error = CustomError.create('Custom error message');
            const prefix = 'Test prefix';
            const result = createErrorMessage(prefix, error);
            expect(result).toBe('Test prefix: Custom error message');
        });
    });
});
