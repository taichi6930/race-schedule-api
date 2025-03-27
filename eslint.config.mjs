import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
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
    },
    {
        languageOptions: {
            parserOptions: {
                project: true,
                sourceType: 'module',
            },
        },
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
        },
        rules: {
            '@typescript-eslint/no-unsafe-member-access': 'off', // ✅ any型のプロパティアクセスを許可
            '@typescript-eslint/no-unsafe-assignment': 'off', // ✅ any型の代入を許可
            '@typescript-eslint/no-unsafe-call': 'off', // ✅ any型の関数呼び出しを許可
            '@typescript-eslint/no-unsafe-argument': 'off', // ✅ any型の引数を許可
            '@typescript-eslint/no-misused-promises': 'off', // ✅ Promiseの誤用を許可
            '@typescript-eslint/class-methods-use-this': 'off', // ✅ クラスメソッド内でthisを使う
            '@typescript-eslint/consistent-return': 'off', // 関数の `return` ルールを統一
            '@typescript-eslint/explicit-member-accessibility': 'off', // クラスメンバーのアクセシビリティを明示
            '@typescript-eslint/init-declarations': 'off', // 変数宣言時に初期化を強制
            '@typescript-eslint/max-params': 'off', // 関数の最大パラメータ数を制限
            '@typescript-eslint/member-ordering': 'off', // クラスメンバーの順序を統一
            '@typescript-eslint/naming-convention': 'off', // 命名規則を強制
            '@typescript-eslint/no-import-type-side-effects': 'off', // 型専用のインポートに `import type` を強制
            '@typescript-eslint/no-loop-func': 'off', // ループ内の関数定義を禁止
            '@typescript-eslint/no-magic-numbers': 'off', // マジックナンバーを禁止
            '@typescript-eslint/no-shadow': 'off', // 変数のシャドウイングを禁止
            '@typescript-eslint/no-type-alias': 'off', // 型エイリアスの使用を制限
            '@typescript-eslint/no-unsafe-type-assertion': 'off', // 危険な型アサーションを禁止
            '@typescript-eslint/no-use-before-define': 'off', // 変数や関数の使用前定義を禁止
            '@typescript-eslint/parameter-properties': 'off', // クラスのコンストラクタプロパティを統一
            '@typescript-eslint/prefer-destructuring': 'off', // 分割代入を推奨
            '@typescript-eslint/prefer-readonly-parameter-types': 'off', // 引数の `readonly` を推奨
            '@typescript-eslint/strict-boolean-expressions': 'off', // 厳格なブール型の評価を強制
            '@typescript-eslint/restrict-template-expressions': 'off', // ✅ テンプレートリテラルの使用を許可
            '@typescript-eslint/return-await': 'off', // ✅ return awaitの使用を許可
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
            'unicorn/no-useless-undefined': 'off', // ✅ 不要なundefinedの使用を許可
            'unicorn/numeric-separators-style': 'off', // ✅ 数値リテラルの区切り文字のスタイルを許可
            'unicorn/no-null': 'off', // ✅ nullの使用を許可
            'unicorn/prefer-string-replace-all': 'off', // ✅ String.prototype.replaceAll()の使用を許可
            'unicorn/no-abusive-eslint-disable': 'off', // ✅ eslint-disableの乱用を許可
            'unicorn/no-array-reduce': 'off', // ✅ Array.prototype.reduce()の使用を許可
        },
    },
    // YAMLファイルを除外する設定
    {
        files: ['**/*.yaml', '**/*.yml'],
        rules: {
            'prettier/prettier': 'off',
        },
    },
];
