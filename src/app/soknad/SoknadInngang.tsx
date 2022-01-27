import React, { useState } from 'react';
import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import { uniqueId } from 'lodash';
import { SKJEMANAVN } from '../App';
import { HvaSkalEndres } from '../types';
import { Arbeidsgiver } from '../types/Arbeidsgiver';
import { Sak } from '../types/Sak';
import { SoknadFormData } from '../types/SoknadFormData';
import { SoknadTempStorageData } from '../types/SoknadTempStorageData';
import { Søker } from '../types/Søker';
import { getAvailableSteps } from '../utils/getAvailableSteps';
import { getInitialFormData } from '../utils/initialFormDataUtils';
import { getArbeidsgivereISak, getSakMedMetadata } from '../utils/sakUtils';
import InngangStep from './inngang-step/InngangStep';
import Soknad from './Soknad';
import { StepID } from './soknadStepsConfig';
import soknadTempStorage, { isStorageDataValid } from './soknadTempStorage';

interface Props {
    søker: Søker;
    saker: Sak[];
    arbeidsgivere: Arbeidsgiver[];
    tempStorageData?: SoknadTempStorageData;
}

interface SoknadInfo {
    sak: Sak;
    soknadId: string;
    hvaSkalEndres: HvaSkalEndres[];
    formData: Partial<SoknadFormData>;
    stepID: StepID;
}

const getSoknadInfoFraMellomlagring = (
    saker: Sak[],
    søker: Søker,
    soknadTempStorage?: SoknadTempStorageData
): SoknadInfo | undefined => {
    if (soknadTempStorage) {
        const sak = saker.find((s) => {
            return s.barn.aktørId === soknadTempStorage?.formData?.sakBarnAktørid;
        });
        const hvaSkalEndres = soknadTempStorage?.formData?.hvaSkalEndres;
        if (sak && hvaSkalEndres && isStorageDataValid(soknadTempStorage, { sak, søker })) {
            const formData = getInitialFormData(sak, søker, soknadTempStorage, hvaSkalEndres);
            return {
                sak,
                soknadId: soknadTempStorage.metadata.soknadId,
                hvaSkalEndres,
                formData,
                stepID: soknadTempStorage.metadata.lastStepID || getAvailableSteps(formData)[0],
            };
        }
    }
    return undefined;
};

const SoknadInngang: React.FunctionComponent<Props> = ({ saker, søker, tempStorageData, arbeidsgivere }) => {
    const [soknadInfo, setSoknadInfo] = useState<SoknadInfo>();

    const info = soknadInfo || getSoknadInfoFraMellomlagring(saker, søker, tempStorageData);
    const { logSoknadStartet } = useAmplitudeInstance();

    const handleOnStart = async (sak: Sak, hvaSkalEndres: HvaSkalEndres[]) => {
        await logSoknadStartet(SKJEMANAVN);
        const formData = getInitialFormData(sak, søker, undefined, hvaSkalEndres);
        const info: SoknadInfo = {
            sak,
            hvaSkalEndres,
            soknadId: uniqueId(),
            formData,
            stepID: getAvailableSteps(formData)[0],
        };
        await soknadTempStorage.create();
        await soknadTempStorage.update(info.soknadId, formData, info.stepID, {
            søker,
            sak,
        });
        setTimeout(() => {
            setSoknadInfo(info);
        });
    };

    return info ? (
        <Soknad
            søker={søker}
            arbeidsgivere={getArbeidsgivereISak(arbeidsgivere, info.sak)}
            sakMedMeta={getSakMedMetadata(info.sak)}
            soknadId={info.soknadId}
            formData={info.formData}
            stepID={info.stepID}
        />
    ) : (
        <InngangStep
            saker={saker}
            arbeidsgivere={arbeidsgivere}
            onStart={(sak: Sak, hvaSkalEndres: HvaSkalEndres[]) => handleOnStart(sak, hvaSkalEndres)}
        />
    );
};

export default SoknadInngang;
