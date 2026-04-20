import React from 'react';

import { AppFloorPlan } from '@jutro/floorplan';

import { AuthProvider, useAuth } from '../features/auth/AuthContext';
import { LoginPage } from '../features/auth/LoginPage';
import { DraftsProvider } from '../features/fnol/DraftsContext';
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
                <DraftsProvider>
                    <AppFloorPlan floorPlans={floorPlans} />
                </DraftsProvider>
            </FnolProvider>
        </PoliciesProvider>
    );
};

export const Jutro = () => (
    <AuthProvider>
        <AuthSwitch />
    </AuthProvider>
);
