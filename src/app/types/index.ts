export type ISODateRange = string;
export type ISODuration = string;
export type ISODate = string;

export interface InputTime {
    hours: string | undefined;
    minutes: string | undefined;
}

export type DagerIkkeSøktForMap = { [key: ISODate]: true };

export type DagerSøktForMap = { [key: ISODate]: boolean };
