import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import { isUnauthorized } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { useFormikContext } from 'formik';
import { History } from 'history';
import { StepID } from '../soknad/soknadStepsConfig';
import soknadTempStorage, { UserHashInfo } from '../soknad/soknadTempStorage';
import { SoknadFormData } from '../types/SoknadFormData';
import { navigateToErrorPage, relocateToLoginPage } from '../utils/navigationUtils';
import { Feature, isFeatureEnabled } from '../utils/featureToggleUtils';

function usePersistSoknad(history: History) {
    const { logUserLoggedOut } = useAmplitudeInstance();
    const { values } = useFormikContext<SoknadFormData>() || {};

    async function doPersist(soknadId: string, stepID: StepID, hashInfo: UserHashInfo) {
        setTimeout(() => {
            soknadTempStorage.update(soknadId, values, stepID, hashInfo).catch((error) => {
                if (isUnauthorized(error)) {
                    logUserLoggedOut('Mellomlagring ved navigasjon');
                    relocateToLoginPage();
                } else {
                    return navigateToErrorPage(history);
                }
            });
        }, 500);
    }

    const persist = (soknadId: string, stepID: StepID, hashInfo: UserHashInfo) => {
        if (isFeatureEnabled(Feature.PERSISTENCE)) {
            doPersist(soknadId, stepID, hashInfo);
        }
    };

    return { persist };
}

export default usePersistSoknad;
