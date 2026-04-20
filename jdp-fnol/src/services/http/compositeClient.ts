import { runtimeConfig } from '../../config/runtime';
import type {
    CompositeRequestBody,
    CompositeResponseBody,
    CompositeSubResponse,
} from '../../types/dto/composite';
import { encodeBasicAuth } from '../../utils/basicAuth';

export type CompositeFlavor = 'pc' | 'cc';

type CredentialsPair = { username: string; password: string };
type CredentialsGetter = () => CredentialsPair | null;

let credentialsGetter: CredentialsGetter = () => null;

export const registerCredentialsProvider = (
    getter: CredentialsGetter
): void => {
    credentialsGetter = getter;
};

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler = () => {
    /* noop until registered */
};

export const registerUnauthorizedHandler = (
    handler: UnauthorizedHandler
): void => {
    unauthorizedHandler = handler;
};

const endpointFor = (flavor: CompositeFlavor): string => {
    const base =
        flavor === 'pc'
            ? runtimeConfig.policyCenterBaseUrl
            : runtimeConfig.claimCenterBaseUrl;

    return `${base}/rest/composite/v1/composite`;
};

const buildAuthHeader = (): string | null => {
    const dynamic = credentialsGetter();

    if (dynamic) {
        return `Basic ${encodeBasicAuth(dynamic.username, dynamic.password)}`;
    }

    switch (runtimeConfig.authMode) {
        case 'bearer':
            return runtimeConfig.apiBearerToken
                ? `Bearer ${runtimeConfig.apiBearerToken}`
                : null;
        case 'basic': {
            const { apiBasicUser, apiBasicPassword } = runtimeConfig;

            if (!apiBasicUser) {
                return null;
            }

            return `Basic ${encodeBasicAuth(apiBasicUser, apiBasicPassword)}`;
        }
        case 'oauth':
        case 'none':
        default:
            return null;
    }
};

const buildHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    const authHeader = buildAuthHeader();

    if (authHeader) {
        headers.Authorization = authHeader;
    }

    return headers;
};

export class CompositeRequestError extends Error {
    public readonly status: number;
    public readonly body: unknown;

    constructor(message: string, status: number, body: unknown) {
        super(message);
        this.name = 'CompositeRequestError';
        this.status = status;
        this.body = body;
    }
}

export const executeComposite = async (
    flavor: CompositeFlavor,
    body: CompositeRequestBody
): Promise<CompositeResponseBody> => {
    const response = await fetch(endpointFor(flavor), {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorBody = await response
            .json()
            .catch(() => ({}) as Record<string, unknown>);

        if (response.status === 401) {
            unauthorizedHandler();
        }

        throw new CompositeRequestError(
            `Composite request to ${flavor} failed with status ${response.status}`,
            response.status,
            errorBody
        );
    }

    return (await response.json()) as CompositeResponseBody;
};

export const unwrapSubResponse = <T>(
    sub: CompositeSubResponse<unknown> | undefined,
    label: string
): T => {
    if (!sub) {
        throw new CompositeRequestError(
            `Missing sub-response for ${label}`,
            0,
            null
        );
    }

    if (sub.status < 200 || sub.status >= 300) {
        throw new CompositeRequestError(
            `Sub-response ${label} failed with status ${sub.status}`,
            sub.status,
            sub.body
        );
    }

    return sub.body as T;
};
