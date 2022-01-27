import React from 'react';
import { Element } from 'nav-frontend-typografi';
import './kvitteringPunktListe.less';

interface Props {
    tittel: string;
    punkter: React.ReactNode[];
}

const KvitteringPunktListe: React.FunctionComponent<Props> = ({ tittel, punkter }) => {
    return (
        <>
            <Element tag="h2">{tittel}</Element>
            <ul className="kvitteringPunktListe">
                {punkter.map((p, idx) => (
                    <li key={idx}>{p}</li>
                ))}
            </ul>
        </>
    );
};

export default KvitteringPunktListe;
