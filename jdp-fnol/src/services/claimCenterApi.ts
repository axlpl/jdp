import { runtimeConfig } from '../config/runtime';
import { LOSS_CAUSES } from '../features/fnol/lossCauses';
import type {
    ClaimCreateAttributesDto,
    ClaimCreateRequestDto,
    ClaimResourceDto,
    ClaimSubmitRequestDto,
    ClaimUpdateRequestDto,
} from '../types/dto/claim';
import type {
    JsonApiListResponse,
    JsonApiSingleResponse,
} from '../types/dto/jsonapi';
import type { TypeListResourceDto } from '../types/dto/typelist';
import type { CompositeSubRequest } from '../types/dto/composite';
import type {
    ClaimReceipt,
    DraftSummary,
    FnolDraft,
    LossCause,
} from '../types/domain';
import {
    buildClaimCreateAttributes,
    buildClaimDraftAttributes,
    buildDriverContactAttributes,
    buildVehicleIncidentAttributes,
    isDraftSubmittable,
    toClaimReceipt,
    toDraftSummary,
    toFnolDraft,
    toLossCause,
} from '../types/mappers';
import type {
    PolicyContact,
    PolicyLocation,
    PolicyVehicle,
} from '../types/domain';

import {
    executeCommonCall,
    executeComposite,
    executeRestCall,
    unwrapSubResponse,
} from './http/httpClient';
import {
    MOCK_LATENCY_LONG_MS,
    MOCK_LATENCY_NORMAL_MS,
    MOCK_LATENCY_SHORT_MS,
    delay,
} from './mocks/common';

const EMPTY_SUBMIT_BODY: ClaimSubmitRequestDto = {
    data: { attributes: {} },
};

const generateClaimNumber = (): string => {
    const n = Math.floor(100000 + Math.random() * 900000);

    return `WC-${n}`;
};

export const getLossCauses = async (): Promise<readonly LossCause[]> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_SHORT_MS);

        return LOSS_CAUSES;
    }

    const body = await executeCommonCall<
        JsonApiSingleResponse<TypeListResourceDto>
    >('cc', 'GET', '/typelists/LossCause');

    return body.data.attributes.typeKeys.map(toLossCause);
};

const MOCK_DRAFT_STORE = new Map<string, ClaimResourceDto>();

const nowIso = (): string => new Date().toISOString();

const mockId = (claimNumber: string): string => `cc:mock:${claimNumber}`;

const buildMockClaim = (
    attributes: Partial<ClaimCreateAttributesDto>,
    overrides: Partial<ClaimResourceDto['attributes']> = {}
): ClaimResourceDto => {
    const claimNumber = generateClaimNumber();

    return {
        type: 'Claim',
        id: mockId(claimNumber),
        attributes: {
            claimNumber,
            lossDate: attributes.lossDate ?? nowIso(),
            lossCause: attributes.lossCause,
            description: attributes.description,
            lossLocation: attributes.lossLocation,
            policyNumber: attributes.policyNumber,
            claimStatus: { code: 'draft', name: 'Draft' },
            updateTime: nowIso(),
            ...overrides,
        },
    };
};

const mergeMockClaim = (
    existing: ClaimResourceDto,
    attributes: Partial<ClaimCreateAttributesDto>
): ClaimResourceDto => ({
    ...existing,
    attributes: {
        ...existing.attributes,
        ...attributes,
        updateTime: nowIso(),
    },
});

export const createDraft = async (
    draft: FnolDraft
): Promise<FnolDraft> => {
    const attributes = buildClaimDraftAttributes(draft);

    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);
        const claim = buildMockClaim(attributes);

        MOCK_DRAFT_STORE.set(claim.id, claim);

        return { ...toFnolDraft(claim), ...draft, claimId: claim.id };
    }

    const requestBody: ClaimCreateRequestDto = {
        data: { attributes: attributes as ClaimCreateAttributesDto },
    };

    const response = await executeRestCall<
        JsonApiSingleResponse<ClaimResourceDto>
    >('cc', 'POST', '/claims', requestBody);

    return { ...draft, claimId: response.data.id };
};

export const updateDraft = async (
    draft: FnolDraft
): Promise<FnolDraft> => {
    if (!draft.claimId) {
        throw new Error('updateDraft requires a claimId');
    }

    const attributes = buildClaimDraftAttributes(draft);

    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);
        const existing = MOCK_DRAFT_STORE.get(draft.claimId);

        if (!existing) {
            throw new Error(`Draft ${draft.claimId} not found`);
        }
        MOCK_DRAFT_STORE.set(
            draft.claimId,
            mergeMockClaim(existing, attributes)
        );

        return draft;
    }

    const requestBody: ClaimUpdateRequestDto = {
        data: { attributes },
    };

    await executeRestCall<JsonApiSingleResponse<ClaimResourceDto>>(
        'cc',
        'PATCH',
        `/claims/${encodeURIComponent(draft.claimId)}`,
        requestBody
    );

    return draft;
};

export const saveDraft = async (draft: FnolDraft): Promise<FnolDraft> =>
    draft.claimId ? updateDraft(draft) : createDraft(draft);

export const getDraft = async (claimId: string): Promise<FnolDraft> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);
        const existing = MOCK_DRAFT_STORE.get(claimId);

        if (!existing) {
            throw new Error(`Draft ${claimId} not found`);
        }

        return toFnolDraft(existing);
    }

    const response = await executeRestCall<
        JsonApiSingleResponse<ClaimResourceDto>
    >('cc', 'GET', `/claims/${encodeURIComponent(claimId)}`);

    return toFnolDraft(response.data);
};

