import {
    type LocationCode,
    LocationCodeSchema,
    validateLocationCode,
} from '../../../../../packages/shared/src/types/locationCode';

describe('LocationCode', () => {
    describe('バリデーション成功ケース', () => {
        const validCodes = ['01', '02', '03', '10', '24', '99'];

        it.each(validCodes)(
            'locationCode: %s が正常にバリデーションされる',
            (code) => {
                const result = validateLocationCode(code);
                expect(result).toBe(code);
            },
        );

        it.each(validCodes)(
            'locationCode: %s がLocationCodeSchemaでパースできる',
            (code) => {
                const result = LocationCodeSchema.parse(code);
                expect(result).toBe(code);
            },
        );
    });

    describe('バリデーション失敗ケース', () => {
        const invalidCodes = [
            '1', // 1桁
            '001', // 3桁
            'ab', // アルファベット
            '1a', // 数字とアルファベット混在
            'あい', // 日本語
            '', // 空文字
            ' 1', // スペース含む
            '1 ', // スペース含む
        ];

        it.each(invalidCodes)(
            'locationCode: %s がバリデーションエラーになる',
            (code) => {
                expect(() => validateLocationCode(code)).toThrow();
            },
        );

        it.each(invalidCodes)(
            'locationCode: %s がLocationCodeSchemaでパースエラーになる',
            (code) => {
                expect(() => LocationCodeSchema.parse(code)).toThrow();
            },
        );
    });

    describe('型の推論', () => {
        it('LocationCodeSchemaから型が正しく推論される', () => {
            const code: LocationCode = '01';
            expect(code).toBe('01');
        });
    });
});
