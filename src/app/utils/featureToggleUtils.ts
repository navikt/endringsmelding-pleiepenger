export enum Feature {
    'PERSISTENCE' = 'PERSISTENCE',
    'FAKE_API_KALL' = 'FAKE_API_KALL',
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || appSettings[feature] === 'true';
};
