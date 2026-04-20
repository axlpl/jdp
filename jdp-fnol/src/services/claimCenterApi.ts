import { runtimeConfig } from '../config/runtime';
import { LOSS_CAUSES } from '../features/fnol/lossCauses';
import type {
    ClaimCreateAttributesDto,
    ClaimCreateRequestDto,
    ClaimResourceDto,
} from '../types/dto/claim';
import type { CompositeRequestBody } from '../types/dto/composite';
import type {
    JsonApiListResponse,
    JsonApiSingleResponse,
} from '../types/dto/jsonapi';
import type { TypecodeDto } from '../types/dto/typelist';
import type {
    ClaimReceipt,
    FnolSubmissionPayload,
    LossCause,
} from '../types/domain';
import {
    buildClaimCreateAttributes,
    isDraftSubmittable,
    toClaimReceipt,
    toLossCause,
} from '../types/mappers';

import { executeComposite, unwrapSubResponse } from './http/compositeClient';
import {
    MOCK_LATENCY_LONG_MS,
    MOCK_LATENCY_SHORT_MS,
    delay,
} from './mocks/common';

const generateClaimNumber = (): string => {
    const n = Math.floor(100000 + Math.random() * 900000);

    return `WC-${n}`;
};

export const getLossCauses = async (): Promise<LossCause[]> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_SHORT_MS);

        return [...LOSS_CAUSES];
    }

    const compositeRequest: CompositeRequestBody = {
        requestTag: 'jdp-fnol:getLossCauses',
        requests: [
            {
                method: 'GET',
                uri: '/common/v1/typelists/LossCause',
            },
        ],
    };

    const { responses } = await executeComposite('cc', compositeRequest);
    const listBody = unwrapSubResponse<JsonApiListResponse<TypecodeDto>>(
        responses[0],
        'getLossCauses'
    );

    return listBody.data.map(toLossCause);
};

const buildMockClaim = (
    attributes: ClaimCreateAttributesDto
): ClaimResourceDto => {
    const claimNumber = generateClaimNumber();

    return {
        type: 'Claim',
        id: `cc:mock:${claimNumber}`,
        attributes: {
            claimNumber,
            lossDate: attributes.lossDate,
            lossCause: attributes.lossCause,
            claimStatus: { code: 'draft', name: 'Draft' },
        },
    };
};

export const submitFnol = async (
    payload: FnolSubmissionPayload
): Promise<ClaimReceipt> => {
    const { draft, policy } = payload;

    if (!isDraftSubmittable(draft)) {
        throw new Error('FNOL draft is incomplete');
    }

    const requestAttributes = buildClaimCreateAttributes(draft, policy);

    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_LONG_MS);
        const claimDto = buildMockClaim(requestAttributes);

        return toClaimReceipt(claimDto, requestAttributes);
    }

    const requestBody: ClaimCreateRequestDto = {
        data: { attributes: requestAttributes },
    };

    const compositeRequest: CompositeRequestBody = {
        requestTag: `jdp-fnol:submitFnol:${draft.policyNumber}`,
        requests: [
            {
                method: 'POST',
                uri: '/claim/v1/claims',
                body: requestBody,
            },
        ],
    };

    const { responses } = await executeComposite('cc', compositeRequest);
    const singleBody = unwrapSubResponse<
        JsonApiSingleResponse<ClaimResourceDto>
    >(responses[0], 'submitFnol');

    return toClaimReceipt(singleBody.data, requestAttributes);
};
