import { defineMessages } from 'react-intl';

export default defineMessages({
    stepPolicyTitle: {
        id: 'jdp.fnol.step.policy.title',
        defaultMessage: 'Select policy',
    },
    stepPolicyHeading: {
        id: 'jdp.fnol.step.policy.heading',
        defaultMessage: 'Which policy does this claim relate to?',
    },
    stepPolicyRadioLabel: {
        id: 'jdp.fnol.step.policy.radioLabel',
        defaultMessage: 'Policy',
    },
    stepPolicyRequired: {
        id: 'jdp.fnol.step.policy.required',
        defaultMessage: 'Please select a policy to continue.',
    },
    stepDateTitle: {
        id: 'jdp.fnol.step.date.title',
        defaultMessage: 'Date of loss',
    },
    stepDateHeading: {
        id: 'jdp.fnol.step.date.heading',
        defaultMessage: 'When did the loss occur?',
    },
    stepDateLabel: {
        id: 'jdp.fnol.step.date.label',
        defaultMessage: 'Date of loss',
    },
    stepDateErrorFuture: {
        id: 'jdp.fnol.step.date.error.future',
        defaultMessage: 'Date of loss cannot be in the future.',
    },
    stepDateErrorBeforePolicy: {
        id: 'jdp.fnol.step.date.error.beforePolicy',
        defaultMessage:
            'Date of loss is before the policy effective date ({effectiveDate}).',
    },
    stepDateErrorAfterPolicy: {
        id: 'jdp.fnol.step.date.error.afterPolicy',
        defaultMessage:
            'Date of loss is after the policy expiration date ({expirationDate}).',
    },
    stepDateRequired: {
        id: 'jdp.fnol.step.date.required',
        defaultMessage: 'Please enter the date of loss to continue.',
    },
    stepCauseTitle: {
        id: 'jdp.fnol.step.cause.title',
        defaultMessage: 'Loss cause',
    },
    stepCauseHeading: {
        id: 'jdp.fnol.step.cause.heading',
        defaultMessage: 'What caused the loss?',
    },
    stepCauseLabel: {
        id: 'jdp.fnol.step.cause.label',
        defaultMessage: 'Loss cause',
    },
    stepCauseRequired: {
        id: 'jdp.fnol.step.cause.required',
        defaultMessage: 'Please select a loss cause to continue.',
    },
    submitErrorTitle: {
        id: 'jdp.fnol.submit.error.title',
        defaultMessage: 'Submission failed',
    },
    submitError: {
        id: 'jdp.fnol.submit.error',
        defaultMessage: 'We could not file your claim. Please try again.',
    },
    confirmationTitle: {
        id: 'jdp.fnol.confirmation.title',
        defaultMessage: 'Claim filed',
    },
    confirmationMessage: {
        id: 'jdp.fnol.confirmation.message',
        defaultMessage:
            'Your claim has been filed successfully. Your claim number is {claimNumber}.',
    },
    confirmationBackToDashboard: {
        id: 'jdp.fnol.confirmation.backToDashboard',
        defaultMessage: 'Back to dashboard',
    },
});
