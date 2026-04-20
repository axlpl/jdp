import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    registerCredentialsProvider,
    registerUnauthorizedHandler,
} from '../../services/http/httpClient';

import { registerLogoutHandler } from './authActions';

export type Credentials = {
    username: string;
    password: string;
};

export type AuthContextValue = {
    isAuthenticated: boolean;
    username: string | null;
    login: (credentials: Credentials) => void;
    stageCredentials: (credentials: Credentials | null) => void;
    logout: () => void;
};

const STORAGE_KEY = 'jdp-fnol-session';

const readSession = (): Credentials | null => {
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return null;
        }
        const parsed: unknown = JSON.parse(raw);

        if (
            parsed !== null &&
            typeof parsed === 'object' &&
            typeof (parsed as Credentials).username === 'string' &&
            typeof (parsed as Credentials).password === 'string'
        ) {
            return parsed as Credentials;
        }

        return null;
    } catch {
        return null;
    }
};

const writeSession = (credentials: Credentials | null): void => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        if (credentials === null) {
            window.sessionStorage.removeItem(STORAGE_KEY);
        } else {
            window.sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(credentials)
            );
        }
    } catch {
        /* storage unavailable (private mode, quota) - ignore */
    }
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [credentials, setCredentials] = useState<Credentials | null>(() =>
        readSession()
    );
    const committedRef = useRef<Credentials | null>(credentials);
    const stagedRef = useRef<Credentials | null>(null);

    useEffect(() => {
        committedRef.current = credentials;
        writeSession(credentials);
    }, [credentials]);

    const login = useCallback((next: Credentials) => {
        stagedRef.current = null;
        setCredentials(next);
    }, []);

    const stageCredentials = useCallback(
        (next: Credentials | null) => {
            stagedRef.current = next;
        },
        []
    );

    const logout = useCallback(() => {
        stagedRef.current = null;
        setCredentials(null);
    }, []);

    useEffect(() => {
        registerCredentialsProvider(
            () => stagedRef.current ?? committedRef.current
        );
        registerLogoutHandler(logout);
        registerUnauthorizedHandler(() => {
            // Ignore probes - LoginPage surfaces the 401 itself.
            if (stagedRef.current !== null) {
                return;
            }
            logout();
        });
    }, [logout]);

    const value = useMemo<AuthContextValue>(
        () => ({
            isAuthenticated: credentials !== null,
            username: credentials?.username ?? null,
            login,
            stageCredentials,
            logout,
        }),
        [credentials, login, stageCredentials, logout]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error('useAuth must be used within <AuthProvider>');
    }

    return ctx;
};
