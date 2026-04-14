import type { LossCause } from '../../types/domain';

export const LOSS_CAUSES = [
    { code: 'collision', displayName: 'Collision' },
    { code: 'theft', displayName: 'Theft' },
    { code: 'vandalism', displayName: 'Vandalism' },
    { code: 'glassDamage', displayName: 'Glass damage' },
    { code: 'animalCollision', displayName: 'Animal collision' },
    { code: 'fire', displayName: 'Fire' },
    { code: 'flood', displayName: 'Flood' },
    { code: 'weather', displayName: 'Weather' },
    { code: 'other', displayName: 'Other' },
] as const satisfies readonly LossCause[];

export type LossCauseCode = (typeof LOSS_CAUSES)[number]['code'];
