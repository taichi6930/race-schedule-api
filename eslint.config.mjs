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
                ecmaVersion: 2022,
            },
            sourceType: 'module',
        },
        files: ['src/**/*.ts', 'test/**/*.ts'],
        ignores: ['**/cdk.out/**', '**/node_modules/**', 'dist/**'],
    },
    eslintPluginUnicorn.configs.all, // ✅ unicornプラグインの全ルールを適用
    eslint.configs.recommended, // ESLintの推奨ルールを適用
    ...tseslint.configs.all, // ✅ TypeScript用のルールを適用
    eslintPluginJsdoc.configs['flat/recommended-typescript'], // ✅ JSDoc推奨ルールを適用
    eslintConfigPrettier, // Prettierとの競合を防ぐ設定
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
            '@typescript-eslint/consistent-return': 'off', // ✅ 一貫したreturn文を強制
            '@typescript-eslint/no-unsafe-assignment': 'off', // ✅ any型の代入を許可
            '@typescript-eslint/no-unnecessary-type-assertion': 'off', // ✅ 不必要な型アサーションを許可
            'jsdoc/check-param-names': 'warn', // パラメータ名のチェック
            'jsdoc/check-tag-names': [
                'warn',
                { definedTags: ['remarks', 'fileoverview'] },
            ], // タグ名のチェック（remarksとfileoverviewを許可）
            'jsdoc/no-types': 'off', // TypeScriptでは型注釈があるため、JSDocでの型指定はオフに
            'jsdoc/require-throws-type': 'off', // TypeScriptでは例外の型は推論されるため、JSDocでの型指定はオフに
            'jsdoc/require-example': 'off', // サンプルは任意
            'jsdoc/require-jsdoc': [
                'warn',
                {
                    publicOnly: true,
                    require: {
                        ArrowFunctionExpression: false,
                        ClassDeclaration: true,
                        ClassExpression: true,
                        FunctionDeclaration: true,
                        FunctionExpression: false,
                        MethodDefinition: true,
                    },
                    contexts: ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration'],
                    checkConstructors: false,
                    checkGetters: false,
                    checkSetters: false,
                },
            ], // ✅ 公開関数にはJSDocを必須に
            'jsdoc/require-description': [
                'warn',
                {
                    contexts: [
                        'ClassDeclaration',
                        'FunctionDeclaration',
                        'MethodDefinition',
                        'TSInterfaceDeclaration',
                    ],
                },
            ], // ✅ 説明を必須に
            'jsdoc/require-param-description': 'warn', // パラメータの説明を推奨
            'jsdoc/require-returns-description': 'warn', // 戻り値の説明を推奨
            'jsdoc/tag-lines': 'off', // タグの行間は自由に
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
            'unicorn/consistent-function-scoping': 'off', // ✅ 一貫した関数スコープを許可
            '@typescript-eslint/require-await': 'off', // ✅ 非同期関数でのawaitを強制
            'unicorn/no-array-reduce': 'off', // ✅ Array.prototype.reduce()の使用を許可
            // 数字のセパレーターのスタイルは一長一短なので一旦オフ
            'unicorn/numeric-separators-style': 'off',
            'unicorn/prefer-string-replace-all': 'off', // ✅ String.prototype.replaceAll()の使用を許可
            '@typescript-eslint/no-unsafe-member-access': 'off', // ✅ any型のプロパティアクセスを許可
            '@typescript-eslint/no-unsafe-call': 'off', // ✅ any型の関数呼び出しを許可
            '@typescript-eslint/no-unsafe-argument': 'off', // ✅ any型の引数を許可
            'unicorn/no-useless-undefined': 'off', // ✅ 不要なundefinedの使用を許可
            '@typescript-eslint/no-misused-promises': 'off', // ✅ Promiseの誤用を許可
            '@typescript-eslint/no-redeclare': 'off', // TypeScriptの再宣言を許可
            '@typescript-eslint/strict-boolean-expressions': 'off', // ✅ 厳格なブール型の評価を強制
            '@typescript-eslint/init-declarations': 'off', // ✅ 変数宣言時に初期化を強制
            'unicorn/no-null': 'off', // ✅ nullの使用を許可
            '@typescript-eslint/no-explicit-any': 'off', // ✅ any型の使用を許可
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
        files: ['**/*raceUseCase.test.ts', '**/*DataHtmlGateway.test.ts'],
        rules: {
            '@typescript-eslint/no-loop-func': 'off', // ✅ ループ内での関数定義を禁止
        },
    },
    {
        files: [
            'src/utility/createRaceName.ts',
            'src/utility/**/gradeType.ts',
            'src/utility/**/positionNumber.ts',
            'src/utility/**/raceStage.ts',
            'src/utility/googleCalendar.ts',
            'src/utility/sqlite/settings/dbConfig.ts',
            'test/**/baseCommonData.ts',
            'test/**/placeRepositoryFromStorage.test.ts',
            'test/**/raceRepositoryFromStorage.test.ts',
        ],
        rules: {
            '@typescript-eslint/no-use-before-define': 'off', // 対象ファイル限定で許可
        },
    },
    {
        files: ['**/*Controller.ts', '**/*s3Gateway.ts', '**/utility/env.ts'],
        rules: {
            '@typescript-eslint/no-unsafe-type-assertion': 'off', // ✅ any型の型アサーションを許可
        },
    },
    {
        files: ['**/mockGoogleCalendarGateway.ts'],
        rules: {
            'unicorn/no-array-sort': 'off', // ✅ Array.prototype.sort()の使用を許可
        },
    },
    // テストファイルのJSDoc要件を緩和
    {
        files: ['test/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
        rules: {
            'jsdoc/require-jsdoc': 'off', // テストファイルではJSDocを任意に
            'jsdoc/require-description': 'off', // テストファイルでは説明を任意に
            'jsdoc/require-param-description': 'off', // テストファイルではパラメータの説明を任意に
            'jsdoc/require-returns-description': 'off', // テストファイルでは戻り値の説明を任意に
        },
    },
];
