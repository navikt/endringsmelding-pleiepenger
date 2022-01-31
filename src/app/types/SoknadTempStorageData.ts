import { StepID } from '../soknad/soknadStepsConfig';
import { SoknadFormData } from './SoknadFormData';

export interface SoknadTempStorageData {
    metadata: {
        soknadId: string;
        lastStepID: StepID;
        version: string;
        userHash: string;
        updatedTimestemp: string;
    };
    formData: SoknadFormData;
}
