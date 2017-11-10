/**
 * Abgeleitete Klasse von RoomLayout.ts fuer das Graeten-Layout:
 * 4 Tische, an die Wand gerückt, mit jeweils drei Rechnern
 * 1 Lehrer-Rechner
 * 1 Platz fuer mehr Geraete
 *
 * @author T.Niessen
 *
 */
import {RoomLayout} from '../room/RoomLayout';
import {IssueFormContainer} from '../../../common/IssueFormContainer';
import {UserActions} from '../../../UserActions';

export class RoomGroupsAngled extends RoomLayout {

    private static readonly COMPONENT_NAME = 'roomGroupsAngled';


    public constructor(commonIssues: any, issueFormContainer: IssueFormContainer, userActions: UserActions) {
        super(commonIssues, issueFormContainer, userActions, RoomGroupsAngled.COMPONENT_NAME);
    }

    public onRender(){
        console.log(RoomGroupsAngled.COMPONENT_NAME);
    }
}

