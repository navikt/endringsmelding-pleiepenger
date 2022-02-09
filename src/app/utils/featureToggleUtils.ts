export enum Feature {
    VELG_SAK = 'VELG_SAK',
    MELLOMLAGRING = 'MELLOMLAGRING',
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || appSettings[feature] === 'true';
};
