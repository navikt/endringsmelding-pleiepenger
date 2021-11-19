import React from 'react';
import { Time } from '@navikt/sif-common-formik/lib';
import Modal from 'nav-frontend-modal';
import { DagMedTid } from '../../types/SoknadFormData';
import dateFormatter from '../../utils/dateFormatterUtils';
import ArbeidstidEnkeltdagForm from './ArbeidstidEnkeltdagForm';
import './arbeidstidEnkeltdag.less';

interface Props {
    dagMedTid?: DagMedTid;
    tidOpprinnelig: Time;
    arbeidsstedNavn: string;
    onSubmit: (dagMedTid: DagMedTid) => void;
    onCancel: () => void;
}

const ArbeidstidEnkeltdagEdit: React.FunctionComponent<Props> = ({
    dagMedTid,
    tidOpprinnelig,
    arbeidsstedNavn,
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
