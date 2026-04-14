import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { getPolicies } from '../../services/policyCenterApi';
import type { LoadStatus, Policy } from '../../types/domain';

export type PoliciesContextValue = {
    policies: Policy[];
    status: LoadStatus;
    error: Error | null;
    reload: () => Promise<void>;
    getByNumber: (policyNumber: string) => Policy | undefined;
};

const PoliciesContext = createContext<PoliciesContextValue | null>(null);

const toError = (value: unknown): Error =>
    value instanceof Error ? value : new Error(String(value));

export const PoliciesProvider = ({ children }: { children: ReactNode }) => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [status, setStatus] = useState<LoadStatus>('idle');
    const [error, setError] = useState<Error | null>(null);

    const load = useCallback(async (): Promise<void> => {
        setStatus('loading');
        setError(null);
        try {
            const result = await getPolicies();

            setPolicies(result);
            setStatus('success');
        } catch (err) {
            setError(toError(err));
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const policiesByNumber = useMemo(
        () => new Map(policies.map(p => [p.policyNumber, p])),
        [policies]
    );

    const getByNumber = useCallback(
        (policyNumber: string): Policy | undefined =>
            policiesByNumber.get(policyNumber),
        [policiesByNumber]
    );

    const value = useMemo<PoliciesContextValue>(
        () => ({ policies, status, error, reload: load, getByNumber }),
        [policies, status, error, load, getByNumber]
    );

    return (
        <PoliciesContext.Provider value={value}>
            {children}
        </PoliciesContext.Provider>
    );
};

export const usePolicies = (): PoliciesContextValue => {
    const ctx = useContext(PoliciesContext);

    if (!ctx) {
        throw new Error(
            'usePolicies must be used within <PoliciesProvider>'
        );
    }

    return ctx;
};
