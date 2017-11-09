import {RoomLayout} from '../room/RoomLayout';
import {IssueFormContainer} from '../../../common/IssueFormContainer';
import {UserActions} from '../../../UserActions';

export class RoomCircular extends RoomLayout {

    private static readonly COMPONENT_NAME = 'roomCircular';


    public constructor(commonIssues: any, issueFormContainer: IssueFormContainer, userActions: UserActions) {
        super(commonIssues, issueFormContainer, userActions, RoomCircular.COMPONENT_NAME);
    }

}

