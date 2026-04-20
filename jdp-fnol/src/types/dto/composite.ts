export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface CompositeVar {
    name: string;
    path?: string;
}

export interface CompositeSubRequest {
    method: HttpMethod;
    uri: string;
    body?: unknown;
    vars?: CompositeVar[];
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
