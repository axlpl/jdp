export const MOCK_LATENCY_SHORT_MS = 200;
export const MOCK_LATENCY_NORMAL_MS = 400;
export const MOCK_LATENCY_LONG_MS = 700;

export const delay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));
