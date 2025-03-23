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
    eslintPluginUnicorn.configs.all, // ✅ unicornプラグインの全ルールを適用
    eslint.configs.all, // ESLintの推奨ルールを適用
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
            // sort-keysのルールを追加
            'sort-keys': 'off', // ✅ オブジェクトのキーのソートを許可
            'max-lines-per-function': 'off', // ✅ 関数の行数の制限を許可
            'init-declarations': 'off', // ✅ 変数の初期化を許可
            'one-var': 'off', // ✅ 1行に1つの変数宣言を許可
            'max-lines': 'off', // ✅ ファイルの行数の制限を許可
            'no-undefined': 'off', // ✅ undefinedの使用を許可
            'max-statements': 'off', // ✅ 関数の文の数の制限を許可
            'sort-imports': 'off', // ✅ import文のソートを許可
            'no-loop-func': 'off', // ✅ ループ内の関数の使用を許可
            'new-cap': 'off', // ✅ コンストラクタの大文字始まりを許可
            'no-inline-comments': 'off', // ✅ インラインコメントの使用を許可
            'capitalized-comments': 'off', // ✅ コメントの大文字始まりを許可
            'no-magic-numbers': 'off', // ✅ マジックナンバーの使用を許可
            'id-length': 'off', // ✅ 識別子の長さを許可
            'no-use-before-define': 'off', // ✅ 定義前の使用を許可
            'prefer-destructuring': 'off', // ✅ 分割代入の使用を許可
            'arrow-body-style': 'off', // ✅ アロー関数の本体のスタイルを許可
            'no-console': 'off', // ✅ consoleの使用を許可
            'radix': 'off', // ✅ parseInt()の基数を許可
            'no-useless-return': 'off', // ✅ 不要なreturnの使用を許可
            'require-unicode-regexp': 'off', // ✅ 正規表現リテラルのuフラグを許可
            'camelcase': 'off', // ✅ キャメルケースの使用を許可
            'object-shorthand': 'off', // ✅ オブジェクトリテラルの省略形の使用を許可
            'func-style': 'off', // ✅ 関数のスタイルを許可
            'func-names': 'off', // ✅ 関数名の使用を許可
            'prefer-template': 'off', // ✅ テンプレートリテラルの使用を許可
            'max-params': 'off', // ✅ 関数のパラメータの数の制限を許可
            'no-duplicate-imports': 'off', // ✅ 重複したimport文の使用を許可
            'no-param-reassign': 'off', // ✅ パラメータの再代入を許可
            'no-extend-native': 'off', // ✅ ネイティブオブジェクトの拡張を許可
            'eqeqeq': 'off', // ✅ 厳密等価演算子の使用を許可
            'no-eq-null': 'off', // ✅ nullの比較を許可
            'class-methods-use-this': 'off', // ✅ クラスメソッド内でthisの使用を許可
            'default-case': 'off', // ✅ switch文のdefaultの使用を許可
            'consistent-return': 'off', // ✅ 一貫性のあるreturnの使用を許可
            'no-plusplus': 'off', // ✅ ++/--演算子の使用を許可
            'no-ternary': 'off', // ✅ 三項演算子の使用を許可
            'no-new': 'off', // ✅ new演算子の使用を許可
            'no-nested-ternary': 'off', // ✅ 入れ子の三項演算子の使用を許可
            'no-useless-rename': 'off', // ✅ 不要な変数名の変更を許可
            'no-warning-comments': 'off', // ✅ 警告コメントの使用を許可
            'complexity': 'off', // ✅ 複雑度の制限を許可
            'no-unmodified-loop-condition': 'off', // ✅ 変更されないループ条件の使用を許可
            'no-await-in-loop': 'off', // ✅ ループ内のawaitの使用を許可
            'no-continue': 'off', // ✅ continueの使用を許可
            'no-underscore-dangle': 'off', // ✅ アンダースコアの使用を許可
            'prefer-named-capture-group': 'off', // ✅ 名前付きキャプチャグループの使用を許可
            'no-shadow': 'off', // ✅ 変数の隠蔽を許可
            'no-await-in-loop': 'off', // ✅ ループ内のawaitの使用を許可
            'no-promise-executor-return': 'off', // ✅ Promiseコンストラクタのreturnを許可
            'array-callback-return': 'off', // ✅ 配列メソッドのコールバックのreturnを許可
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
            'unicorn/no-await-expression-member': 'off', // ✅ メンバー式のawaitの使用を許可
            'unicorn/no-array-reduce': 'off', // ✅ Array.prototype.reduce()の使用を許可
            'unicorn/prefer-ternary': 'off', // ✅ 三項演算子の使用を許可
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
