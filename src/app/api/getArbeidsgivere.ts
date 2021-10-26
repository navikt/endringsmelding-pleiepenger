import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
// import { ApiEndpointPsb } from '../types/ApiEndpoint';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
// import api from './api';

// type ArbeidsgiverRemoteType = {
//     organisasjoner: Arbeidsgiver[];
// };

export type ArbeidsgiverRemoteData = RemoteData<AxiosError, Arbeidsgiver[]>;

const getArbeidsgivereRemoteData = async (fom?: string, tom?: string): Promise<ArbeidsgiverRemoteData> => {
    console.log(fom, tom);

    try {
        // const { data } = await api.psb.get<ArbeidsgiverRemoteType>(
        //     ApiEndpointPsb.arbeidsgiver,
        //     `fra_og_med=${fom}&til_og_med=${tom}`
        // );
        return Promise.resolve(
            success([
                { navn: 'Johs broderi', organisasjonsnummer: '123451234' },
                { navn: 'Noras sveiseri', organisasjonsnummer: '112233445' },
                // { navn: 'Schübertsen', organisasjonsnummer: '412233445' },
            ])
        );
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getArbeidsgivereRemoteData;
