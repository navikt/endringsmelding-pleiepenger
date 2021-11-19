import React from 'react';
import Modal from 'nav-frontend-modal';
import ArbeidstidPeriodeForm, { ArbeidstidPeriodeData } from './ArbeidstidPeriodeForm';
import { Normaltekst } from 'nav-frontend-typografi';
import './arbeidstidPeriode.less';
import { DateRange } from '@navikt/sif-common-formik/lib';

interface Props {
    isOpen: boolean;
    arbeidsstedNavn: string;
    endringsperiode: DateRange;
    onSubmit: (arbeidstidPeriode: ArbeidstidPeriodeData) => void;
    onCancel: () => void;
}

const ArbeidstidPeriodeDialog: React.FunctionComponent<Props> = ({
    arbeidsstedNavn,
    endringsperiode,
    isOpen,
    onSubmit,
    onCancel,
}) => {
    return isOpen ? (
        <Modal
            isOpen={isOpen}
            contentLabel={`Endre arbeidstid for flere dager`}
            onRequestClose={onCancel}
            shouldCloseOnOverlayClick={false}
            className="arbeidstidPeriodeDialog">
            <Normaltekst tag="div">
                <ArbeidstidPeriodeForm
                    arbeidsstedNavn={arbeidsstedNavn}
                    endringsperiode={endringsperiode}
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                />
            </Normaltekst>
        </Modal>
    ) : null;
};

export default ArbeidstidPeriodeDialog;
