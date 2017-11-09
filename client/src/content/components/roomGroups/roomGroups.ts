import {Component} from '../Component';
import * as ko from 'knockout';
import {Observable} from 'knockout';
import {Issue} from '../../../common/Issue';
import {IssueFormContainer} from '../../../common/IssueFormContainer';
import {UserActions} from '../../../UserActions';


export class RoomGroups extends Component {
    private static readonly COMPONENT_NAME = 'roomGroups';
    public roomId: string;
    public title = ko.observable('');
    public description = ko.observable('');
    public issueList = ko.observableArray([]);
    private commonIssueList;
    private templateSelector: HTMLElement;
    private issueFormContainer: IssueFormContainer;
    private issueDeviceId: Observable<number> = ko.observable(0);
    private issueRecipients = ko.observable('');
    private userActions: UserActions;
    private issueCounter = 0;
    private room: any;
    public roomContanct: string;

    public constructor(commonIssues: any, issueFormContainer: IssueFormContainer, userActions: UserActions) {
        super(RoomGroups.COMPONENT_NAME);
        this.commonIssueList = commonIssues;
        this.issueFormContainer = issueFormContainer;
        this.userActions = userActions;
    }

    public clearIssues() {
        return () => {
            this.issueList([]);
        };
    }

    public sendIssues() {
        return () => {
            if (this.issueList.peek().length > 0) {
                this.userActions.sendIssuesToMailServer(this.issueList.peek())
                    .then(this.issueList([]))
                    .catch(function () {
                        console.log('unable to send Issues to Server, please try again later');
                    });
            } else {
                console.log('no issues to send');
            }
        };
    }

    public addIssue() {
        return () => {
            if (this.issueDeviceId.peek() !== 0) {
                let issue = new Issue();
                issue.title = this.title.peek();
                issue.description = this.description.peek();
                // todo fixme
                console.log(this.issueRecipients.peek());
                issue.recipients = this.issueRecipients.peek().split(',');
                issue.deviceId = this.issueDeviceId.peek();
                issue.issueId = this.issueCounter++;
                issue.roomId = this.roomId;

                console.log(issue);
                this.issueList.push(issue);
                this.issueFormContainer.addIssue(issue);
            }
        };
    }

    public onLoad(room) {
        console.log(room.contact);
        this.roomId = room.roomId;
        this.roomContanct = room.contact;
        this.room = room;
    }

    public deviceClick(device: string) {
        // let templateSelector = document.getElementById('template-select');
        // console.log(templateSelector);
        // if (templateSelector instanceof HTMLElement) {
        //     this.templateSelector = templateSelector;
        //     templateSelector.onchange = function (event) {
        //         console.log('changed');
        //     };
        // }
        return () => {
            console.log('click' + device);
            this.issueDeviceId(parseInt(device));
        };
    }
}
