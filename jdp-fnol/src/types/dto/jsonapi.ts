export interface JsonApiResourceRef {
    type: string;
    id: string;
}

export interface JsonApiResource<
    Attributes,
    Type extends string = string
> {
    type: Type;
    id: string;
    attributes: Attributes;
    relationships?: Record<
        string,
        { data: JsonApiResourceRef | JsonApiResourceRef[] }
    >;
    links?: Record<string, string>;
}

export interface JsonApiSingleResponse<T> {
    data: T;
    included?: Array<JsonApiResource<unknown>>;
    meta?: Record<string, unknown>;
}

export interface JsonApiListResponse<T> {
    count?: number;
    data: T[];
    included?: Array<JsonApiResource<unknown>>;
    meta?: Record<string, unknown>;
}
