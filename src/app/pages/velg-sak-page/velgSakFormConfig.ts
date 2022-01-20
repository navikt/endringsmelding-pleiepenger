export enum VelgSakFormField {
    'barnAktørId' = 'barnAktørId',
}

export interface VelgSakFormData {
    [VelgSakFormField.barnAktørId]: string;
}

export const VelgSakFormInitialValues: Partial<VelgSakFormData> = {
    [VelgSakFormField.barnAktørId]: undefined,
};