export const listDrafts = async (): Promise<DraftSummary[]> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);

        return Array.from(MOCK_DRAFT_STORE.values()).map(toDraftSummary);
    }

    const response = await executeRestCall<
        JsonApiListResponse<ClaimResourceDto>
    >(
        'cc',
        'GET',
        '/claims?filter=claimStatus%3Aeq%3Adraft&sort=-updateTime&pageSize=50'
    );

    return response.data.map(toDraftSummary);
};

export const discardDraft = async (claimId: string): Promise<void> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_NORMAL_MS);
        MOCK_DRAFT_STORE.delete(claimId);

        return;
    }

    await executeRestCall<unknown>(
        'cc',
        'POST',
        `/claims/${encodeURIComponent(claimId)}/cancel`,
        EMPTY_SUBMIT_BODY
    );
};

export type FnolSubmissionContext = {
    draft: FnolDraft;
    locations?: PolicyLocation[];
    vehicles?: PolicyVehicle[];
    contacts?: PolicyContact[];
};

const submitExisting = async (
    claimId: string,
    requestAttributes: ClaimCreateAttributesDto,
    context: FnolSubmissionContext
): Promise<ClaimReceipt> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_LONG_MS);
        const existing = MOCK_DRAFT_STORE.get(claimId);
        const merged = existing
            ? mergeMockClaim(existing, requestAttributes)
            : buildMockClaim(requestAttributes);
        const submitted: ClaimResourceDto = {
            ...merged,
            attributes: {
                ...merged.attributes,
                claimStatus: { code: 'open', name: 'Open' },
            },
        };

        MOCK_DRAFT_STORE.delete(claimId);

        return toClaimReceipt(submitted, requestAttributes);
    }

    await executeRestCall<JsonApiSingleResponse<ClaimResourceDto>>(
        'cc',
        'PATCH',
        `/claims/${encodeURIComponent(claimId)}`,
        { data: { attributes: requestAttributes } } satisfies ClaimUpdateRequestDto
    );

    const vehicleIncident = buildVehicleIncidentAttributes(
        context.draft,
        context.vehicles
    );

    if (vehicleIncident) {
        await executeRestCall<unknown>(
            'cc',
            'POST',
            `/claims/${encodeURIComponent(claimId)}/vehicle-incidents`,
            { data: { attributes: vehicleIncident } }
        );
    }

    const driverContact = buildDriverContactAttributes(
        context.draft,
        context.contacts
    );

    if (driverContact) {
        await executeRestCall<unknown>(
            'cc',
            'POST',
            `/claims/${encodeURIComponent(claimId)}/contacts`,
            { data: { attributes: driverContact } }
        );
    }

    const response = await executeRestCall<
        JsonApiSingleResponse<ClaimResourceDto>
    >(
        'cc',
        'POST',
        `/claims/${encodeURIComponent(claimId)}/submit`,
        EMPTY_SUBMIT_BODY
    );

    return toClaimReceipt(response.data, requestAttributes);
};

const createAndSubmit = async (
    requestAttributes: ClaimCreateAttributesDto,
    context: FnolSubmissionContext
): Promise<ClaimReceipt> => {
    if (runtimeConfig.useMocks) {
        await delay(MOCK_LATENCY_LONG_MS);
        const claim = buildMockClaim(requestAttributes, {
            claimStatus: { code: 'open', name: 'Open' },
        });

        return toClaimReceipt(claim, requestAttributes);
    }

    const vehicleIncident = buildVehicleIncidentAttributes(
        context.draft,
        context.vehicles
    );
    const driverContact = buildDriverContactAttributes(
        context.draft,
        context.contacts
    );

    const subRequests: CompositeSubRequest[] = [
        {
            method: 'POST',
            uri: '/claim/v1/claims',
            body: { data: { attributes: requestAttributes } },
            vars: [{ name: 'claimId', path: '$.data.attributes.id' }],
        },
    ];

    if (vehicleIncident) {
        subRequests.push({
            method: 'POST',
            uri: '/claim/v1/claims/${claimId}/vehicle-incidents',
            body: { data: { attributes: vehicleIncident } },
        });
    }

    if (driverContact) {
        subRequests.push({
            method: 'POST',
            uri: '/claim/v1/claims/${claimId}/contacts',
            body: { data: { attributes: driverContact } },
        });
    }

    subRequests.push({
        method: 'POST',
        uri: '/claim/v1/claims/${claimId}/submit',
        body: EMPTY_SUBMIT_BODY,
    });

    const { responses } = await executeComposite('cc', {
        requestTag: `jdp-fnol:createAndSubmit:${requestAttributes.policyNumber}`,
        requests: subRequests,
    });

    const submitted = unwrapSubResponse<
        JsonApiSingleResponse<ClaimResourceDto>
    >(responses[responses.length - 1], 'createAndSubmit:submit');

    return toClaimReceipt(submitted.data, requestAttributes);
};

export const submitFnol = async (
    context: FnolSubmissionContext
): Promise<ClaimReceipt> => {
    const { draft, locations = [] } = context;

    if (!isDraftSubmittable(draft)) {
        throw new Error('FNOL draft is incomplete');
    }

    const requestAttributes = buildClaimCreateAttributes(draft, locations);

    return draft.claimId
        ? submitExisting(draft.claimId, requestAttributes, context)
        : createAndSubmit(requestAttributes, context);
};
