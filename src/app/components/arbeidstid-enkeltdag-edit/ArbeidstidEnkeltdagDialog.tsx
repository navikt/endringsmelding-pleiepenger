import React from 'react';
import Modal from 'nav-frontend-modal';
import { DagMedTid } from '../../types/SoknadFormData';
import ArbeidstidEnkeltdagForm from './ArbeidstidEnkeltdagForm';
import './arbeidstidEnkeltdagEdit.less';
import { Time } from '@navikt/sif-common-formik/lib';

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
                contentLabel="Timer"
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
