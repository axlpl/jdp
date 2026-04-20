export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface CompositeSubRequest {
    method: HttpMethod;
    uri: string;
    body?: unknown;
    vars?: Array<{ name: string; path?: string }>;
    includeResponse?: boolean;
    parameters?: Record<string, unknown>;
}

export interface CompositeRequestBody {
    requestTag?: string;
    requests: CompositeSubRequest[];
}

export interface CompositeSubResponse<T = unknown> {
    status: number;
    body?: T;
    headers?: Record<string, string>;
}

export interface CompositeResponseBody {
    responses: CompositeSubResponse[];
}
