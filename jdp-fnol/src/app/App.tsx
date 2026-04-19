import React from 'react';

import { AppFloorPlan } from '@jutro/floorplan';

import { AuthProvider, useAuth } from '../features/auth/AuthContext';
import { LoginPage } from '../features/auth/LoginPage';
import { FnolProvider } from '../features/fnol/FnolContext';
import { PoliciesProvider } from '../features/policies/PoliciesContext';
import { runtimeConfig } from '../config/runtime';

import floorPlanConfig from './App.config';

const AuthSwitch = () => {
    const { isAuthenticated } = useAuth();
    const floorPlans = Object.values(floorPlanConfig);

    if (!runtimeConfig.useMocks && !isAuthenticated) {
        return <LoginPage />;
    }

    return (
        <PoliciesProvider>
            <FnolProvider>
                <AppFloorPlan floorPlans={floorPlans} />
            </FnolProvider>
        </PoliciesProvider>
    );
};

export const Jutro = () => (
    <AuthProvider>
        <AuthSwitch />
    </AuthProvider>
);
