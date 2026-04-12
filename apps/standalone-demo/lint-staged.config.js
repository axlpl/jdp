module.exports = {
    '*.js': ['npm run prettier-check', 'eslint'],
    '*.{ts,tsx,json,scss}': ['npm run prettier-check'],
    '*.scss': ['stylelint'],
};
