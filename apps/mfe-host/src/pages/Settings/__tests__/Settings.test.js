import React from 'react';

import {
    checkA11yViolations,
    getTranslation,
    render,
    screen,
} from '@jutro/test';

import en from '../../../i18n/en.json';
import { Settings } from '../Settings';

describe('Settings Page', () => {
    it('render Settings page card headers', () => {
        render(<Settings />);

        const headings = [
            getTranslation('Language and Regional Format'),
            getTranslation(en['jutro.app.settings.themeTitle']),
            getTranslation(en['jutro.app.settings.navigationPlacementTitle']),
            getTranslation(en['jutro.app.settings.aboutTitle']),
        ];

        for (const name of headings) {
            expect(screen.getByRole('heading', { name })).toBeInTheDocument();
        }
    });

    it('has no a11y violations', async () => {
        await checkA11yViolations(<Settings />);
    });
});
