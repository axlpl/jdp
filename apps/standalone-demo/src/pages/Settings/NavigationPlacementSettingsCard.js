import React, { useCallback, useState } from 'react';

import { useBreakpoint } from '@jutro/layout';
import { ToggleField } from '@jutro/legacy/components';

import { useSetting } from '../../context/SettingsContext';

import { SettingsCard } from './components/SettingsCard';

import { messages } from './NavigationPlacementSettingsCard.messages';

const placementOptions = [
    {
        id: 'top',
        displayName: messages.top,
    },
    {
        id: 'left',
        displayName: messages.left,
    },
];

export const NavigationPlacementSettingsCard = props => {
    const { id, title } = props;

    const ctx = useSetting('navPlacement');

    const [navigationPlacement, setNavigationPlacement] = useState(
        ctx?.getValue() || 'top'
    );

    const updateSetting = useCallback(() => {
        ctx?.setValue(navigationPlacement);
    }, [ctx, navigationPlacement]);

    const restoreSetting = useCallback(() => {
        setNavigationPlacement(ctx?.getValue() || 'top');
    }, [ctx]);

    const { breakpoint } = useBreakpoint(props);

    if (breakpoint !== 'desktop') {
        return null;
    }

    const RenderContent = isEditMode => (
        <ToggleField
            id="position-toggle"
            label={messages.navigationPlacement}
            availableValues={placementOptions}
            readOnly={!isEditMode}
            value={navigationPlacement}
            onValueChange={setNavigationPlacement}
        />
    );

    return (
        <SettingsCard
            id={id}
            renderContent={RenderContent}
            title={title}
            onSaveClick={updateSetting}
            onCancelClick={restoreSetting}
        />
    );
};
