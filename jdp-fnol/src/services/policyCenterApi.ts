import { runtimeConfig } from '../config/runtime';
import type {
    JsonApiListResponse,
    JsonApiSingleResponse,
} from '../types/dto/jsonapi';
import type {
    PolicyContactDto,
    PolicyLocationDto,
    PolicyResourceDto,
    VehicleRiskUnitDto,
} from '../types/dto/policy';
import type {
    Policy,
    PolicyContact,
    PolicyLocation,
    PolicyVehicle,
} from '../types/domain';
import {
    toPolicy,
    toPolicyContact,
    toPolicyLocation,
    toPolicyVehicle,
} from '../types/mappers';

import {
    ApiRequestError,
    executeRestCall,
} from './http/httpClient';
import { MOCK_LATENCY_NORMAL_MS, delay } from './mocks/common';
import { MOCK_POLICY_DTOS } from './mocks/policies';
import {
    MOCK_CONTACTS_BY_POLICY,
    MOCK_LOCATIONS_BY_POLICY,
    MOCK_VEHICLES_BY_POLICY,
} from './mocks/policyResources';

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

const policyIdPath = (policyNumber: string, suffix: string): string =>
    `/policies/${encodeURIComponent(policyNumber)}${suffix}`;

export const getPolicyLocations = async (
    policyNumber: string
): Promise<PolicyLocation[]> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);

        return (MOCK_LOCATIONS_BY_POLICY[policyNumber] ?? []).map(
            toPolicyLocation
        );
    }

    const body = await executeRestCall<
        JsonApiListResponse<PolicyLocationDto>
    >('pc', 'GET', policyIdPath(policyNumber, '/locations'));

    return body.data.map(toPolicyLocation);
};

export const getPolicyVehicles = async (
    policyNumber: string
): Promise<PolicyVehicle[]> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);

        return (MOCK_VEHICLES_BY_POLICY[policyNumber] ?? []).map(
            toPolicyVehicle
        );
    }

    return [];
};

export const getClaimPolicyLocations = async (
    claimId: string
): Promise<PolicyLocation[]> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);

        return [];
    }

    const body = await executeRestCall<
        JsonApiListResponse<PolicyLocationDto>
    >('cc', 'GET', `/claims/${encodeURIComponent(claimId)}/policy/locations`);

    return body.data.map(toPolicyLocation);
};

export const getClaimPolicyVehicles = async (
    claimId: string
): Promise<PolicyVehicle[]> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);

        return [];
    }

    const body = await executeRestCall<
        JsonApiListResponse<VehicleRiskUnitDto>
    >(
        'cc',
        'GET',
        `/claims/${encodeURIComponent(claimId)}/policy/vehicle-risk-units`
    );

    return body.data.map(toPolicyVehicle);
};

export const getPolicyContacts = async (
    policyNumber: string
): Promise<PolicyContact[]> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);

        return (MOCK_CONTACTS_BY_POLICY[policyNumber] ?? []).map(
            toPolicyContact
        );
    }

    const body = await executeRestCall<
        JsonApiListResponse<PolicyContactDto>
    >('pc', 'GET', policyIdPath(policyNumber, '/contacts'));

    return body.data.map(toPolicyContact);
};
