import type {
    ClaimCreateAttributesDto,
    ClaimResourceDto,
} from './dto/claim';
import type { PolicyResourceDto } from './dto/policy';
import type { TypeKeyDto } from './dto/typelist';
import { LOSS_CAUSES } from '../features/fnol/lossCauses';

import type {
    ClaimReceipt,
    DraftSummary,
    FnolDraft,
    LossCause,
    LossCauseCode,
    Policy,
} from './domain';

const EMPTY_FNOL_DRAFT: FnolDraft = {
    claimId: null,
    policyNumber: null,
    dateOfLoss: null,
    timeOfLoss: null,
    lossCause: null,
    lossDescription: null,
    lossLocation: null,
    impactAreas: [],
    vehicleDriveable: null,
    reporterPhone: null,
    injuriesInvolved: null,
    injuryDescription: null,
    policeCalled: null,
    policeReportNumber: null,
    otherPartyName: null,
    otherPartyPhone: null,
    otherPartyInsurer: null,
    otherPartyPlate: null,
    witnessDetails: null,
    photoCount: 0,
};

const LOSS_CAUSE_CODES = new Set<LossCauseCode>(
    LOSS_CAUSES.map(c => c.code)
);

const toLossCauseCode = (code: string | undefined): LossCauseCode | null => {
    if (code && LOSS_CAUSE_CODES.has(code as LossCauseCode)) {
        return code as LossCauseCode;
    }

    return null;
};

const splitDateAndTime = (
    iso: string | undefined
): { date: string | null; time: string | null } => {
    if (!iso) {
        return { date: null, time: null };
    }
    const t = iso.indexOf('T');

    if (t < 0) {
        return { date: iso.length >= 10 ? iso.slice(0, 10) : iso, time: null };
    }

    return { date: iso.slice(0, t), time: iso.slice(t + 1, t + 6) };
};

const deriveStatus = (periodEnd: string): 'In Force' | 'Expired' => {
    if (!periodEnd) {
        return 'In Force';
    }
    const end = new Date(periodEnd).getTime();

    if (Number.isNaN(end)) {
        return 'In Force';
    }

    return end < Date.now() ? 'Expired' : 'In Force';
};

export const toPolicy = (dto: PolicyResourceDto): Policy => {
    const a = dto.attributes;
    const product = a.product?.displayName ?? a.product?.id ?? '';
    const holder = a.primaryInsured?.displayName ?? '';

    return {
        policyNumber: a.policyNumber,
        productCode: a.product?.id ?? '',
        productName: product,
        accountHolderName: holder,
        vehicleDescription: '',
        licensePlate: '',
        effectiveDate: a.periodStart,
        expirationDate: a.periodEnd,
        status: deriveStatus(a.periodEnd),
    };
};

export const toLossCause = (dto: TypeKeyDto): LossCause => ({
    code: dto.code as LossCauseCode,
    displayName: dto.name,
});

export const toClaimReceipt = (
    dto: ClaimResourceDto,
    request: ClaimCreateAttributesDto
): ClaimReceipt => ({
    claimNumber: dto.attributes.claimNumber,
    policyNumber: request.policyNumber,
    lossDate: dto.attributes.lossDate,
    lossCause:
        dto.attributes.lossCause?.code ?? request.lossCause.code,
    status:
        dto.attributes.claimStatus?.name ??
        dto.attributes.claimStatus?.code ??
        'Open',
});

const combineDateTime = (date: string, time: string | null): string => {
    if (!time) {
        return date;
    }
    const datePart = date.length >= 10 ? date.slice(0, 10) : date;

    return `${datePart}T${time}:00`;
};

export type CompleteFnolDraft = FnolDraft & {
    policyNumber: string;
    dateOfLoss: string;
    lossCause: LossCauseCode;
};

export const isDraftSubmittable = (
    draft: FnolDraft
): draft is CompleteFnolDraft =>
    draft.policyNumber !== null &&
    draft.dateOfLoss !== null &&
    draft.lossCause !== null;

