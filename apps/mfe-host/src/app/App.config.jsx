import React from 'react';

import { Footer } from '../components/Footer';
import { HelpPopoverItems } from '../components/HelpPopoverItems';
import { CodelessForm } from '../pages/CodelessForm/CodelessForm';
import { RemoteModule } from '../pages/RemoteModule/RemoteModule';
import { Settings } from '../pages/Settings/Settings';
import { Welcome } from '../pages/Welcome/Welcome';

import messages from './App.messages';

import styles from './App.module.scss';

export default {
    'floorplan.default': {
        type: 'floorplan',
        scrollContent: false,
        showLeftSide: false,
        showRightSide: false,
        contentLayout: 'canvas',
        routes: [
            {
                path: '/',
                exact: true,
                showOnNavBar: false,
                redirect: '/welcome',
            },
            {
                title: messages.welcomeTitle,
                path: '/welcome',
                exact: true,
                component: Welcome,
            },
            {
                title: messages.formsMenu,
                path: '/forms',
                routes: [
                    {
                        title: messages.codelessFormTitle,
                        path: '/forms/codeless',
                        exact: true,
                        component: CodelessForm,
                    },
                ],
            },
            {
                title: 'Remote module',
                path: '/remote',
                exact: true,
                component: RemoteModule,
            },
            {
                title: messages.routeSettingsTitle,
                path: '/settings',
                exact: true,
                component: Settings,
            },
        ],
        header: {
            showAvatar: true,
            commonAvatarRoutes: [
                {
                    title: messages.welcomePage,
                    to: '/welcome',
                    onClick() {
                        // track click
                    },
                    className: styles.sampleDropdownLink,
                },
                {
                    title: messages.avatarSettingTitle,
                    to: '/settings',
                },
            ],
            showNotifications: true,
            logoSrc: './images/guidewire-logo-dark.svg',
            logoTitle: 'Guidewire',
            showHelp: true,
            showAppSwitcher: false,
            showLanguageSelector: true,
            renderHelpPopoverItems() {
                return <HelpPopoverItems />;
            },
        },
        renderFooter({ className }) {
            return <Footer className={className} />;
        },
    },
    'floorplan.welcome': {
        type: 'floorplan',
        matches: ['/welcome'],
        showFooter: false,
        header: {
            logoSrc: './images/guidewire-logo-dark.svg',
            showNotifications: false,
            showAppSwitcher: false,
            commonAvatarRoutes: [
                {
                    title: messages.pagesSettingsTitle,
                    to: '/settings',
                },
            ],
        },
    },
    'floorplan.settings': {
        type: 'floorplan',
        contentLayout: 'default',
        matches: ['/settings'],
    },
};
