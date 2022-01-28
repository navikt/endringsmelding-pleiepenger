import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CheckmarkIcon from '@navikt/sif-common-core/lib/components/checkmark-icon/CheckmarkIcon';
import { Innholdstittel } from 'nav-frontend-typografi';
import './kvittering.less';

interface Props {
    tittel: React.ReactNode;
    children?: React.ReactNode;
}

const Kvittering = ({ tittel, children }: Props) => {
    return (
        <div className="kvittering">
            <Box textAlignCenter={true} margin="none">
                <CheckmarkIcon />
                <Box margin="l">
                    <Innholdstittel>{tittel}</Innholdstittel>
                </Box>
            </Box>
            {children && <Box margin="xl">{children}</Box>}
        </div>
    );
};

export default Kvittering;
