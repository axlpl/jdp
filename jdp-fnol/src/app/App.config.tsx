import React from 'react';

import { Footer } from '../components/Footer';
import { HelpPopoverItems } from '../components/HelpPopoverItems';
import { triggerLogout } from '../features/auth/authActions';
import { Dashboard } from '../features/dashboard/Dashboard';
import { ConfirmationPage } from '../features/fnol/ConfirmationPage';
import { FnolWizard } from '../features/fnol/FnolWizard';
import { Settings } from '../features/settings/Settings';

import messages from './App.messages';

type FooterRenderProps = {
    className?: string;
};

const floorPlanConfig = {
    'floorplan.default': {
        type: 'floorplan' as const,
        scrollContent: false,
        showLeftSide: false,
        showRightSide: false,
        contentLayout: 'canvas' as const,
        routes: [
            {
                path: '/',
                exact: true,
                showOnNavBar: false,
                redirect: '/dashboard',
            },
            {
                title: messages.dashboardTitle,
                path: '/dashboard',
                exact: true,
                component: Dashboard,
            },
            {
                title: messages.fnolTitle,
                path: '/fnol/new',
                showOnNavBar: false,
                component: FnolWizard,
            },
            {
                title: messages.confirmationTitle,
                path: '/fnol/confirmation/:claimId',
                exact: true,
                showOnNavBar: false,
                component: ConfirmationPage,
            },
            {
                title: messages.settingsTitle,
                path: '/settings',
                exact: true,
                component: Settings,
            },
        ],
        header: {
            showAvatar: true,
            commonAvatarRoutes: [
                {
                    title: messages.avatarDashboard,
                    to: '/dashboard',
                },
                {
                    title: messages.avatarSettings,
                    to: '/settings',
                },
                {
                    title: messages.avatarLogout,
                    to: '/',
                    onClick: triggerLogout,
                },
            ],
            showNotifications: false,
            logoSrc: './images/guidewire-logo-dark.svg',
            logoTitle: 'Guidewire',
            showHelp: true,
            showAppSwitcher: false,
            showLanguageSelector: false,
            renderHelpPopoverItems() {
                return <HelpPopoverItems />;
            },
        },
        renderFooter({ className }: FooterRenderProps) {
            return <Footer className={className} />;
        },
    },
};

export default floorPlanConfig;
