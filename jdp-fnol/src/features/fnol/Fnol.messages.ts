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
    stepTimeLabel: {
        id: 'jdp.fnol.step.date.timeLabel',
        defaultMessage: 'Time of loss (optional)',
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
    stepDetailsTitle: {
        id: 'jdp.fnol.step.details.title',
        defaultMessage: 'Loss details',
    },
    stepDetailsHeading: {
        id: 'jdp.fnol.step.details.heading',
        defaultMessage: 'Tell us what happened.',
    },
    stepDetailsDescriptionLabel: {
        id: 'jdp.fnol.step.details.descriptionLabel',
        defaultMessage: 'What happened?',
    },
    stepDetailsDescriptionPlaceholder: {
        id: 'jdp.fnol.step.details.descriptionPlaceholder',
        defaultMessage: 'Briefly describe the incident.',
    },
    stepDetailsLocationLabel: {
        id: 'jdp.fnol.step.details.locationLabel',
        defaultMessage: 'Where did it happen?',
    },
    stepDetailsLocationPlaceholder: {
        id: 'jdp.fnol.step.details.locationPlaceholder',
        defaultMessage: 'Street, city, or intersection',
    },
    stepDetailsRequired: {
        id: 'jdp.fnol.step.details.required',
        defaultMessage: 'Please describe what happened and where.',
    },
    stepDetailsImpactTitle: {
        id: 'jdp.fnol.step.details.impactTitle',
        defaultMessage: 'Select area of the vehicle that was damaged',
    },
    stepDetailsImpactInstruction: {
        id: 'jdp.fnol.step.details.impactInstruction',
        defaultMessage: 'Tap the car to mark each damaged area.',
    },
    stepDetailsDamageTypeLabel: {
        id: 'jdp.fnol.step.details.damageTypeLabel',
        defaultMessage: 'Select type of damage',
    },
    areaFrontLeft: {
        id: 'jdp.fnol.area.frontLeft',
        defaultMessage: 'Front left',
    },
    areaFrontCenter: {
        id: 'jdp.fnol.area.frontCenter',
        defaultMessage: 'Front center',
    },
    areaFrontRight: {
        id: 'jdp.fnol.area.frontRight',
        defaultMessage: 'Front right',
    },
    areaLeftSide: {
        id: 'jdp.fnol.area.leftSide',
        defaultMessage: 'Left side',
    },
    areaRightSide: {
        id: 'jdp.fnol.area.rightSide',
        defaultMessage: 'Right side',
    },
    areaRearLeft: {
        id: 'jdp.fnol.area.rearLeft',
        defaultMessage: 'Rear left',
    },
    areaRearCenter: {
        id: 'jdp.fnol.area.rearCenter',
        defaultMessage: 'Rear center',
    },
    areaRearRight: {
        id: 'jdp.fnol.area.rearRight',
        defaultMessage: 'Rear right',
    },
    areaRoof: {
        id: 'jdp.fnol.area.roof',
        defaultMessage: 'Roof',
    },
    damageScratch: {
        id: 'jdp.fnol.damage.scratch',
        defaultMessage: 'Scratch',
    },
    damageDent: {
        id: 'jdp.fnol.damage.dent',
        defaultMessage: 'Dent',
    },
    damageCrack: {
        id: 'jdp.fnol.damage.crack',
        defaultMessage: 'Crack',
    },
    damageBrokenLight: {
        id: 'jdp.fnol.damage.brokenLight',
        defaultMessage: 'Broken light',
    },
    damageBrokenMirror: {
        id: 'jdp.fnol.damage.brokenMirror',
        defaultMessage: 'Broken mirror',
    },
    damageShattered: {
        id: 'jdp.fnol.damage.shattered',
        defaultMessage: 'Shattered glass',
    },
    damageBentFrame: {
        id: 'jdp.fnol.damage.bentFrame',
        defaultMessage: 'Bent frame',
    },
    damageOther: {
        id: 'jdp.fnol.damage.other',
        defaultMessage: 'Other',
    },
    stepDetailsDriveableLabel: {
        id: 'jdp.fnol.step.details.driveableLabel',
        defaultMessage: 'Is the vehicle driveable?',
    },
    stepDetailsPhoneLabel: {
        id: 'jdp.fnol.step.details.phoneLabel',
        defaultMessage: 'Contact phone number',
    },
    stepDetailsPhonePlaceholder: {
        id: 'jdp.fnol.step.details.phonePlaceholder',
        defaultMessage: 'e.g. +1 555 123 4567',
    },
    stepOtherTitle: {
        id: 'jdp.fnol.step.other.title',
        defaultMessage: 'Other details',
    },
    stepOtherOptional: {
        id: 'jdp.fnol.step.other.optional',
        defaultMessage: 'Optional',
    },
    stepOtherHeading: {
        id: 'jdp.fnol.step.other.heading',
        defaultMessage:
            'Add injury, report, or witness details — skip if not applicable.',
    },
    stepOtherInjuriesLabel: {
        id: 'jdp.fnol.step.other.injuriesLabel',
        defaultMessage: 'Was anyone injured?',
    },
    stepOtherInjuryDescriptionLabel: {
        id: 'jdp.fnol.step.other.injuryDescriptionLabel',
        defaultMessage: 'Injury description',
    },
    stepOtherPoliceCalledLabel: {
        id: 'jdp.fnol.step.other.policeCalledLabel',
        defaultMessage: 'Were the police called?',
    },
    stepOtherPoliceReportLabel: {
        id: 'jdp.fnol.step.other.policeReportLabel',
        defaultMessage: 'Police report number',
    },
    stepOtherOtherPartyHeading: {
        id: 'jdp.fnol.step.other.otherPartyHeading',
        defaultMessage: 'Other party (if applicable)',
    },
    stepOtherOtherPartyName: {
        id: 'jdp.fnol.step.other.otherPartyName',
        defaultMessage: 'Name',
    },
    stepOtherOtherPartyPhone: {
        id: 'jdp.fnol.step.other.otherPartyPhone',
        defaultMessage: 'Phone',
    },
    stepOtherOtherPartyInsurer: {
        id: 'jdp.fnol.step.other.otherPartyInsurer',
        defaultMessage: 'Insurer',
    },
    stepOtherOtherPartyPlate: {
        id: 'jdp.fnol.step.other.otherPartyPlate',
        defaultMessage: 'License plate',
    },
    stepOtherPhotosHeading: {
        id: 'jdp.fnol.step.other.photosHeading',
        defaultMessage: 'Photos',
    },
    stepOtherPhotosHint: {
        id: 'jdp.fnol.step.other.photosHint',
        defaultMessage:
            'Attach photos of the damage, scene or documents. Files stay on your device until submission.',
    },
    stepOtherWitnessesLabel: {
        id: 'jdp.fnol.step.other.witnessesLabel',
        defaultMessage: 'Witness details',
    },
    stepReviewTitle: {
        id: 'jdp.fnol.step.review.title',
        defaultMessage: 'Review and confirm',
    },
    stepReviewHeading: {
        id: 'jdp.fnol.step.review.heading',
        defaultMessage:
            'Review your claim before submitting. You can still go back to edit.',
    },
    reviewSectionPolicy: {
        id: 'jdp.fnol.review.section.policy',
        defaultMessage: 'Policy',
    },
    reviewSectionIncident: {
        id: 'jdp.fnol.review.section.incident',
        defaultMessage: 'Incident',
    },
    reviewSectionOther: {
        id: 'jdp.fnol.review.section.other',
        defaultMessage: 'Other details',
    },
    reviewFieldPolicyNumber: {
        id: 'jdp.fnol.review.field.policyNumber',
        defaultMessage: 'Policy number',
    },
    reviewFieldVehicle: {
        id: 'jdp.fnol.review.field.vehicle',
        defaultMessage: 'Vehicle',
    },
    reviewFieldDate: {
        id: 'jdp.fnol.review.field.date',
        defaultMessage: 'Date of loss',
    },
    reviewFieldTime: {
        id: 'jdp.fnol.review.field.time',
        defaultMessage: 'Time of loss',
    },
    reviewFieldImpact: {
        id: 'jdp.fnol.review.field.impact',
        defaultMessage: 'Point of impact',
    },
    reviewFieldDriveable: {
        id: 'jdp.fnol.review.field.driveable',
        defaultMessage: 'Vehicle driveable',
    },
    reviewFieldReporterPhone: {
        id: 'jdp.fnol.review.field.reporterPhone',
        defaultMessage: 'Contact phone',
    },
    reviewFieldPoliceCalled: {
        id: 'jdp.fnol.review.field.policeCalled',
        defaultMessage: 'Police called',
    },
    reviewFieldOtherPartyName: {
        id: 'jdp.fnol.review.field.otherPartyName',
        defaultMessage: 'Other party — name',
    },
    reviewFieldOtherPartyPhone: {
        id: 'jdp.fnol.review.field.otherPartyPhone',
        defaultMessage: 'Other party — phone',
    },
    reviewFieldOtherPartyInsurer: {
        id: 'jdp.fnol.review.field.otherPartyInsurer',
        defaultMessage: 'Other party — insurer',
    },
    reviewFieldOtherPartyPlate: {
        id: 'jdp.fnol.review.field.otherPartyPlate',
        defaultMessage: 'Other party — plate',
    },
    reviewFieldPhotos: {
        id: 'jdp.fnol.review.field.photos',
        defaultMessage: 'Photos attached',
    },
    saveAndExit: {
        id: 'jdp.fnol.saveAndExit',
        defaultMessage: 'Save & exit',
    },
    submitClaim: {
        id: 'jdp.fnol.submitClaim',
        defaultMessage: 'Submit claim',
    },
    discardDraft: {
        id: 'jdp.fnol.discardDraft',
        defaultMessage: 'Discard draft',
    },
    discardConfirmTitle: {
        id: 'jdp.fnol.discardConfirm.title',
        defaultMessage: 'Discard this draft?',
    },
    discardConfirmBody: {
        id: 'jdp.fnol.discardConfirm.body',
        defaultMessage:
            'Any information you entered will be permanently removed.',
    },
    discardConfirmConfirm: {
        id: 'jdp.fnol.discardConfirm.confirm',
        defaultMessage: 'Discard',
    },
    discardConfirmCancel: {
        id: 'jdp.fnol.discardConfirm.cancel',
        defaultMessage: 'Keep draft',
    },
    reviewFieldCause: {
        id: 'jdp.fnol.review.field.cause',
        defaultMessage: 'Loss cause',
    },
    reviewFieldDescription: {
        id: 'jdp.fnol.review.field.description',
        defaultMessage: 'Description',
    },
    reviewFieldLocation: {
        id: 'jdp.fnol.review.field.location',
        defaultMessage: 'Location',
    },
    reviewFieldInjuries: {
        id: 'jdp.fnol.review.field.injuries',
        defaultMessage: 'Injuries',
    },
    reviewFieldInjuryDescription: {
        id: 'jdp.fnol.review.field.injuryDescription',
        defaultMessage: 'Injury description',
    },
    reviewFieldPoliceReport: {
        id: 'jdp.fnol.review.field.policeReport',
        defaultMessage: 'Police report',
    },
    reviewFieldWitnesses: {
        id: 'jdp.fnol.review.field.witnesses',
        defaultMessage: 'Witnesses',
    },
    reviewYes: {
        id: 'jdp.fnol.review.yes',
        defaultMessage: 'Yes',
    },
    reviewNo: {
        id: 'jdp.fnol.review.no',
        defaultMessage: 'No',
    },
    reviewNotProvided: {
        id: 'jdp.fnol.review.notProvided',
        defaultMessage: '—',
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
