import { getTypedFormComponents } from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { SoknadFormData, SoknadFormField } from '../types/SoknadFormData';

const SoknadFormComponents = getTypedFormComponents<SoknadFormField, SoknadFormData, ValidationError>();

export default SoknadFormComponents;
