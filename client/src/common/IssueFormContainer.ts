import {Issue} from './Issue';

export class IssueFormContainer {

    private issueContainer = [];


    public addIssue(issue: Issue) {
        this.issueContainer.push(issue);
    }

}
