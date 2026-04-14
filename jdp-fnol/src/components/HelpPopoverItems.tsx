import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { useTranslator } from '@jutro/locale';

import messages from '../app/App.messages';

import styles from '../app/App.module.scss';

export const HelpPopoverItems = () => {
    const translate = useTranslator();

    return (
        <Fragment>
            <h5 className={styles.helpComponent}>
                {translate(messages.helpGwCloud)}
            </h5>
            <p className={styles.helpComponent}>
                {translate(messages.helpGwCloudDescription)}
            </p>
            <Link
                className={styles.helpLink}
                href="https://docs.guidewire.com/"
                target="_blank"
                rel="noopener noreferrer"
                to="/"
            >
                {translate(messages.helpReadMore)}
            </Link>
        </Fragment>
    );
};
