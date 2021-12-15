import React from 'react';
import { InputTime } from '@navikt/sif-common-formik/lib';
import Modal from 'nav-frontend-modal';
import { DagMedTid } from '../../types/SoknadFormData';
import dateFormatter from '../../utils/dateFormatterUtils';
import OmsorgstilbudEnkeltdagForm from './OmsorgstilbudEnkeltdagForm';
import './omsorgstilbudEnkeltdagEdit.less';

interface Props {
    dagMedTid?: DagMedTid;
    tidOpprinnelig: InputTime;
    onSubmit: (dagMedTid: DagMedTid) => void;
    onCancel: () => void;
}

const OmsorgstilbudEnkeltdagEdit: React.FunctionComponent<Props> = ({
    dagMedTid,
    tidOpprinnelig,
    onSubmit,
    onCancel,
}) => {
    const isOpen = dagMedTid !== undefined;
    return dagMedTid ? (
        <>
            <Modal
                isOpen={isOpen}
                contentLabel={`Omsorgstilbud ${dateFormatter.full(dagMedTid.dato)}`}
                onRequestClose={onCancel}
                shouldCloseOnOverlayClick={false}
                className="omsorgstilbudEnkeltdagDialog">
                <OmsorgstilbudEnkeltdagForm
                    dagMedTid={dagMedTid}
                    tidOpprinnelig={tidOpprinnelig}
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                />
            </Modal>
        </>
    ) : null;
};

export default OmsorgstilbudEnkeltdagEdit;
