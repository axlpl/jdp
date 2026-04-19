import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';

import { registerCredentialsProvider } from '../../services/http/compositeClient';

import { registerLogoutHandler } from './authActions';

export type Credentials = {
    username: string;
    password: string;
};

export type AuthContextValue = {
    isAuthenticated: boolean;
    username: string | null;
    login: (credentials: Credentials) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [credentials, setCredentials] = useState<Credentials | null>(null);
    const credentialsRef = useRef<Credentials | null>(credentials);

    credentialsRef.current = credentials;
    registerCredentialsProvider(() => credentialsRef.current);

    const login = useCallback((next: Credentials) => {
        setCredentials(next);
    }, []);

    const logout = useCallback(() => {
        setCredentials(null);
    }, []);

    registerLogoutHandler(logout);

    const value = useMemo<AuthContextValue>(
        () => ({
            isAuthenticated: credentials !== null,
            username: credentials?.username ?? null,
            login,
            logout,
        }),
        [credentials, login, logout]
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
