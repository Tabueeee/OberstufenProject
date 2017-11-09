import {Component} from '../Component';
import * as ko from 'knockout';
import {Observable} from 'knockout';
import {Issue} from '../../../common/Issue';
import {IssueFormContainer} from '../../../common/IssueFormContainer';
import {UserActions} from '../../../UserActions';

export abstract class RoomLayout extends Component {
    public roomId: string;
    public title = ko.observable('');
    public description = ko.observable('');
    public issueList = ko.observableArray([]);
    public roomContact: string;
    public selectedCommonIssue = ko.observable('');
    public commonIssueNameList: Array<any> = ['Fehler Template'];
    private commonIssueList;
    private templateSelector: HTMLElement;
    private issueFormContainer: IssueFormContainer;
    private issueDeviceId: Observable<number> = ko.observable(0);
    private issueRecipients = ko.observable('');
    private userActions: UserActions;
    private issueCounter = 0;
    private room: any;

    public constructor(commonIssues: any, issueFormContainer: IssueFormContainer, userActions: UserActions, componentName) {
        super(componentName);
        this.commonIssueList = commonIssues;
        this.issueFormContainer = issueFormContainer;
        this.userActions = userActions;

        for (let commonIssue of commonIssues) {
            this.commonIssueNameList.push(commonIssue.title);
        }

        this.selectedCommonIssue.subscribe(function (newValue) {
            let selectedIssue = (this.commonIssueList.filter((commonIssue) => commonIssue.title === newValue[0]))[0];
            if (typeof selectedIssue !== 'undefined') {
                this.description(selectedIssue.description);
                this.issueRecipients(selectedIssue.additionalRecipients);
                this.title(selectedIssue.title);
            }
        }.bind(this));
    }

    public saveAsTemplate() {
        return () => {
            let newCommonIssue = {
                description: this.description.peek(),
                additionalRecipients: this.issueRecipients.peek(),
                title: this.title.peek()
            };

            this.userActions
                .sendNewCommonIssueToServer(newCommonIssue)
                .catch(function () {
                    console.error('unable to send new common issue to Server, please try again later');
                });
        };
    }

    public clearIssues() {
        return () => {

            let elements = document.getElementsByClassName('device');

            for (let index = 0; index < elements.length; index++) {
                let element = elements.item(index);
                element.className = element.className.replace('issue', '');
            }

            this.issueList([]);
        };
    }

    public sendIssues() {
        return () => {
            if (this.issueList.peek().length > 0) {
                this.userActions.sendIssuesToMailServer(this.issueList.peek())
                    .then(this.issueList([]))
                    .catch(function () {
                        console.error('unable to send Issues to Server, please try again later');
                    });
            } else {
                console.warn('no issues to send');
            }
        };
    }

    public deleteIssue(issueId) {
        return () => {
            let newIssueList = this.issueList.peek();

            for (let index = 0; index < newIssueList.length; index++) {
                let issue = newIssueList[index];
                if (issue.issueId === issueId) {
                    let deletedIssue = newIssueList.splice(index, 1);

                    this.removeDeviceIssueClassIfNoLongerInIssueList(deletedIssue[0].deviceId, newIssueList);

                    this.issueList(newIssueList);
                    break;
                }
            }
        };
    }

    public deviceHasIssues(deviceId) {
        return () => {

            for (let issue of this.issueList.peek()) {
                if (issue.deviceId === deviceId) {
                    return true;
                }
            }

            return false;
        };
    }

    public cancelIssue() {
        let modalElement = document.getElementById('modal');
        modalElement.className = modalElement.className.replace('active', 'disabled');

        this.resetFormFields();
    }

    public addIssue() {
        let modalElement = document.getElementById('modal');
        return () => {
            if (this.issueDeviceId.peek() !== 0) {
                let issue = new Issue();

                issue.title = this.title.peek();
                issue.description = this.description.peek();

                if (this.issueRecipients.peek().indexOf(',') > -1) {
                    issue.recipients = (this.issueRecipients.peek()).trim().split(',');
                } else {
                    issue.recipients = [this.issueRecipients.peek()];
                }

                issue.deviceId = this.issueDeviceId.peek();
                issue.issueId = this.issueCounter++;
                issue.roomId = this.roomId;
                let deviceElement = document.getElementById('device-' + issue.deviceId);

                deviceElement.className += ' issue';

                console.log(issue);
                this.issueList.push(issue);
                this.issueFormContainer.addIssue(issue);
                modalElement.className = modalElement.className.replace('active', 'disabled');
                this.resetFormFields();
            }
        };
    }

    public onLoad(room) {
        console.log(room.contact);
        this.roomId = room.roomId;
        this.roomContact = room.contact;
        this.room = room;
    }

    public deviceClick(device: string) {
        let modalElement = document.getElementById('modal');

        return () => {
            console.log('click' + device);
            modalElement.className = modalElement.className.replace('disabled', 'active');
            this.issueDeviceId(parseInt(device));
        };
    }

    private resetFormFields() {
        this.description('');
        this.issueRecipients('');
        this.title('');
        this.issueDeviceId(0);
    }

    private removeDeviceIssueClassIfNoLongerInIssueList(deviceId, issues) {
        let issuesWithCurrentDeviceId = issues.filter((issue) => issue.deviceId === deviceId);

        if (issuesWithCurrentDeviceId.length < 1) {
            let element = document.getElementById('device-' + deviceId);
            element.className = element.className.replace('issue', '');
        }
    }

}
