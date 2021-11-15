import { useEffect, useState } from 'react';
import { combine, initial, pending, RemoteData } from '@devexperts/remote-data-ts';
import { isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError } from 'axios';
import getArbeidsgivereRemoteData from '../api/getArbeidsgivere';
import getSokerRemoteData from '../api/getSoker';
import getSoknadTempStorage from '../api/getSoknadTempStorage';
import getK9SakRemoteData from '../api/getK9Sak';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { K9Sak } from '../types/K9Sak';
import { Person } from '../types/Person';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { getEndringsdato, getEndringsperiode } from '../utils/endringsperiode';
import { relocateToLoginPage } from '../utils/navigationUtils';
import { dateToISODate } from '../utils/dateUtils';
import { K9FormatArbeidsgiver } from '../types/k9Format';

export type SoknadEssentials = [Person, K9Sak, Arbeidsgiver[], SoknadTempStorageData];

export type SoknadEssentialsRemoteData = RemoteData<AxiosError, SoknadEssentials>;

const getArbeidsgivereIkkeRegistrertiAaReg = (
    k9arbeidstakere: K9FormatArbeidsgiver[],
    arbeidsgivereAaReg: Arbeidsgiver[]
): K9FormatArbeidsgiver[] => {
    return k9arbeidstakere.filter(
        (k9a) => arbeidsgivereAaReg.find((a) => a.organisasjonsnummer === k9a.organisasjonsnummer) === undefined
    );
};

function useSoknadEssentials(): SoknadEssentialsRemoteData {
    const [data, setData] = useState<SoknadEssentialsRemoteData>(initial);
    const fetch = async () => {
        try {
            const [sokerResult, k9SakResult, soknadTempStorageResult] = await Promise.all([
                getSokerRemoteData(),
                getK9SakRemoteData(),
                getSoknadTempStorage(),
            ]);

            /** Hent arbeidsgivere fra aa-reg */
            const k9sak: K9Sak = (k9SakResult as any).value as any;
            const endringsperiode = getEndringsperiode(getEndringsdato(), k9sak.ytelse.søknadsperioder);
            const arbeidsgivereResult = await getArbeidsgivereRemoteData(
                dateToISODate(endringsperiode.from),
                dateToISODate(endringsperiode.to)
            );
            const aaArbeidsgivere: Arbeidsgiver[] = (arbeidsgivereResult as any).value;
            const arbeidstakereIkkeIAaReg = getArbeidsgivereIkkeRegistrertiAaReg(
                k9sak.ytelse.opptjeningAktivitet.arbeidstaker,
                aaArbeidsgivere
            );

            if (arbeidstakereIkkeIAaReg.length > 0) {
            }

            setData(combine(sokerResult, k9SakResult, arbeidsgivereResult, soknadTempStorageResult));
        } catch (remoteDataError) {
            if (isUnauthorized(remoteDataError.error)) {
                setData(pending);
                relocateToLoginPage();
            } else {
                console.error(remoteDataError);
                setData(remoteDataError);
            }
        }
    };
    useEffect(() => {
        fetch();
    }, []);
    return data;
}

export default useSoknadEssentials;
