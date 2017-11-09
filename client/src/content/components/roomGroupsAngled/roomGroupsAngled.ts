import {RoomLayout} from '../room/RoomLayout';
import {IssueFormContainer} from '../../../common/IssueFormContainer';
import {UserActions} from '../../../UserActions';

export class RoomGroupsAngled extends RoomLayout {

    private static readonly COMPONENT_NAME = 'roomGroupsAngled';


    public constructor(commonIssues: any, issueFormContainer: IssueFormContainer, userActions: UserActions) {
        super(commonIssues, issueFormContainer, userActions, RoomGroupsAngled.COMPONENT_NAME);
    }

}

