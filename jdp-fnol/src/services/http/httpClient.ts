import { runtimeConfig } from '../../config/runtime';
import type {
    CompositeRequestBody,
    CompositeResponseBody,
    CompositeSubResponse,
    HttpMethod,
} from '../../types/dto/composite';
import { encodeBasicAuth } from '../../utils/basicAuth';

export type GwApp = 'pc' | 'cc';

type ApiSection = 'rest' | 'common' | 'composite';

type CredentialsPair = { username: string; password: string };
type CredentialsGetter = () => CredentialsPair | null;

let credentialsGetter: CredentialsGetter = () => null;

export const registerCredentialsProvider = (
    getter: CredentialsGetter
): void => {
    credentialsGetter = getter;
};

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler = () => {};

export const registerUnauthorizedHandler = (
    handler: UnauthorizedHandler
): void => {
    unauthorizedHandler = handler;
};

const hostFor = (app: GwApp): string =>
    app === 'pc'
        ? runtimeConfig.policyCenterBaseUrl
        : runtimeConfig.claimCenterBaseUrl;

const sectionBase = (app: GwApp, section: ApiSection): string => {
    switch (section) {
        case 'common':
            return '/rest/common/v1';
        case 'composite':
            return '/rest/composite/v1';
        case 'rest':
        default:
            return app === 'pc' ? '/rest/policy/v1' : '/rest/claim/v1';
    }
};

const buildUrl = (app: GwApp, section: ApiSection, path: string): string => {
    const normalised = path.startsWith('/') ? path : `/${path}`;

    return `${hostFor(app)}${sectionBase(app, section)}${normalised}`;
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

const BASE_HEADERS: Readonly<Record<string, string>> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

const buildHeaders = (): Record<string, string> => {
    const authHeader = buildAuthHeader();

    return authHeader
        ? { ...BASE_HEADERS, Authorization: authHeader }
        : { ...BASE_HEADERS };
};

export class ApiRequestError extends Error {
    public readonly status: number;
    public readonly body: unknown;

    constructor(message: string, status: number, body: unknown) {
        super(message);
        this.name = 'ApiRequestError';
        this.status = status;
        this.body = body;
    }
}

const parseErrorBody = async (response: Response): Promise<unknown> => {
    const text = await response.text().catch(() => '');

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};

const request = async <T>(
    app: GwApp,
    section: ApiSection,
    method: HttpMethod,
    path: string,
    body: unknown | undefined
): Promise<T> => {
    const url = buildUrl(app, section, path);
    const response = await fetch(url, {
        method,
        headers: buildHeaders(),
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
        if (response.status === 401) {
            unauthorizedHandler();
        }

        throw new ApiRequestError(
            `${method} ${url} failed with status ${response.status}`,
            response.status,
            await parseErrorBody(response)
        );
    }

    return (await response.json()) as T;
};

export const executeRestCall = <T>(
    app: GwApp,
    method: HttpMethod,
    path: string,
    body?: unknown
): Promise<T> => request<T>(app, 'rest', method, path, body);

export const executeCommonCall = <T>(
    app: GwApp,
    method: HttpMethod,
    path: string,
    body?: unknown
): Promise<T> => request<T>(app, 'common', method, path, body);

export const executeComposite = (
    app: GwApp,
    body: CompositeRequestBody
): Promise<CompositeResponseBody> =>
    request<CompositeResponseBody>(app, 'composite', 'POST', '/composite', body);

export const unwrapSubResponse = <T>(
    sub: CompositeSubResponse<unknown> | undefined,
    label: string
): T => {
    if (!sub) {
        throw new ApiRequestError(
            `Missing sub-response for ${label}`,
            0,
            null
        );
    }

    if (sub.status < 200 || sub.status >= 300) {
        throw new ApiRequestError(
            `Sub-response ${label} failed with status ${sub.status}`,
            sub.status,
            sub.body
        );
    }

    return sub.body as T;
};
