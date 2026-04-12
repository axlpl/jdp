// @ts-check
import React, { useMemo } from 'react';

import { AppFloorPlan } from '@jutro/floorplan';

import { SettingsProvider, useSetting } from '../context/SettingsContext';

import floorPlanConfig from './App.config';

const updateNavigationPlacementConfig = (config, newValue) => {
    if (!newValue) {
        return config;
    }

    const [oldConfig, ...otherConfig] = config;

    const newConfig = {
        ...oldConfig,
        showLeftSide: newValue === 'left',
        showSubHeader: newValue === 'top',
        sideRoutes: newValue === 'left' ? oldConfig.routes : [],
        routes: newValue === 'top' ? oldConfig.routes : [],
    };

    return [newConfig, ...otherConfig];
};

export const AppRoot = () => {
    const navigationPlacementSettings = useSetting('navPlacement');
    const currentNavigationPlacement = navigationPlacementSettings?.getValue();

    const floorPlans = useMemo(
        () =>
            updateNavigationPlacementConfig(
                Object.values(floorPlanConfig),
                currentNavigationPlacement
            ),
        [currentNavigationPlacement]
    );

    if (process.env.NODE_ENV === 'production') {
        // eslint-disable-next-line no-underscore-dangle
        const DEV_TOOLS = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

        if (typeof DEV_TOOLS === 'object') {
            for (const [key, value] of Object.entries(DEV_TOOLS)) {
                DEV_TOOLS[key] = typeof value === 'function' ? undefined : null;
            }
        }
    }

    return <AppFloorPlan floorPlans={floorPlans} />;
};

export const Jutro = () => (
    <SettingsProvider>
        <AppRoot />
    </SettingsProvider>
);
