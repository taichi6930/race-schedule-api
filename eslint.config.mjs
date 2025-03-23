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
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/prefer-enum-initializers': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
            // 不要なインポートの削除を有効化
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
            // 他のルールを追加
            'prettier/prettier': ['error', {}, { usePrettierrc: true }],
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'unicorn/filename-case': [
                'off',
                {
                    case: 'camelCase',
                },
            ],
            'unicorn/prevent-abbreviations': 'off', // ✅ 省略形の使用を許可
            'unicorn/prefer-spread': 'off', // ✅ スプレッド演算子の使用を許可
            'unicorn/text-encoding-identifier-case': 'off',
            'unicorn/prefer-module': 'off',
            'unicorn/import-style': 'off',
            'unicorn/no-negated-condition': 'off',
            'unicorn/no-useless-undefined': 'off',
            'unicorn/numeric-separators-style': 'off',
            'unicorn/no-null': 'off',
            'unicorn/prefer-global-this': 'off',
            'unicorn/prefer-number-properties': 'off',
            'unicorn/no-useless-promise-resolve-reject': 'off',
            'unicorn/prefer-string-replace-all': 'off',
            'unicorn/no-abusive-eslint-disable': 'off',
            'unicorn/prefer-set-has': 'off',
            'unicorn/better-regex': 'off',
            'unicorn/no-await-expression-member': 'off',
            'unicorn/no-array-reduce': 'off',
            'unicorn/prefer-ternary': 'off',
            'unicorn/prefer-array-flat-map': 'off',
            'unicorn/prefer-regexp-test': 'off',
            'unicorn/explicit-length-check': 'off',
            'unicorn/prefer-native-coercion-functions': 'off',
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
