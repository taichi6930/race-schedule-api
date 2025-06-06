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
        files: ['lib/**/*.ts', 'test/**/*.ts'],
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
            'jsdoc/check-examples': 'off', // ESLint 8+との互換性の問題により無効化
            'jsdoc/check-indentation': 'off', // TypeScriptのデフォルトのインデントスタイルを許可
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
            'jsdoc/check-tag-names': 'off', // Typescriptと併用するため無効化
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
            'jsdoc/no-types': 'off', // TypeScriptと併用するため無効化
            'jsdoc/no-undefined-types': 'error', // 未定義の型のチェック
            'jsdoc/require-asterisk-prefix': 'error', // アスタリスクプレフィックスの要求
            'jsdoc/require-description': 'off', // 説明の要求
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
            'jsdoc/require-throws': 'off', // throws句の要求
            'jsdoc/require-yields': 'off', // yields句の要求
            'jsdoc/require-yields-check': 'off', // yields句のチェック
            'jsdoc/sort-tags': 'error', // タグのソート
            'jsdoc/tag-lines': 'error', // タグの行数チェック
            'jsdoc/valid-types': 'error', // 有効な型のチェック
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
