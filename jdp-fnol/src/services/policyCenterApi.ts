import { runtimeConfig } from '../config/runtime';
import type {
    JsonApiListResponse,
    JsonApiSingleResponse,
} from '../types/dto/jsonapi';
import type { PolicyResourceDto } from '../types/dto/policy';
import type { Policy } from '../types/domain';
import { toPolicy } from '../types/mappers';

import {
    ApiRequestError,
    executeRestCall,
} from './http/httpClient';
import { MOCK_LATENCY_NORMAL_MS, delay } from './mocks/common';
import { MOCK_POLICY_DTOS } from './mocks/policies';

export const getPolicies = async (): Promise<Policy[]> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);

        return MOCK_POLICY_DTOS.map(toPolicy);
    }

    const body = await executeRestCall<
        JsonApiListResponse<PolicyResourceDto>
    >('pc', 'GET', '/policies');

    return body.data.map(toPolicy);
};

export const verifyCredentials = async (): Promise<void> => {
    if (runtimeConfig.useMocks) {
        return;
    }

    await executeRestCall<JsonApiListResponse<PolicyResourceDto>>(
        'pc',
        'GET',
        '/policies?pageSize=1'
    );
};

export const getPolicy = async (policyNumber: string): Promise<Policy> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);
        const dto = MOCK_POLICY_DTOS.find(
            p => p.attributes.policyNumber === policyNumber
        );

        if (!dto) {
            throw new ApiRequestError(
                `Policy ${policyNumber} not found`,
                404,
                null
            );
        }

        return toPolicy(dto);
    }

    const body = await executeRestCall<
        JsonApiSingleResponse<PolicyResourceDto>
    >('pc', 'GET', `/policies/${encodeURIComponent(policyNumber)}`);

    return toPolicy(body.data);
};