const buildLossLocation = (draft: FnolDraft):
    | ClaimCreateAttributesDto['lossLocation']
    | undefined => {
    const text = draft.lossLocation?.trim();

    if (!text) {
        return undefined;
    }

    return { displayName: text };
};

const field = (label: string, value: string | null | undefined): string | null => {
    const trimmed = value?.trim();

    return trimmed ? `${label}: ${trimmed}` : null;
};

const yesNo = (label: string, value: boolean | null): string | null =>
    value == null ? null : `${label}: ${value ? 'yes' : 'no'}`;

const impactAreasLine = (draft: FnolDraft): string | null => {
    if (draft.impactAreas.length === 0) {
        return null;
    }
    const parts = draft.impactAreas.map(a =>
        a.damageType ? `${a.area} (${a.damageType})` : a.area
    );

    return `Impact areas: ${parts.join(', ')}`;
};

const otherPartyLine = (draft: FnolDraft): string | null => {
    if (!draft.otherPartyName?.trim()) {
        return null;
    }
    const details = [
        draft.otherPartyName,
        draft.otherPartyPhone,
        draft.otherPartyInsurer,
        draft.otherPartyPlate,
    ]
        .filter((v): v is string => Boolean(v))
        .join(' · ');

    return `Other party: ${details}`;
};

const composeDescription = (draft: FnolDraft): string | undefined => {
    const lines = [
        draft.lossDescription?.trim() || null,
        impactAreasLine(draft),
        yesNo('Vehicle driveable', draft.vehicleDriveable),
        field('Reporter phone', draft.reporterPhone),
        yesNo('Injuries', draft.injuriesInvolved),
        field('Injury details', draft.injuryDescription),
        yesNo('Police called', draft.policeCalled),
        field('Police report', draft.policeReportNumber),
        otherPartyLine(draft),
        field('Witnesses', draft.witnessDetails),
        draft.photoCount > 0 ? `Photos attached: ${draft.photoCount}` : null,
    ].filter((line): line is string => Boolean(line));

    return lines.length > 0 ? lines.join('\n') : undefined;
};

export const buildClaimCreateAttributes = (
    draft: CompleteFnolDraft
): ClaimCreateAttributesDto => ({
    policyNumber: draft.policyNumber,
    lossDate: combineDateTime(draft.dateOfLoss, draft.timeOfLoss),
    lossCause: { code: draft.lossCause },
    description: composeDescription(draft),
    lossLocation: buildLossLocation(draft),
});

export const buildClaimDraftAttributes = (
    draft: FnolDraft
): Partial<ClaimCreateAttributesDto> => {
    const attrs: Partial<ClaimCreateAttributesDto> = {};

    if (draft.policyNumber) {
        attrs.policyNumber = draft.policyNumber;
    }
    if (draft.dateOfLoss) {
        attrs.lossDate = combineDateTime(draft.dateOfLoss, draft.timeOfLoss);
    }
    if (draft.lossCause) {
        attrs.lossCause = { code: draft.lossCause };
    }
    const description = composeDescription(draft);

    if (description !== undefined) {
        attrs.description = description;
    }
    const location = buildLossLocation(draft);

    if (location !== undefined) {
        attrs.lossLocation = location;
    }

    return attrs;
};

export const toFnolDraft = (dto: ClaimResourceDto): FnolDraft => {
    const a = dto.attributes;
    const { date, time } = splitDateAndTime(a.lossDate);

    return {
        ...EMPTY_FNOL_DRAFT,
        claimId: dto.id,
        policyNumber: a.policyNumber ?? null,
        dateOfLoss: date,
        timeOfLoss: time,
        lossCause: toLossCauseCode(a.lossCause?.code),
        lossDescription: a.description ?? null,
        lossLocation: a.lossLocation?.displayName ?? null,
    };
};

export const toDraftSummary = (dto: ClaimResourceDto): DraftSummary => ({
    claimId: dto.id,
    claimNumber: dto.attributes.claimNumber ?? null,
    policyNumber: dto.attributes.policyNumber ?? '',
    lossDate: dto.attributes.lossDate,
    updatedAt: dto.attributes.updateTime ?? dto.attributes.lossDate,
});
