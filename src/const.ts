import { version as packageVersion } from '../package.json' with { type: 'json' };

export const getCompatibility = () => '2025-07-01';
export const getUa = () => `freestuff-js/${packageVersion ?? 'unknown'} (https://docs.freestuffbot.xyz/libraries/node/)`;
