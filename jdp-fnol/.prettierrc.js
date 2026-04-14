module.exports = {
    printWidth: 80,
    tabWidth: 4,
    trailingComma: 'es5',
    arrowParens: 'avoid',
    endOfLine: 'auto',
    bracketSameLine: false,
    bracketSpacing: true,
    singleQuote: true,
    useTabs: false,
    semi: true,
    overrides: [
        {
            files: '*.json5',
            options: {
                parser: 'json',
            },
        },
        {
            files: '*.json',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '*.metadata.html',
            options: {
                parser: 'babel',
                htmlWhitespaceSensitivity: 'ignore',
            },
        },
        {
            files: '*.scss',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '*.mdx',
            options: {
                proseWrap: 'always',
            },
        },
    ],
};
