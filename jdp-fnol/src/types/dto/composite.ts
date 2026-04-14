export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface CompositeSubRequest {
    method: HttpMethod;
    uri: string;
    body?: unknown;
    vars?: Array<{ name: string; path?: string }>;
    actAsQuery?: boolean;
}

export interface CompositeRequestBody {
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
