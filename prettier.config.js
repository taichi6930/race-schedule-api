// eslint-disable-next-line no-undef
module.exports = {
    singleQuote: true,
    tabWidth: 4,
    bracketSpacing: true,
    bracketSameLine: true,
    semi: true,
    quoteProps: 'consistent',
    trailingComma: 'all',
    arrowParens: 'always',
    printWidth: 80, // 追加: 80文字で改行
    overrides: [
        {
            files: '*.yaml',
            options: {
                tabWidth: 2, // YAMLのみ2スペース
                singleQuote: false, // YAMLはシングルクォート推奨されない
                proseWrap: 'preserve',
            },
        },
    ],
};
