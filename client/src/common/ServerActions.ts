import {XhrRequest} from './XhrRequest';

export class ServerActions {
    private xhrRequest: XhrRequest;

    public constructor(xhrRequest: XhrRequest) {
        this.xhrRequest = xhrRequest;
    }

    public async getCommonIssues(): Promise<any> {
        let commonIssues = [];
        try {
            let response = await this.xhrRequest.requestFromUrl('http://127.0.0.1:3000/commonIssues');
            commonIssues = JSON.parse(response);
        } catch (err) {
            console.error(err);
        }

        return commonIssues;
    }

    public async getRooms(): Promise<any> {
        let rooms = [];

        try {
            let response = await this.xhrRequest.requestFromUrl('http://127.0.0.1:3000/rooms');
            rooms = JSON.parse(response);
        } catch (err) {
            console.error(err);
        }

        return rooms;
    }

    public sendMail() {
        // todo implement
    }
}
