/**
 * Abgeleitete Klasse von RoomLayout.ts fuer das Kreis-Layout:
 * Zusammenhaengender Tisch in C-Form mit jeweils drei Rechnern in jeder Ecke der Klasse
 * 1 Lehrer-Rechner
 * 1 Platz fuer mehr Geraete
 *
 * @author T.Niessen
 *
 */
import {RoomLayout} from '../room/RoomLayout';
import {IssueFormContainer} from '../../../common/IssueFormContainer';
import {UserActions} from '../../../UserActions';

export class RoomCircular extends RoomLayout {

    private static readonly COMPONENT_NAME = 'roomCircular';


    public constructor(commonIssues: any, issueFormContainer: IssueFormContainer, userActions: UserActions) {
        super(commonIssues, issueFormContainer, userActions, RoomCircular.COMPONENT_NAME);
    }

    public onRender(){
        console.log(RoomCircular.COMPONENT_NAME);
    }

}

