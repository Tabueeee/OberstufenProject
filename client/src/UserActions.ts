import {Issue} from './common/Issue';
import {XhrPost} from './common/XhrPost';

export abstract class UserActions {
    private xhrPost: XhrPost;

    public constructor(xhrPost: XhrPost) {
        this.xhrPost = xhrPost;
    }

    public async sendIssuesToMailServer(issues: Array<Issue>) {
        return await this.xhrPost.postJsonToUrl('http://127.0.0.1:3000/sendMail', JSON.stringify(issues));
    }
}
