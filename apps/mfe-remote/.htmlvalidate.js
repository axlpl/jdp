module.exports = {
    extends: ['html-validate:recommended'],
    rules: {
        'attr-case': [
            'error',
            {
                style: ['lowercase', 'camelcase'],
                ignoreForeign: true,
            },
        ],
        'element-required-content': 'off',
        'element-required-attributes': 'off',
        'void-style': 'off',
        'element-case': 'off',
        'element-name': 'off',
        'no-self-closing': 'off',
        'no-inline-style': 'off',
        'doctype-style': 'off',
        'void-content': 'off',
        'wcag/h32': 'off',
        'wcag/h71': 'off',
    },
};
