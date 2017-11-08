export class IssueFormContainer {

    private issueContainer = {};


    public addIssue(roomId: string, issue) {
        if (typeof this.issueContainer[roomId] !== 'undefined') {
            this.issueContainer[roomId].push(issue);
        } else {
            this.issueContainer[roomId] = [issue];
        }
    }

    public getRoomIssues(roomId) {

    }
}
