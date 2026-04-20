import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { log } from '@jutro/logger';

import {
    getPolicyContacts,
    getPolicyLocations,
    getPolicyVehicles,
} from '../../services/policyCenterApi';
import type {
    LoadStatus,
    PolicyContact,
    PolicyLocation,
    PolicyVehicle,
} from '../../types/domain';

import { useFnol } from './FnolContext';

export type PolicyResources = {
    locations: PolicyLocation[];
    vehicles: PolicyVehicle[];
    contacts: PolicyContact[];
    status: LoadStatus;
};

const EMPTY: PolicyResources = {
    locations: [],
    vehicles: [],
    contacts: [],
    status: 'idle',
};

const PolicyResourcesContext = createContext<PolicyResources | null>(null);

export const PolicyResourcesProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { draft } = useFnol();
    const policyNumber = draft.policyNumber;
    const [state, setState] = useState<PolicyResources>(EMPTY);

    useEffect(() => {
        if (!policyNumber) {
            setState(EMPTY);

            return;
        }
        let cancelled = false;

        setState(prev => ({ ...prev, status: 'loading' }));
        Promise.all([
            getPolicyLocations(policyNumber).catch(() => []),
            getPolicyVehicles(policyNumber).catch(() => []),
            getPolicyContacts(policyNumber).catch(() => []),
        ]).then(([locations, vehicles, contacts]) => {
            if (cancelled) {
                return;
            }
            setState({ locations, vehicles, contacts, status: 'success' });
        }).catch(err => {
            if (cancelled) {
                return;
            }
            log.error(
                `Policy resources load failed: ${err instanceof Error ? err.message : String(err)}`
            );
            setState({ ...EMPTY, status: 'error' });
        });

        return () => {
            cancelled = true;
        };
    }, [policyNumber]);

    const value = useMemo(() => state, [state]);

    return (
        <PolicyResourcesContext.Provider value={value}>
            {children}
        </PolicyResourcesContext.Provider>
    );
};

export const usePolicyResources = (): PolicyResources => {
    const ctx = useContext(PolicyResourcesContext);

    return ctx ?? EMPTY;
};
