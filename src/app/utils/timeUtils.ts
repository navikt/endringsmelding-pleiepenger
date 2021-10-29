import { Time } from '@navikt/sif-common-formik/lib';
import { parse } from 'iso8601-duration';
import { memoize } from 'lodash';

export const _timeToISODuration = ({ hours, minutes }: Partial<Time>): string => {
    return `PT${hours || 0}H${minutes || 0}M`;
};
export const timeToISODuration = memoize(_timeToISODuration);

export const _isoDurationToTime = (duration: string): Partial<Time> | undefined => {
    const parts = parse(duration);

    return parts
        ? {
              hours: `${parts.hours}`,
              minutes: `${parts.minutes}`,
          }
        : undefined;
};
export const isoDurationToTime = memoize(_isoDurationToTime);
