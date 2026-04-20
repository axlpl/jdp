import React from 'react';

import type { VehicleArea } from '../../../types/domain';

import carImage from '../../../assets/images/car.svg';

import styles from './VehicleImpactPicker.module.scss';

type Hotspot = {
    area: VehicleArea;
    xPercent: number;
    yPercent: number;
};

// Car image is oriented horizontally with the hood on the right side.
// Left edge = rear, right edge = front. Top/bottom edges = car sides.
const HOTSPOTS: Hotspot[] = [
    { area: 'frontCenter', xPercent: 92, yPercent: 50 },
    { area: 'frontLeft', xPercent: 78, yPercent: 22 },
    { area: 'frontRight', xPercent: 78, yPercent: 78 },
    { area: 'leftSide', xPercent: 50, yPercent: 15 },
    { area: 'rightSide', xPercent: 50, yPercent: 85 },
    { area: 'roof', xPercent: 50, yPercent: 50 },
    { area: 'rearLeft', xPercent: 22, yPercent: 22 },
    { area: 'rearCenter', xPercent: 8, yPercent: 50 },
    { area: 'rearRight', xPercent: 22, yPercent: 78 },
];

const PlusIcon = () => (
    <svg
        className={styles.hotspotIcon}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
    >
        <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        />
    </svg>
);

const CheckIcon = () => (
    <svg
        className={styles.hotspotIcon}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
    >
        <path
            d="M5 12.5l4.5 4.5L19 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

type Props = {
    selectedAreas: ReadonlySet<VehicleArea>;
    onToggle: (area: VehicleArea) => void;
    instruction?: string;
    areaLabel: (area: VehicleArea) => string;
};

export const VehicleImpactPicker = ({
    selectedAreas,
    onToggle,
    instruction,
    areaLabel,
}: Props) => (
    <div className={styles.pickerWrap}>
        {instruction && <p className={styles.instruction}>{instruction}</p>}
        <div className={styles.stage}>
            <img
                className={styles.carImage}
                src={carImage}
                alt=""
                draggable={false}
            />

            {HOTSPOTS.map(spot => {
                const selected = selectedAreas.has(spot.area);

                return (
                    <button
                        key={spot.area}
                        type="button"
                        className={`${styles.hotspot} ${
                            selected ? styles.hotspotSelected : ''
                        }`}
                        style={{
                            left: `${spot.xPercent}%`,
                            top: `${spot.yPercent}%`,
                        }}
                        onClick={() => onToggle(spot.area)}
                        aria-pressed={selected}
                        aria-label={`${areaLabel(spot.area)}${
                            selected ? ' (selected)' : ''
                        }`}
                    >
                        {selected ? <CheckIcon /> : <PlusIcon />}
                    </button>
                );
            })}
        </div>
    </div>
);
