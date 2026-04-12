const options = {
    ignoreMatches: [
        'src',
        'tests',
        '@babel/core',
        '@commitlint/config-conventional',
        '@jutro/translations',
        '@jutro/validation',
        '@jutro/wizard-next',
        '@jutro/browserslist-config',
        '@jutro/eslint-config',
        '@jutro/stylelint-config',
        '@jutro/cli-npm-overrides',
        '@testing-library/jest-dom',
        '@types/react',
        'eslint-plugin-filenames',
        'eslint-plugin-fp',
        'eslint-plugin-jest-dom',
        'eslint-plugin-jsdoc',
        'eslint-plugin-testing-library',
        'html-validate',
        'husky',
        'jest',
        'jest-axe',
        'jest-canvas-mock',
        'jest-extended',
        'jest-teamcity-reporter',
        'json5-jest',
        'lint-staged',
        'node-sass',
        'react-app-rewired',
        'react-scripts',
        'symlink-dir',
        'ts-jest',
        'rimraf',
        // skipped, as we need to have in devDependencies now to have it properly resolved by npm
        // otherwise we might have issue with 7.22 and 7.18 versions of @babel/core used at once in tests
        // could be removed once we update all @babel packages to latest
        // https://guidewirejira.atlassian.net/browse/JUT-21039 for more details
        '@babel/core',
    ],
};

module.exports = { options };
