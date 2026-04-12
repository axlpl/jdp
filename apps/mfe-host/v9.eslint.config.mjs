// This file should be added only when eslint v9 is used, otherwise v8 will also read it with
// higher priority and fail because of wrong config format.
import cloudStandards, { defineConfig } from '@jutro/cloud-standards/eslint/v9';

export default defineConfig([
    {
        // config with just ignores is the replacement for `.eslintignore`
        ignores: [
            '**/build/**',
            '**/dist/**',
            '**/node_modules/**',
            '.eslintrc.js',
            '**/tmp/**',
            '**/reports/**',
            '**/coverage/**',
        ],
    },
    ...cloudStandards,
]);
