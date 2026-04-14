import React from 'react';

import { AppFloorPlan } from '@jutro/floorplan';

import { PoliciesProvider } from '../features/policies/PoliciesContext';

import floorPlanConfig from './App.config';

export const AppRoot = () => {
    const floorPlans = Object.values(floorPlanConfig);

    return <AppFloorPlan floorPlans={floorPlans} />;
};

export const Jutro = () => (
    <PoliciesProvider>
        <AppRoot />
    </PoliciesProvider>
);
