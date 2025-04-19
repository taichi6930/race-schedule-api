import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginJsdoc from 'eslint-plugin-jsdoc';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginPromise from 'eslint-plugin-promise';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default [
    // lint対象ファイル
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        ignores: ['**/cdk.out/**', '**/node_modules/**'],
    },
    {
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: process.cwd(),
                sourceType: 'module',
            },
        },
        files: ['lib/**/*.ts', 'test/**/*.ts'],
        ignores: ['**/cdk.out/**', '**/node_modules/**', 'dist/**'],
    },
    eslintPluginUnicorn.configs.all, // ✅ unicornプラグインの全ルールを適用
    eslint.configs.recommended, // ESLintの推奨ルールを適用
    ...tseslint.configs.all, // ✅ TypeScript用のルールを適用
    eslintConfigPrettier, // Prettierとの競合を防ぐ設定
    {
        files: ['lib/src/utility/*.ts'],
        plugins: {
            jsdoc: eslintPluginJsdoc,
        },
        rules: {
            // JSDoc関連の基本ルール（段階的に導入）
            'jsdoc/require-jsdoc': [
                'error',
                {
                    require: {
                        ArrowFunctionExpression: true,
                        ClassDeclaration: true,
                        ClassExpression: true,
                        FunctionDeclaration: true,
                        MethodDefinition: true,
                    },
                },
            ],
            'jsdoc/require-description': 'error',
            'jsdoc/require-param': 'error',
            'jsdoc/require-returns': 'error', // 一時的に無効化
        },
    },
    {
        plugins: {
            'unused-imports': unusedImports,
            'prettier': eslintPluginPrettier,
            'simple-import-sort': simpleImportSort,
            'promise': eslintPluginPromise,
            'jsdoc': eslintPluginJsdoc,
        },
        rules: {
            '@typescript-eslint/class-methods-use-this': 'off', // ✅ クラスメソッド内でthisを使う
            '@typescript-eslint/max-params': 'off', // ✅ 関数のパラメータ数の最大値を許可
            '@typescript-eslint/member-ordering': 'off', // ✅ クラスメンバーの順序を許可
            '@typescript-eslint/naming-convention': 'off', // 命名規則を強制
            '@typescript-eslint/no-magic-numbers': 'off', // ✅ マジックナンバーを禁止
            '@typescript-eslint/parameter-properties': 'off', // ✅ パラメータプロパティを許可
            '@typescript-eslint/prefer-readonly-parameter-types': 'off', // ✅ readonlyパラメータを推奨
            'unused-imports/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ], // ✅ 未使用の変数を警告にする
            // 他のルールを追加
            'prettier/prettier': ['error', {}, { usePrettierrc: true }], // ✅ prettierのルールを適用
            'simple-import-sort/imports': 'error', // ✅ import文のソートを強制
            'simple-import-sort/exports': 'error', // ✅ export文のソートを強制
            'unicorn/filename-case': [
                'off',
                {
                    case: 'camelCase',
                },
            ], // ✅ ファイル名のケースをcamelCaseにする
            'unicorn/prevent-abbreviations': 'off', // ✅ 省略形の使用を許可
            'unicorn/prefer-module': 'off', // ✅ ECMAScriptモジュールの使用を許可（後で対応したい）

            // 数字のセパレーターのスタイルは一長一短なので一旦オフ
            'unicorn/numeric-separators-style': 'off',

            'unicorn/prefer-string-replace-all': 'off', // ✅ String.prototype.replaceAll()の使用を許可
        },
    },
    // YAMLファイルを除外する設定
    {
        files: ['**/*.yaml', '**/*.yml'],
        rules: {
            'prettier/prettier': 'off',
            'jsdoc/require-file-overview': 'off',
            'jsdoc/no-restricted-syntax': 'off',
            'jsdoc/require-description': 'off',
            'jsdoc/require-returns': 'off',
        },
    },
    {
        files: ['**/*Controller.ts', '**/logger.ts'],
        rules: {
            '@typescript-eslint/no-unsafe-member-access': 'off', // ✅ any型のプロパティアクセスを許可
            '@typescript-eslint/no-unsafe-assignment': 'off', // ✅ any型の代入を許可
            '@typescript-eslint/no-unsafe-call': 'off', // ✅ any型の関数呼び出しを許可
            '@typescript-eslint/no-unsafe-argument': 'off', // ✅ any型の引数を許可
            'unicorn/no-abusive-eslint-disable': 'off', // ✅ eslint-disableの乱用を許可
            '@typescript-eslint/no-unsafe-type-assertion': 'off', // ✅ any型の型アサーションを許可
        },
    },
    {
        files: ['**/eslint.config.mjs'],
        rules: {
            '@typescript-eslint/no-unsafe-assignment': 'off', // ✅ any型の代入を許可
        },
    },
    {
        files: ['**/*.test.ts', '**/utility/**/*.ts', '**/test/**/*.ts'],
        rules: {
            '@typescript-eslint/no-use-before-define': 'off', // ✅ 変数や関数の使用前定義を禁止
            '@typescript-eslint/no-loop-func': 'off', // ✅ ループ内での関数定義を禁止
            'jsdoc/require-param-description': 'off', // テストファイルではパラメータの説明を任意に
            'jsdoc/check-param-names': 'off', // テストファイルではパラメータ名のチェックを無効に
            'jsdoc/require-file-overview': 'off', // テストファイルではファイル概要を任意に
            'jsdoc/no-missing-syntax': 'off', // テストファイルでは構文チェックを無効に
            'jsdoc/no-restricted-syntax': 'off', // テストファイルでは構文制限を無効に
            'jsdoc/require-example': 'off', // テストファイルではサンプルを任意に
        },
    },
    {
        files: ['**/src/index.ts'],
        rules: {
            '@typescript-eslint/no-misused-promises': 'off', // ✅ Promiseの誤用を許可
        },
    },
    {
        files: ['**/lib/src/gateway/mock/mockS3Gateway.ts'],
        rules: {
            'unicorn/no-abusive-eslint-disable': 'off', // ✅ eslint-disableの乱用を許可
        },
    },
    {
        files: ['**/jest.config.js'],
        rules: {
            'unicorn/no-abusive-eslint-disable': 'off', // ✅ eslint-disableの乱用を許可
        },
    },
    {
        files: [
            '**/lib/src/domain/calendarData.ts',
            '**/lib/src/gateway/implement/googleCalendarGateway.ts',
            '**/lib/src/repository/implement/autoracePlaceRepositoryFromHtmlImpl.ts',
            '**/lib/src/repository/implement/boatracePlaceRepositoryFromHtmlImpl.ts',
            '**/lib/src/repository/implement/jraPlaceRepositoryFromHtmlImpl.ts',
            '**/lib/src/repository/implement/keirinPlaceRepositoryFromHtmlImpl.ts',
            '**/lib/src/repository/implement/narRaceRepositoryFromHtmlImpl.ts',
        ],
        rules: {
            '@typescript-eslint/strict-boolean-expressions': 'off', // ✅ 厳格なブール型の評価を強制
        },
    },
    {
        files: [
            '**/lib/src/utility/env.ts',
            '**/lib/src/gateway/implement/s3Gateway.ts',
        ],
        rules: {
            '@typescript-eslint/no-unsafe-type-assertion': 'off', // ✅ any型の型アサーションを許可
        },
    },
    {
        files: [
            '**/test/**/*.ts',
            '**/lib/src/repository/implement/keirinPlaceRepositoryFromHtmlImpl.ts',
            '**/lib/src/repository/implement/autoracePlaceRepositoryFromHtmlImpl.ts',
        ],
        rules: {
            '@typescript-eslint/init-declarations': 'off', // ✅ 変数宣言時に初期化を強制
        },
    },
    {
        files: ['**/lib/src/usecase/implement/**RaceCalendarUseCase.ts'],
        rules: {
            'unicorn/no-array-reduce': 'off', // ✅ Array.prototype.reduce()の使用を許可
        },
    },
    {
        files: ['**/repository/implement/**RepositoryFromHtmlImpl.ts'],
        rules: {
            'unicorn/no-null': 'off', // ✅ nullの使用を許可
        },
    },
    {
        files: ['**/calendarData.test.ts'],
        rules: {
            'unicorn/no-useless-undefined': 'off', // ✅ 不要なundefinedの使用を許可
        },
    },
    {
        files: [
            '**/lib/src/service/implement/basePlaceDataService.ts',
            '**/lib/src/service/implement/baseRaceDataService.ts',
        ],
        rules: {
            '@typescript-eslint/consistent-return': 'off', // ✅ 一貫したreturn文を強制
        },
    },
];
