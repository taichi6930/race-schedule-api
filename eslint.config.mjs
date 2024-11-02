import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
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
    eslint.configs.recommended, // ESLintの推奨ルールを適用
    ...tseslint.configs.strictTypeChecked, // TypeScriptの厳格な型チェックを適用
    ...tseslint.configs.stylisticTypeChecked, // TypeScriptのスタイルチェックを適用
    eslintConfigPrettier, // Prettierとの競合を防ぐ設定
    {
        plugins: {
            'unused-imports': unusedImports,
            'prettier': eslintPluginPrettier, // Prettierのプラグインを追加
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/restrict-plus-operands': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/prefer-enum-initializers': 'error',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/consistent-type-imports': 'error',
            // 他のルールを追加
            'prettier/prettier': ['error', {}, { usePrettierrc: true }],
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
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
