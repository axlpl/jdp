import React from 'react';
import { Link } from 'react-router-dom';

import { Flex } from '@jutro/layout';
import { useTranslator } from '@jutro/locale';

import messages from '../app/App.messages';

import styles from '../app/App.module.scss';

export const Footer = ({ className }) => {
    const translate = useTranslator();

    return (
        <footer className={className}>
            <div className={styles.footerText}>
                {translate(messages.footerLegalNotice)}
            </div>
            <Flex gap="large">
                <Link className={styles.footerLink} to="/">
                    {translate(messages.footerPrivacyPolicy)}
                </Link>
                <Link className={styles.footerLink} to="/">
                    {translate(messages.footerLegalNotes)}
                </Link>
                <Link className={styles.footerLink} to="/">
                    {translate(messages.footerContactUs)}
                </Link>
            </Flex>
        </footer>
    );
};
