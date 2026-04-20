import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { log } from '@jutro/logger';

import { discardDraft, listDrafts } from '../../services/claimCenterApi';
import type { DraftSummary, LoadStatus } from '../../types/domain';
import { useAuth } from '../auth/AuthContext';

export type DraftsContextValue = {
    drafts: DraftSummary[];
    status: LoadStatus;
    reload: () => Promise<void>;
    discard: (claimId: string) => Promise<void>;
};

const DraftsContext = createContext<DraftsContextValue | null>(null);

export const DraftsProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const [drafts, setDrafts] = useState<DraftSummary[]>([]);
    const [status, setStatus] = useState<LoadStatus>('idle');

    const reload = useCallback(async () => {
        setStatus('loading');
        try {
            setDrafts(await listDrafts());
            setStatus('success');
        } catch (err) {
            log.error(
                `Failed to load drafts: ${err instanceof Error ? err.message : String(err)}`
            );
            setStatus('error');
        }
    }, []);

    const discard = useCallback(
        async (claimId: string) => {
            await discardDraft(claimId);
            setDrafts(prev => prev.filter(d => d.claimId !== claimId));
        },
        []
    );

    useEffect(() => {
        if (isAuthenticated) {
            void reload();
        } else {
            setDrafts([]);
            setStatus('idle');
        }
    }, [isAuthenticated, reload]);

    const value = useMemo<DraftsContextValue>(
        () => ({ drafts, status, reload, discard }),
        [drafts, status, reload, discard]
    );

    return (
        <DraftsContext.Provider value={value}>
            {children}
        </DraftsContext.Provider>
    );
};

export const useDrafts = (): DraftsContextValue => {
    const ctx = useContext(DraftsContext);

    if (!ctx) {
        throw new Error('useDrafts must be used within <DraftsProvider>');
    }

    return ctx;
};
