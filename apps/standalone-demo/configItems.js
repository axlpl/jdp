module.exports = [
    'paths',
    'jest',
    {
        name: 'webpack',
        overrides: {
            getBabelLoaderRule: loaders => loaders.tsLoaderRule,
        },
    },
];
