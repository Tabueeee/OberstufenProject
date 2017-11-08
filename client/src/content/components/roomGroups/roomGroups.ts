import {Component} from '../Component';
import * as ko from 'knockout';
import {Observable} from 'knockout';
import {Issue} from '../../../common/Issue';
import {IssueFormContainer} from '../../../common/IssueFormContainer';


export class RoomGroups extends Component {
    private static readonly COMPONENT_NAME = 'roomGroups';
    public roomId: string;
    public title = ko.observable('');
    public description = ko.observable('');
    private commonIssueList;
    private templateSelector: HTMLElement;
    private issueFormContainer: IssueFormContainer;
    private issueDeviceId: Observable<number> = ko.observable(0);
    private issueRecipients = ko.observable('');

    public constructor(commonIssues: any, issueFormContainer: IssueFormContainer) {
        super(RoomGroups.COMPONENT_NAME);
        this.commonIssueList = commonIssues;
        this.issueFormContainer = issueFormContainer;
    }

    public updateViewModel(viewModel: any) {
    }

    public onRender() {
        console.log('rendering home');

    }

    public addIssue() {
        let issue = new Issue();
        issue.title = this.title.peek();
        issue.description = this.description.peek();
        // todo fixme
        issue.recipients = this.issueRecipients.peek().split(',');
        issue.deviceId = this.issueDeviceId.peek();

        console.log(issue);

        this.issueFormContainer.addIssue(issue);
    }

    public onLoad(roomId) {
        this.roomId = roomId;
    }

    public onInit() {
        console.log('init home');
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
