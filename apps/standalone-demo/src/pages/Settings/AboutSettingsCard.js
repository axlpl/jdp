// @ts-check
import React from 'react';

import { Flex } from '@jutro/layout';
import { Image } from '@jutro/components';
import { useTranslator } from '@jutro/locale';

import { SettingsCard } from './components/SettingsCard';

import { messages } from './AboutSettingsCard.messages';

const AboutCard = () => {
    const translator = useTranslator();

    return (
        <Flex alignItems="center">
            <Image
                src="./images/guidewire-logo.svg"
                alt={messages.logoDescription}
            />

            <h5>{translator(messages.logoTitle)}</h5>
        </Flex>
    );
};

export const AboutSettingsCard = ({ id, title }) => (
    <SettingsCard id={id} title={title} renderContent={AboutCard} readOnly />
);
