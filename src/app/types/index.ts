export type ISODateRange = string;
export type ISODuration = string;
export type ISODate = string;

export type DagerIkkeSøktForMap = { [key: ISODate]: true };

export type DagerSøktForMap = { [key: ISODate]: boolean };

export interface InputTime {
    hours: string | undefined;
    minutes: string | undefined;
}
