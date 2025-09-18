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
        files: ['src/**/*.ts', 'lib/**/*.ts', 'test/**/*.ts'],
        ignores: ['**/cdk.out/**', '**/node_modules/**', 'dist/**'],
    },
    eslintPluginUnicorn.configs.all, // ✅ unicornプラグインの全ルールを適用
    eslint.configs.recommended, // ESLintの推奨ルールを適用
    ...tseslint.configs.all, // ✅ TypeScript用のルールを適用
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
            // JSDoc関連のルール
            'jsdoc/check-access': 'error', // アクセス修飾子のチェック
            'jsdoc/check-alignment': 'error', // 整列のチェック
            'jsdoc/check-line-alignment': 'error', // 行の整列チェック
            'jsdoc/check-param-names': [
                'error',
                {
                    checkDestructured: false,
                    enableFixer: true,
                    checkRestProperty: false,
                },
            ],
            'jsdoc/check-property-names': 'error', // プロパティ名のチェック
            'jsdoc/check-syntax': 'error', // 構文チェック
            'jsdoc/check-types': 'error', // 型のチェック
            'jsdoc/check-values': 'error', // 値のチェック
            'jsdoc/empty-tags': 'error', // 空タグのチェック
            'jsdoc/implements-on-classes': 'error', // クラスの実装チェック
            'jsdoc/match-description': [
                'error',
                {
                    matchDescription:
                        '[A-Z一-龠ぁ-んァ-ヶ][A-Za-z0-9一-龠ぁ-んァ-ヶ\\s\\-_、。]*',
                },
            ], // 説明文は大文字またはひらがな・カタカナ・漢字で始まる
            'jsdoc/multiline-blocks': 'error', // 複数行ブロックのチェック
            'jsdoc/no-bad-blocks': 'error', // 不正なブロックのチェック
            'jsdoc/no-defaults': 'error', // デフォルト値のチェック
            'jsdoc/no-missing-syntax': [
                'off',
                {
                    contexts: [
                        {
                            comment: '*',
                            message: '@param description is required',
                        },
                    ],
                },
            ],
            'jsdoc/no-multi-asterisks': 'error', // 複数のアスタリスクのチェック
            'jsdoc/no-restricted-syntax': [
                'off',
                {
                    contexts: [
                        {
                            comment: '*',
                            message: 'JSDoc must start with a description',
                        },
                    ],
                },
            ],
            'jsdoc/no-undefined-types': 'error', // 未定義の型のチェック
            'jsdoc/require-asterisk-prefix': 'error', // アスタリスクプレフィックスの要求
            'jsdoc/require-description-complete-sentence': 'off', // 完全な文章での説明要求
            'jsdoc/require-example': 'off', // サンプルの要求
            'jsdoc/require-file-overview': [
                'off',
                {
                    tags: {
                        file: {
                            initialCommentsOnly: true,
                            mustExist: true,
                            preventDuplicates: true,
                        },
                        description: {
                            mustExist: true,
                            preventDuplicates: true,
                        },
                        module: {
                            mustExist: true,
                        },
                    },
                },
            ],
            'jsdoc/require-hyphen-before-param-description': 'error', // パラメータ説明前のハイフン要求
            'jsdoc/require-jsdoc': [
                'off',
                {
                    publicOnly: true,
                    require: {
                        ArrowFunctionExpression: true,
                        ClassDeclaration: true,
                        ClassExpression: true,
                        FunctionDeclaration: true,
                        MethodDefinition: true,
                    },
                },
            ],
            'jsdoc/require-param': 'error', // パラメータの要求
            'jsdoc/require-param-description': 'off', // TODO: パラメータの説明を後で必須にする
            'jsdoc/require-param-name': 'error', // パラメータ名の要求
            'jsdoc/require-param-type': 'off', // TypeScriptと併用するため無効化
            'jsdoc/require-property': 'error', // プロパティの要求
            'jsdoc/require-property-description': 'error', // プロパティの説明を必須にする
            'jsdoc/require-property-name': 'error', // プロパティ名の要求
            'jsdoc/require-property-type': 'off', // TypeScriptと併用するため無効化
            'jsdoc/require-returns': 'off', // 戻り値の要求
            'jsdoc/require-returns-check': 'error', // 戻り値のチェック
            'jsdoc/require-returns-description': 'error', // 戻り値の説明を必須にする
            'jsdoc/require-returns-type': 'off', // TypeScriptと併用するため無効化
            'jsdoc/require-yields': 'off', // yields句の要求
            'jsdoc/require-yields-check': 'off', // yields句のチェック
            'jsdoc/sort-tags': 'error', // タグのソート
            'jsdoc/tag-lines': 'error', // タグの行数チェック
            'jsdoc/valid-types': 'error', // 有効な型のチェック
            'unicorn/prefer-string-slice': 'off', // ✅ preferStringSliceを許可
            '@typescript-eslint/class-methods-use-this': 'off', // ✅ クラスメソッド内でthisを使う
            '@typescript-eslint/max-params': 'off', // ✅ 関数のパラメータ数の最大値を許可
            '@typescript-eslint/member-ordering': 'off', // ✅ クラスメンバーの順序を許可
            '@typescript-eslint/naming-convention': 'off', // 命名規則を強制
            '@typescript-eslint/no-magic-numbers': 'off', // ✅ マジックナンバーを禁止
            '@typescript-eslint/parameter-properties': 'off', // ✅ パラメータプロパティを許可
            '@typescript-eslint/prefer-readonly-parameter-types': 'off', // ✅ readonlyパラメータを推奨
            '@typescript-eslint/consistent-return': 'off', // ✅ 一貫したreturn文を強制
            'unicorn/no-abusive-eslint-disable': 'off', // ✅ eslint-disableの乱用を許可
            '@typescript-eslint/no-unsafe-assignment': 'off', // ✅ any型の代入を許可
            'jsdoc/require-param-description': 'off', // テストファイルではパラメータの説明を任意に
            'jsdoc/check-param-names': 'off', // テストファイルではパラメータ名のチェックを無効に
            'jsdoc/require-file-overview': 'off', // テストファイルではファイル概要を任意に
            'jsdoc/no-missing-syntax': 'off', // テストファイルでは構文チェックを無効に
            'jsdoc/no-restricted-syntax': 'off', // テストファイルでは構文制限を無効に
            'jsdoc/require-example': 'off', // テストファイルではサンプルを任意に
            '@typescript-eslint/no-misused-promises': 'off', // ✅ Promiseの誤用を許可
            '@typescript-eslint/no-unnecessary-type-assertion': 'off', // ✅ 不必要な型アサーションを許可
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
];
