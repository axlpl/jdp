export type AuthMode = 'bearer' | 'oauth' | 'basic' | 'none';

export type RuntimeConfig = {
    useMocks: boolean;
    policyCenterBaseUrl: string;
    claimCenterBaseUrl: string;
    authMode: AuthMode;
    apiBearerToken: string;
    apiBasicUser: string;
    apiBasicPassword: string;
};

const bool = (value: string | undefined, fallback: boolean): boolean => {
    if (value === undefined) {
        return fallback;
    }

    return value.toLowerCase() !== 'false' && value !== '0';
};

const parseAuthMode = (value: string | undefined): AuthMode => {
    switch (value) {
        case 'bearer':
        case 'oauth':
        case 'basic':
        case 'none':
            return value;
        default:
            return 'none';
    }
};

export const runtimeConfig: RuntimeConfig = {
    useMocks: bool(process.env.REACT_APP_USE_MOCKS, true),
    policyCenterBaseUrl:
        process.env.REACT_APP_POLICY_CENTER_BASE_URL ?? 'http://localhost:8180',
    claimCenterBaseUrl:
        process.env.REACT_APP_CLAIM_CENTER_BASE_URL ?? 'http://localhost:8280',
    authMode: parseAuthMode(process.env.REACT_APP_API_AUTH_MODE),
    apiBearerToken: process.env.REACT_APP_API_BEARER_TOKEN ?? '',
    apiBasicUser: process.env.REACT_APP_API_BASIC_USER ?? '',
    apiBasicPassword: process.env.REACT_APP_API_BASIC_PASSWORD ?? '',
};
