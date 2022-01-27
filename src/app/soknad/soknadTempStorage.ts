import persistence, { PersistenceInterface } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import { AxiosResponse } from 'axios';
import hash from 'object-hash';
import { axiosConfigPsb } from '../api/api';
import { ApiEndpointPsb } from '../api/endpoints';
import { Sak } from '../types/Sak';
import { SoknadFormData } from '../types/SoknadFormData';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { Søker } from '../types/Søker';
import { StepID } from './soknadStepsConfig';

export const STORAGE_VERSION = '1.0';

export interface UserHashInfo {
    søker: Søker;
    sak: Sak;
}

interface SoknadTemporaryStorage extends Omit<PersistenceInterface<SoknadTempStorageData>, 'update'> {
    update: (
        soknadId: string,
        formData: Partial<SoknadFormData>,
        lastStepID: StepID,
        søkerInfo: UserHashInfo
    ) => Promise<AxiosResponse>;
}

const persistSetup = persistence<SoknadTempStorageData>({
    url: ApiEndpointPsb.mellomlagring,
    requestConfig: { ...axiosConfigPsb },
});

export const isStorageDataValid = (data: SoknadTempStorageData, userHashInfo: UserHashInfo): boolean => {
    if (
        data?.metadata?.version === STORAGE_VERSION &&
        data?.metadata.lastStepID !== undefined &&
        data.formData !== undefined &&
        data.metadata.soknadId !== undefined
    ) {
        if (JSON.stringify(data.formData) === JSON.stringify({})) {
            return false;
        }
        if (hash(userHashInfo) !== data.metadata.userHash) {
            return false;
        }
        return true;
    }
    return false;
};

const soknadTempStorage: SoknadTemporaryStorage = {
    create: () => {
        return persistSetup.create();
    },
    update: (soknadId: string, formData: SoknadFormData, lastStepID: StepID, userHashInfo: UserHashInfo) => {
        return persistSetup.update({
            formData,
            metadata: { soknadId, lastStepID, version: STORAGE_VERSION, userHash: hash(userHashInfo) },
        });
    },
    purge: persistSetup.purge,
    rehydrate: persistSetup.rehydrate,
};

export default soknadTempStorage;
