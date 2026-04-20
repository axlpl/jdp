import type { JsonApiResource } from './jsonapi';

export interface TypeKeyDto {
    code: string;
    name: string;
    description?: string;
    retired?: boolean;
}

export interface TypeListAttributesDto {
    name: string;
    description?: string;
    typeKeys: TypeKeyDto[];
}

export type TypeListResourceDto = JsonApiResource<
    TypeListAttributesDto,
    'TypeList'
>;
