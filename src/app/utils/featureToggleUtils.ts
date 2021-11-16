export enum Feature {
    'PERSISTENCE' = 'PERSISTENCE',
    'FAKE_API_KALL' = 'FAKE_API_KALL',
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    console.log(appSettings);

    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
