import React from 'react';

import {
    checkA11yViolations,
    getTranslation,
    render,
    screen,
} from '@jutro/test';

import en from '../../../i18n/en.json';
import { CodelessForm } from '../CodelessForm';

describe('Codeless', () => {
    it('render Codeless form heading', () => {
        render(<CodelessForm />);

        expect(
            screen.getByRole('heading', {
                name: getTranslation(en['jutro-app.codeless.Codeless Form']),
            })
        ).toBeInTheDocument();
    });

    it('has no a11y violations', async () => {
        await checkA11yViolations(<CodelessForm />);
    });
});
