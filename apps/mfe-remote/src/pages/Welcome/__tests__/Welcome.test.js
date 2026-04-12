import React from 'react';

import {
    checkA11yViolations,
    getTranslation,
    render,
    screen,
} from '@jutro/test';

import en from '../../../i18n/en.json';
import { getJutroVersion, Welcome } from '../Welcome';

describe('Welcome Page', () => {
    it('render Welcome page main image', () => {
        render(<Welcome />);

        expect(
            screen.getByRole('img', {
                name: getTranslation(en['jutro-app.Pages.Welcome.logo']),
            })
        ).toBeInTheDocument();
    });

    it('render Welcome page sections', () => {
        render(<Welcome />);

        const headings = [
            getTranslation(en['jutro-app.Pages.Welcome.whereToStart']),
            getTranslation(en['jutro-app.Pages.Welcome.needHelp']),
        ];

        for (const name of headings) {
            expect(screen.getByRole('heading', { name })).toBeInTheDocument();
        }
    });

    it('has no a11y violations', async () => {
        await checkA11yViolations(<Welcome />);
    });

    describe('Jutro Version', () => {
        it('Should return the master non-released version', () => {
            const { version, jutroComponentsURI } =
                getJutroVersion('4.2.0-next.0');

            expect(version).toEqual('Master (not released)');
            expect(jutroComponentsURI.includes('master')).toBe(true);
        });

        it('Should return the official released version', () => {
            const { version, jutroComponentsURI } = getJutroVersion('4.2.0');

            expect(version).toEqual('4.2.0');
            expect(jutroComponentsURI.includes('4-2-0')).toBe(true);
        });
    });
});
