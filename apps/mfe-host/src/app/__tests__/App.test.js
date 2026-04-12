import React from 'react';

import { render } from '@jutro/test';

import { Jutro } from '../App';

it('renders without crashing', () => {
    const mockScrollTo = jest
        .spyOn(global.window, 'scrollTo')
        .mockImplementation(jest.fn());

    const { unmount } = render(<Jutro />);

    unmount();

    mockScrollTo.mockRestore();
});
