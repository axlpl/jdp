import React, { useContext, useState } from 'react';
import cx from 'classnames';
import { get } from 'lodash';

import { Grid } from '@jutro/layout';
import {
    Button,
    Card,
    DropdownMenu,
    DropdownMenuHeader,
    DropdownMenuSeparator,
    ModalNextContext,
} from '@jutro/components';
import { getConfigValue } from '@jutro/config';
import {
    CheckboxField,
    CurrencyField,
    DateRangeField,
    DropdownSelectField,
    RadioField,
    ToggleField,
    YearField,
} from '@jutro/legacy/components';
import { useTranslator } from '@jutro/locale';
import { debug } from '@jutro/logger';
import { DropdownMenuLink } from '@jutro/router';
import { createJsonHttpRequest } from '@jutro/transport';

import { useFormData } from './hooks/useFormData';
import { useFormValidation } from './hooks/useFormValidation';
import {
    constructionOptions,
    electricalSystems,
    foundationOptions,
    garageOptions,
    heatingOptions,
    plumbingOptions,
    roofTypes,
    storiesOptions,
    wiringTypes,
} from './availableValues';

import messages from './CodelessForm.messages';

import styles from './CodelessForm.module.scss';

export const CodelessForm = props => {
    const translator = useTranslator();
    const submitToServer = getConfigValue('submitToServer');

    const serverUrl = getConfigValue('serverUrl');

    const { isFormValid, onValidationChange } = useFormValidation();
    const { formData, onValueChange } = useFormData({
        initialValue: 350000,
        garage: 'noGarage',
        electricalSystemUpgraded: true,
        secondaryHeating: true,
        rootType: 'composition',
        numberOfStories: '1',
    });

    const [submitted, setSubmitted] = useState(false);

    const getFieldProps = path => ({
        onValueChange,
        onValidationChange,
        path,
        value: get(formData, path),
        showErrors: submitted,
        showRequired: true,
    });

    const saveForm = () => {
        if (!isFormValid) {
            showError(messages.formValidationError);
            setSubmitted(true);

            return;
        }

        if (submitToServer) {
            /** @type {import('@jutro/transport').HttpRequest} */ (
                createJsonHttpRequest(serverUrl)
            )
                .post('/submit', formData)
                .then(result => {
                    showSuccess(messages.backendMetadataValidationSucess);
                    debug(result.content);
                })
                .catch(error => showError(JSON.stringify(error)));
        } else {
            showSuccess(messages.formSavedSuccesfully);
        }
    };

    const { showAlert } = useContext(ModalNextContext);

    const showSuccess = msg => {
        showAlert({
            status: 'success',
            title: messages.genericSuccessMessage,
            message: msg,
        });
    };

    const showError = msg => {
        showAlert({
            status: 'error',
            title: messages.genericErrorMessage,
            message: msg,
        });
    };

    const { className } = props;

    return (
        <div className={cx(styles.formExamplePage, className)}>
            <Grid gap="small">
                <Card title={messages.formTitle} isPanel>
                    <Grid gap="large">
                        <p>{translator(messages.formDescription)}</p>

                        <YearField
                            id="yearBuilt"
                            label={messages.yearBuilt}
                            placeholder={messages.pleaseSelect}
                            required
                            {...getFieldProps('yearBuilt')}
                        />

                        <DateRangeField
                            id="rentalTime"
                            label={messages.rentalFrom}
                            placeholder={messages.pleaseSelect}
                            endLabel={messages.rentalTo}
                            minDate={formData.yearBuilt}
                            {...getFieldProps('rentalTime')}
                        />

                        <CurrencyField
                            id="initialValue"
                            label={messages.initialValueEstimation}
                            required
                            dataType="number"
                            {...getFieldProps('initialValue')}
                        />

                        <DropdownSelectField
                            id="numberOfStories"
                            label={messages.numberOfStories}
                            availableValues={storiesOptions}
                            alwaysShowPlaceholder
                            required
                            {...getFieldProps('numberOfStories')}
                        />

                        <ToggleField
                            id="garage"
                            availableValues={garageOptions}
                            label={messages.garage}
                            required
                            {...getFieldProps('garage')}
                        />

                        <DropdownSelectField
                            id="constructionType"
                            label={messages.constructionType}
                            availableValues={constructionOptions}
                            required
                            {...getFieldProps('constructionType')}
                        />

                        <h1 id="constructionTypeMessage">
                            {translator(messages.aboutItsConstruction)}
                        </h1>

                        <p>{translator(messages.constructionDescription)}</p>

                        <DropdownSelectField
                            id="foundationType"
                            label={messages.foundationType}
                            availableValues={foundationOptions}
                            required
                            {...getFieldProps('foundationType')}
                        />

                        <RadioField
                            id="rootType"
                            label={messages.roofType}
                            isHorizontal
                            required
                            availableValues={roofTypes}
                            {...getFieldProps('rootType')}
                        />

                        <CheckboxField
                            id="roofTypeUpgraded"
                            showInlineLabel
                            label={messages.roofTypeUpgraded}
                            {...getFieldProps('roofTypeUpgraded')}
                        />

                        <DropdownSelectField
                            id="plumbingType"
                            label={messages.plumbingType}
                            availableValues={plumbingOptions}
                            required
                            {...getFieldProps('plumbingType')}
                        />

                        <CheckboxField
                            id="plumbingTypeUpgraded"
                            showInlineLabel
                            label={messages.plumbingTypeUpgraded}
                            {...getFieldProps('plumbingTypeUpgraded')}
                        />

                        <DropdownSelectField
                            id="primaryHeating"
                            label={messages.primaryHeating}
                            availableValues={heatingOptions}
                            required
                            {...getFieldProps('primaryHeating')}
                        />

                        <ToggleField
                            id="secondaryHeating"
                            label={messages.secondaryHeating}
                            required
                            {...getFieldProps('secondaryHeating')}
                        />

                        <CheckboxField
                            id="secondaryHeatingUpgraded"
                            showInlineLabel
                            label={messages.secondaryHeatingUpgraded}
                            {...getFieldProps('secondaryHeatingUpgraded')}
                        />

                        <DropdownSelectField
                            id="wiringType"
                            label={messages.wiringType}
                            availableValues={wiringTypes}
                            required
                            {...getFieldProps('wiringType')}
                        />

                        <DropdownSelectField
                            id="electricalSystem"
                            label={messages.electricalSystem}
                            availableValues={electricalSystems}
                            required
                            {...getFieldProps('electricalSystem')}
                        />

                        <CheckboxField
                            id="electricalSystemUpgraded"
                            showInlineLabel
                            label={messages.electricalSystemUpgraded}
                            {...getFieldProps('electricalSystemUpgraded')}
                        />

                        <DropdownMenu
                            id="externalLinksMenu"
                            renderTrigger={(
                                { menuId, isOpen, ref, ...other },
                                toggleMenu
                            ) => (
                                <Button
                                    {...other}
                                    ref={ref}
                                    aria-controls={menuId}
                                    label={messages.externalLinks}
                                    onClick={() => toggleMenu(!isOpen)}
                                />
                            )}
                        >
                            <DropdownMenuHeader title={messages.heating}>
                                <DropdownMenuLink
                                    to={messages.beginnersGuideLink}
                                >
                                    {translator(messages.beginnersGuide)}
                                </DropdownMenuLink>
                            </DropdownMenuHeader>

                            <DropdownMenuSeparator />

                            <DropdownMenuHeader title={messages.electrical}>
                                <DropdownMenuLink
                                    to={messages.expertsGuideLink}
                                >
                                    {translator(messages.expertsGuide)}
                                </DropdownMenuLink>
                            </DropdownMenuHeader>
                        </DropdownMenu>

                        <DropdownMenu
                            id="internalLinksMenu"
                            renderTrigger={(
                                { menuId, isOpen, ref, ...other },
                                toggleMenu
                            ) => (
                                <Button
                                    {...other}
                                    ref={ref}
                                    aria-controls={menuId}
                                    label={messages.internalLinks}
                                    onClick={() => toggleMenu(!isOpen)}
                                />
                            )}
                        >
                            <DropdownMenuHeader title={messages.forms}>
                                <DropdownMenuLink to={messages.tpsReportLink}>
                                    {translator(messages.tpsReport)}
                                </DropdownMenuLink>
                            </DropdownMenuHeader>

                            <DropdownMenuSeparator />

                            <DropdownMenuHeader title={messages.faqs}>
                                <DropdownMenuLink to={messages.faqsLink}>
                                    {translator(messages.howToUseKeyboard)}
                                </DropdownMenuLink>
                            </DropdownMenuHeader>
                        </DropdownMenu>

                        <span>{translator(messages.formClosingParagraph)}</span>

                        <Grid columns={['1fr']} justifyItems="evenly">
                            <Button
                                id="save"
                                onClick={saveForm}
                                label={messages.submitTheForm}
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </div>
    );
};
