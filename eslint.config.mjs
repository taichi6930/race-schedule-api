import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';
import eslintPluginPromise from 'eslint-plugin-promise';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

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
    eslintPluginUnicorn.configs.all, // ✅ unicornプラグインの推奨設定を適用
    eslint.configs.recommended, // ESLintの推奨ルールを適用
    ...tseslint.configs.strictTypeChecked, // TypeScriptの厳格な型チェックを適用
    ...tseslint.configs.stylisticTypeChecked, // TypeScriptのスタイルチェックを適用
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
            '@typescript-eslint/explicit-module-boundary-types': 'error', // ✅ 関数の戻り値の型を必ず指定
            '@typescript-eslint/prefer-enum-initializers': 'error', // ✅ enumの初期化を必ず指定
            '@typescript-eslint/consistent-type-imports': 'error', // ✅ 型のインポートを一貫性を持たせる
            'unused-imports/no-unused-imports': 'error', // ✅ 未使用のimport文をエラーにする
            'unused-imports/no-unused-vars': [
                'warn',
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
            'unicorn/prefer-spread': 'off', // ✅ スプレッド演算子の使用を許可
            'unicorn/prefer-module': 'off', // ✅ ECMAScriptモジュールの使用を許可（後で対応したい）
            'unicorn/no-useless-undefined': 'off', // ✅ 不要なundefinedの使用を許可
            'unicorn/numeric-separators-style': 'off', // ✅ 数値リテラルの区切り文字のスタイルを許可
            'unicorn/no-null': 'off',
            'unicorn/prefer-number-properties': 'off',
            'unicorn/no-useless-promise-resolve-reject': 'off',
            'unicorn/prefer-string-replace-all': 'off', // ✅ String.prototype.replaceAll()の使用を許可
            'unicorn/no-abusive-eslint-disable': 'off',
            'unicorn/prefer-set-has': 'off',
            'unicorn/better-regex': 'off',
            'unicorn/no-await-expression-member': 'off',
            'unicorn/no-array-reduce': 'off',
            'unicorn/prefer-ternary': 'off',
            'unicorn/prefer-array-flat-map': 'off',
            'unicorn/prefer-regexp-test': 'off',
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
