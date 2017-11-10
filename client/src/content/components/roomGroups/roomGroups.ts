/**
 * Abgeleitete Klasse von RoomLayout.ts fuer das Gruppen-Layout:
 * 4 Tische mit jeweils drei Rechnern
 * 1 Lehrer-Rechner
 * 1 Platz fuer mehr Geraete
 *
 * @author T.Niessen
 *
 */
import {IssueFormContainer} from '../../../common/IssueFormContainer';
import {UserActions} from '../../../UserActions';
import {RoomLayout} from '../room/RoomLayout';


export class RoomGroups extends RoomLayout {

    private static readonly COMPONENT_NAME = 'roomGroups';


    public constructor(commonIssues: any, issueFormContainer: IssueFormContainer, userActions: UserActions) {
        super(commonIssues, issueFormContainer, userActions, RoomGroups.COMPONENT_NAME);
    }

    public onRender(){
        console.log(RoomGroups.COMPONENT_NAME);
    }
}
