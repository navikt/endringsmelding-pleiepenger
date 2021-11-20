import React from 'react';
import { DateRange, Time } from '@navikt/sif-common-formik/lib';
import Modal from 'nav-frontend-modal';
import { DagMedTid } from '../../types/SoknadFormData';
import dateFormatter from '../../utils/dateFormatterUtils';
import ArbeidstidEnkeltdagForm, { ArbeidstidEnkeltdagEndring } from './ArbeidstidEnkeltdagForm';
import './arbeidstidEnkeltdag.less';

interface Props {
    dagMedTid?: DagMedTid;
    tidOpprinnelig: Time;
    arbeidsstedNavn: string;
    endringsperiode: DateRange;
    onSubmit: (evt: ArbeidstidEnkeltdagEndring) => void;
    onCancel: () => void;
}

const ArbeidstidEnkeltdagEdit: React.FunctionComponent<Props> = ({
    dagMedTid,
    tidOpprinnelig,
    arbeidsstedNavn,
    endringsperiode,
    onSubmit,
    onCancel,
}) => {
    const isOpen = dagMedTid !== undefined;
    return dagMedTid ? (
        <>
            <Modal
                isOpen={isOpen}
                contentLabel={`Arbeidstid ${dateFormatter.full(dagMedTid.dato)}`}
                onRequestClose={onCancel}
                shouldCloseOnOverlayClick={false}
                className="arbeidstidEnkeltdagDialog">
                <ArbeidstidEnkeltdagForm
                    endringsperiode={endringsperiode}
                    dagMedTid={dagMedTid}
                    tidOpprinnelig={tidOpprinnelig}
                    arbeidsstedNavn={arbeidsstedNavn}
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                />
            </Modal>
        </>
    ) : null;
};

export default ArbeidstidEnkeltdagEdit;
