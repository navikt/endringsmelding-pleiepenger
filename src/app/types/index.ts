import { ISODate } from '@navikt/sif-common-utils';

// export { ISODate, ISODateRange, ISODuration } from '@navikt/sif-common-utils';

export type DagerIkkeSøktForMap = { [key: ISODate]: true };

export type DagerSøktForMap = { [key: ISODate]: boolean };

export enum HvaSkalEndres {
    'arbeidstid' = 'arbeidstid',
    'omsorgstilbud' = 'omsorgstilbud',
}
