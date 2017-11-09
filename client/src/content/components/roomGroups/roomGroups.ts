import {IssueFormContainer} from '../../../common/IssueFormContainer';
import {UserActions} from '../../../UserActions';
import {RoomLayout} from '../room/RoomLayout';


export class RoomGroups extends RoomLayout {

    private static readonly COMPONENT_NAME = 'roomGroups';


    public constructor(commonIssues: any, issueFormContainer: IssueFormContainer, userActions: UserActions) {
        super(commonIssues, issueFormContainer, userActions, RoomGroups.COMPONENT_NAME);
    }

}
