import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import { AxiosError } from 'axios';
// import { ApiEndpointPsb } from '../types/ApiEndpoint';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { ISODateToDate } from '../utils/dateUtils';
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
        const mockResult: Arbeidsgiver[] = [
            // { organisasjonsnummer: '907670202', navn: 'NYE KLONELABBEN', ansattFom: ISODateToDate('2021-10-01') },
            {
                organisasjonsnummer: '967170232',
                navn: 'Bakeriet smått og godt',
                ansattFom: ISODateToDate('2008-10-01'),
            },
        ];
        return Promise.resolve(success(mockResult));
    } catch (error) {
        return Promise.reject(failure(error));
    }
};

export default getArbeidsgivereRemoteData;
