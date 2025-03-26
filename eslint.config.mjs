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
            '@typescript-eslint/prefer-enum-initializers': 'error', // ✅ enumの初期化を必ず指定
            '@typescript-eslint/adjacent-overload-signatures': 'error', // ✅ オーバーロードシグネチャを隣接させる
            '@typescript-eslint/ban-tslint-comment': 'error', // ✅ tslintコメントを禁止
            '@typescript-eslint/class-literal-property-style': 'error', // ✅ クラスリテラルのプロパティスタイルを指定
            '@typescript-eslint/array-type': 'error', // ✅ 配列の型を指定
            '@typescript-eslint/class-methods-use-this': 'off', // ✅ クラスメソッド内でthisを使う
            '@typescript-eslint/consistent-generic-constructors': 'error', // ✅ ジェネリックコンストラクタを一貫性を持たせる
            '@typescript-eslint/consistent-indexed-object-style': 'error', // ✅ インデックスオブジェクトのスタイルを一貫性を持たせる
            '@typescript-eslint/consistent-return': 'off', // 関数の `return` ルールを統一
            '@typescript-eslint/consistent-type-assertions': 'error', // 型アサーションのスタイルを統一
            '@typescript-eslint/consistent-type-definitions': 'error', // `type` か `interface` を統一
            '@typescript-eslint/consistent-type-exports': 'error', // 型のエクスポートを統一
            '@typescript-eslint/consistent-type-imports': 'error', // `type` インポートを統一
            '@typescript-eslint/default-param-last': 'error', // デフォルトパラメータを最後に配置
            '@typescript-eslint/dot-notation': 'error', // `obj["prop"]` より `obj.prop` を推奨
            '@typescript-eslint/explicit-function-return-type': 'error', // 明示的な関数の戻り値型を要求
            '@typescript-eslint/explicit-member-accessibility': 'off', // クラスメンバーのアクセシビリティを明示
            '@typescript-eslint/explicit-module-boundary-types': 'error', // モジュールの公開関数に型を明示
            '@typescript-eslint/init-declarations': 'off', // 変数宣言時に初期化を強制
            '@typescript-eslint/max-params': 'off', // 関数の最大パラメータ数を制限
            '@typescript-eslint/member-ordering': 'off', // クラスメンバーの順序を統一
            '@typescript-eslint/method-signature-style': 'error', // メソッドシグネチャのスタイルを統一
            '@typescript-eslint/naming-convention': 'off', // 命名規則を強制
            '@typescript-eslint/no-confusing-non-null-assertion': 'error', // `!` による非nullアサーションの誤解を招く使用を防ぐ
            '@typescript-eslint/no-dupe-class-members': 'error', // クラスメンバーの重複を禁止
            '@typescript-eslint/no-empty-function': 'error', // 空の関数を禁止
            '@typescript-eslint/no-empty-interface': 'error', // 空の `interface` を禁止
            '@typescript-eslint/no-import-type-side-effects': 'off', // 型専用のインポートに `import type` を強制
            '@typescript-eslint/no-inferrable-types': 'error', // 推論可能な型の明示を禁止
            '@typescript-eslint/no-invalid-this': 'error', // `this` の無効な使用を禁止
            '@typescript-eslint/no-loop-func': 'off', // ループ内の関数定義を禁止
            '@typescript-eslint/no-loss-of-precision': 'error', // 精度を失う数値リテラルを禁止
            '@typescript-eslint/no-magic-numbers': 'off', // マジックナンバーを禁止
            '@typescript-eslint/no-redeclare': 'error', // 変数の再宣言を禁止
            '@typescript-eslint/no-restricted-imports': 'error', // 特定のモジュールのインポートを禁止
            '@typescript-eslint/no-restricted-types': 'error', // 特定の型の使用を禁止
            '@typescript-eslint/no-shadow': 'off', // 変数のシャドウイングを禁止
            '@typescript-eslint/no-type-alias': 'off', // 型エイリアスの使用を制限
            '@typescript-eslint/no-unnecessary-parameter-property-assignment':
                'error', // コンストラクタ内で不要なプロパティ代入を禁止
            '@typescript-eslint/no-unnecessary-qualifier': 'error', // 不要な名前空間修飾を禁止
            '@typescript-eslint/no-unsafe-type-assertion': 'off', // 危険な型アサーションを禁止
            '@typescript-eslint/no-use-before-define': 'off', // 変数や関数の使用前定義を禁止
            '@typescript-eslint/no-useless-empty-export': 'error', // 無意味な空のエクスポートを禁止
            '@typescript-eslint/no-var-requires': 'error', // `require` の使用を禁止
            '@typescript-eslint/non-nullable-type-assertion-style': 'error', // `!` の非nullアサーションを統一
            '@typescript-eslint/parameter-properties': 'off', // クラスのコンストラクタプロパティを統一
            '@typescript-eslint/prefer-destructuring': 'off', // 分割代入を推奨
            '@typescript-eslint/prefer-find': 'error', // `Array.prototype.find()` を推奨
            '@typescript-eslint/prefer-for-of': 'error', // `for-of` ループを推奨
            '@typescript-eslint/prefer-function-type': 'error', // `type` を使った関数型を推奨
            '@typescript-eslint/prefer-includes': 'error', // `includes()` の使用を推奨
            '@typescript-eslint/prefer-nullish-coalescing': 'error', // `??` を推奨
            '@typescript-eslint/prefer-optional-chain': 'error', // `?.` の使用を推奨
            '@typescript-eslint/prefer-readonly': 'error', // `readonly` を推奨
            '@typescript-eslint/prefer-readonly-parameter-types': 'off', // 引数の `readonly` を推奨
            '@typescript-eslint/prefer-regexp-exec': 'error', // `RegExp#exec()` の使用を推奨
            '@typescript-eslint/prefer-string-starts-ends-with': 'error', // `startsWith()` / `endsWith()` の使用を推奨
            '@typescript-eslint/prefer-ts-expect-error': 'error', // `@ts-expect-error` を推奨
            '@typescript-eslint/promise-function-async': 'off', // `Promise` を返す関数に `async` を付与
            '@typescript-eslint/require-array-sort-compare': 'error', // `Array#sort()` に比較関数を要求
            '@typescript-eslint/sort-type-constituents': 'error', // 型のユニオン/インターセクションをアルファベット順に
            '@typescript-eslint/strict-boolean-expressions': 'off', // 厳格なブール型の評価を強制
            '@typescript-eslint/switch-exhaustiveness-check': 'off', // `switch` 文の網羅性をチェック
            '@typescript-eslint/typedef': 'error', // `typedef` を要求
            '@typescript-eslint/unbound-method': 'error', // `this` を持たないクラスメソッドの使用を禁止
            '@typescript-eslint/unified-signatures': 'error', // `function` のオーバーロード定義を統一
            'unused-imports/no-unused-imports': 'error', // ✅ 未使用のimport文をエラーにする
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
