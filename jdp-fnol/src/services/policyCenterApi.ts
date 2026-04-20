import { runtimeConfig } from '../config/runtime';
import type { CompositeRequestBody } from '../types/dto/composite';
import type {
    JsonApiListResponse,
    JsonApiSingleResponse,
} from '../types/dto/jsonapi';
import type { PolicyResourceDto } from '../types/dto/policy';
import type { Policy } from '../types/domain';
import { toPolicy } from '../types/mappers';

import { executeComposite, unwrapSubResponse } from './http/compositeClient';
import { MOCK_LATENCY_NORMAL_MS, delay } from './mocks/common';
import { MOCK_POLICY_DTOS } from './mocks/policies';

export const getPolicies = async (): Promise<Policy[]> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);

        return MOCK_POLICY_DTOS.map(toPolicy);
    }

    const compositeRequest: CompositeRequestBody = {
        requestTag: 'jdp-fnol:getPolicies',
        requests: [{ method: 'GET', uri: '/policy/v1/policies' }],
    };

    const { responses } = await executeComposite('pc', compositeRequest);
    const listBody = unwrapSubResponse<
        JsonApiListResponse<PolicyResourceDto>
    >(responses[0], 'getPolicies');

    return listBody.data.map(toPolicy);
};

export const verifyCredentials = async (): Promise<void> => {
    if (runtimeConfig.useMocks) {
        return;
    }

    const compositeRequest: CompositeRequestBody = {
        requestTag: 'jdp-fnol:verifyCredentials',
        requests: [
            {
                method: 'GET',
                uri: '/policy/v1/policies?pageSize=1',
            },
        ],
    };

    await executeComposite('pc', compositeRequest);
};

export const getPolicy = async (policyNumber: string): Promise<Policy> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);
        const dto = MOCK_POLICY_DTOS.find(
            p => p.attributes.policyNumber === policyNumber
        );

        if (!dto) {
            const err = new Error(
                `Policy ${policyNumber} not found`
            ) as Error & { status?: number };

            err.status = 404;
            throw err;
        }

        return toPolicy(dto);
    }

    const compositeRequest: CompositeRequestBody = {
        requestTag: `jdp-fnol:getPolicy:${policyNumber}`,
        requests: [
            {
                method: 'GET',
                uri: `/policy/v1/policies/${encodeURIComponent(policyNumber)}`,
            },
        ],
    };

    const { responses } = await executeComposite('pc', compositeRequest);
    const single = unwrapSubResponse<
        JsonApiSingleResponse<PolicyResourceDto>
    >(responses[0], `getPolicy(${policyNumber})`);

    return toPolicy(single.data);
};
