import { defineMessages } from 'react-intl';

export default defineMessages({
    pageTitle: {
        id: 'jdp.dashboard.title',
        defaultMessage: 'My policies',
    },
    pageSubtitle: {
        id: 'jdp.dashboard.subtitle',
        defaultMessage: 'File a claim for any of your active policies.',
    },
    fileAClaim: {
        id: 'jdp.dashboard.fileAClaim',
        defaultMessage: 'File a Claim',
    },
    loading: {
        id: 'jdp.dashboard.loading',
        defaultMessage: 'Loading policies…',
    },
    loadError: {
        id: 'jdp.dashboard.loadError',
        defaultMessage: 'We could not load your policies. Please try again.',
    },
    retry: {
        id: 'jdp.dashboard.retry',
        defaultMessage: 'Retry',
    },
    colPolicyNumber: {
        id: 'jdp.dashboard.col.policyNumber',
        defaultMessage: 'Policy',
    },
    colProduct: {
        id: 'jdp.dashboard.col.product',
        defaultMessage: 'Product',
    },
    colVehicle: {
        id: 'jdp.dashboard.col.vehicle',
        defaultMessage: 'Vehicle',
    },
    colPlate: {
        id: 'jdp.dashboard.col.plate',
        defaultMessage: 'Plate',
    },
    colPeriod: {
        id: 'jdp.dashboard.col.period',
        defaultMessage: 'Period',
    },
    colStatus: {
        id: 'jdp.dashboard.col.status',
        defaultMessage: 'Status',
    },
    colActions: {
        id: 'jdp.dashboard.col.actions',
        defaultMessage: 'Actions',
    },
    emptyState: {
        id: 'jdp.dashboard.emptyState',
        defaultMessage: 'You do not have any active policies.',
    },
    searchPlaceholder: {
        id: 'jdp.dashboard.searchPlaceholder',
        defaultMessage: 'Search by policy number, vehicle, plate or holder…',
    },
    searchEmpty: {
        id: 'jdp.dashboard.searchEmpty',
        defaultMessage: 'No policies match your search.',
    },
    resultsCount: {
        id: 'jdp.dashboard.resultsCount',
        defaultMessage:
            '{count, plural, one {# policy} other {# policies}}',
    },
    draftBannerTitle: {
        id: 'jdp.dashboard.draftBanner.title',
        defaultMessage: 'You have a draft in progress',
    },
    draftBannerBody: {
        id: 'jdp.dashboard.draftBanner.body',
        defaultMessage: 'Continue where you left off or discard the draft.',
    },
    draftBannerContinue: {
        id: 'jdp.dashboard.draftBanner.continue',
        defaultMessage: 'Continue',
    },
    draftBannerDiscard: {
        id: 'jdp.dashboard.draftBanner.discard',
        defaultMessage: 'Discard',
    },
    draftDiscardTitle: {
        id: 'jdp.dashboard.draftDiscard.title',
        defaultMessage: 'Discard this draft?',
    },
    draftDiscardBody: {
        id: 'jdp.dashboard.draftDiscard.body',
        defaultMessage:
            'Any information you entered will be permanently removed.',
    },
    draftDiscardConfirm: {
        id: 'jdp.dashboard.draftDiscard.confirm',
        defaultMessage: 'Discard',
    },
    draftDiscardCancel: {
        id: 'jdp.dashboard.draftDiscard.cancel',
        defaultMessage: 'Keep draft',
    },
});
