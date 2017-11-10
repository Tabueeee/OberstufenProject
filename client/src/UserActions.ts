import {Issue} from './common/Issue';
import {XhrPost} from './common/XhrPost';

export abstract class UserActions {
    private xhrPost: XhrPost;

    public constructor(xhrPost: XhrPost) {
        this.xhrPost = xhrPost;
    }

    public async sendNewCommonIssueToServer(commonIssue: any) {
        return await this.xhrPost.postJsonToUrl('http://127.0.0.1:3000/addCommonIssue', JSON.stringify(commonIssue));
    }

    public async sendIssuesToMailServer(issues: issueMessage) {
        return await this.xhrPost.postJsonToUrl('http://127.0.0.1:3000/sendMail', JSON.stringify(issues));
    }

    public async sendChangeRoomContactToMailServer(room: string, changeRoomContact: changeRoomContactBody) {
        return await this.xhrPost.postJsonToUrl('http://127.0.0.1:3000/changeRoomContact/' + room, JSON.stringify(changeRoomContact));
    }
}

interface changeRoomContactBody {
    contact: string;
    contactMail: string;
}


interface issueMessage {
    issues: Array<Issue>;
    addTeachersToMailList: boolean;
}
