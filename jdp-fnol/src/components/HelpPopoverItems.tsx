import React, { Fragment } from 'react';

import { Button } from '@jutro/components';
import { useTranslator } from '@jutro/locale';

import messages from '../app/App.messages';
import { useAuth } from '../features/auth/AuthContext';

import styles from '../app/App.module.scss';

export const HelpPopoverItems = () => {
    const translate = useTranslator();
    const { isAuthenticated, username, logout } = useAuth();

    return (
        <Fragment>
            <h5 className={styles.helpComponent}>
                {translate(messages.helpGwCloud)}
            </h5>
            <p className={styles.helpComponent}>
                {translate(messages.helpGwCloudDescription)}
            </p>
            <a
                className={styles.helpLink}
                href="https://docs.guidewire.com/"
                target="_blank"
                rel="noopener noreferrer"
            >
                {translate(messages.helpReadMore)}
            </a>

            {isAuthenticated && (
                <div className={styles.helpComponent}>
                    <p className={styles.helpComponent}>
                        {translate(messages.signedInAs, {
                            username: username ?? '',
                        })}
                    </p>
                    <Button
                        id="helpPopoverLogout"
                        variant="tertiary"
                        onClick={logout}
                        label={messages.avatarLogout}
                    />
                </div>
            )}
        </Fragment>
    );
};
