/**
 * Uebergeordnete Klasse fuer die einzelnen Layouts
 * Beschreibt die Hauptfunktionen der Layouts und ihrer Komponenten
 *
 * @author T.Niessen, M.Henker
 *
 */
import {Component} from '../Component';
import * as ko from 'knockout';
import {Observable} from 'knockout';
import {Issue} from '../../../common/Issue';
import {IssueFormContainer} from '../../../common/IssueFormContainer';
import {UserActions} from '../../../UserActions';

export abstract class RoomLayout extends Component {
    private static DESCRIPTION_INVALID = 'Bitte geben Sie eine Beschreibung zum aufgetretenen Fehler an.';
    private static WORKSHOP_MAIL = 'pc-werkstatt@gso-koeln.de';
    public roomId: string;
    public title = ko.observable('');
    public description = ko.observable('');
    public issueList = ko.observableArray([]);
    public selectedCommonIssue = ko.observable('');
    public commonIssueNameList: Array<any> = ['Fehler ausw\u00e4hlen'];
    public showError: Observable<boolean> = ko.observable(false);
    public error: Observable<string> = ko.observable('');
    public showChangeContact = ko.observable(false);
    public roomContact: Observable<string> = ko.observable('');
    public roomContactMailInput: Observable<string> = ko.observable('');
    public roomContactInput: Observable<string> = ko.observable('');
    private commonIssueList;
    private issueFormContainer: IssueFormContainer;
    private issueDeviceId: Observable<number> = ko.observable(0);
    private issueRecipients = ko.observable('');
    private userActions: UserActions;
    private issueCounter = 0;
    private room: any;
    private roomContactMail: Observable<string> = ko.observable('');
    private addTeachersToMail: Observable<boolean> = ko.observable(false);
    private addWorkshopToMail: Observable<boolean> = ko.observable(false);

    /**
     * Einstiegspunkt der Klasse
     *
     * @param commonIssues
     * @param issueFormContainer
     * @param userActions
     * @param componentName
     */
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

    public setChangeContact(state: boolean) {
        return () => {
            this.showChangeContact(state);
        };
    }

    /**
     * Wird aufgerufen, wenn der Speichern-Button unter der Fehlerbeschreibung angeklickt wird.
     *
     * Speichert ein neu geschriebenes Fehlerprotokoll ab.
     * Der Titel und die Beschreibung des Protokolls tauchen beim naechsten Aufruf
     * in der Liste der Standardfehler auf.
     *
     * @returns {function(): undefined}
     */
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

    /**
     * Wird aufgerufen, wenn der Button ueber der Liste der aufgenommenen Fehlerprotokolle angeklickt wird.
     *
     * Loescht alle Eintraege aus der Liste und faerbt alle Geraete wieder gruen.
     *
     * @returns {function(): undefined}
     */
    public clearIssues() {
        return () => {

            let elements = document.getElementsByClassName('device');

            for (let index = 0; index < elements.length; index++) {
                let element = elements.item(index);
                element.classList.remove('issue');
            }

            this.issueList([]);
        };
    }

    /**
     * Wird aufgerufen, wenn der Button zum Absenden der Fehlerprotokolle angeklickt wird.
     *
     * Loest das Versenden der E-Mails mit Fehlerprotokollen an die jeweiligen Empfaenger aus.
     *
     * @returns {function(): undefined}
     */
    public sendIssues() {
        return () => {
            if (this.issueList.peek().length > 0) {
                this.userActions.sendIssuesToMailServer({
                                                            addTeachersToMailList: this.addTeachersToMail.peek(),
                                                            issues: this.issueList.peek()
                                                        }
                )
                    .then(this.issueList([]))
                    .catch(function () {
                        console.error('unable to send Issues to Server, please try again later');
                    });
            } else {
                console.warn('no issues to send');
            }
        };
    }

    public changeContact() {
        return () => {
            this.showChangeContact(false);
            this.roomContact(this.roomContactInput.peek());
            this.roomContactMail(this.roomContactMailInput.peek());

            this.userActions.sendChangeRoomContactToMailServer(
                this.roomId,
                {
                    contact: this.roomContactInput.peek(),
                    contactMail: this.roomContactMailInput.peek()
                }
            )
                .catch(function (error) {
                    console.error(error);
                });
        };
    }


    /**
     * Wird aufgerufen, wenn der Button neben einem Protokolleintrag in der Liste angeklickt wird.
     *
     * Loescht den betroffenen Eintrag aus der Liste und faerbt das jeweilige Geraet wieder gruen.
     *
     * @param issueId
     * @returns {function(): undefined}
     */
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

    /**
     * Prueft, ob zu dem betroffenen Geraet bereits ein Fehler aufgenommen wurde.
     *
     * @param deviceId
     * @returns {function(): (boolean|boolean)}
     */
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

    /**
     * Wird aufgerufen, wenn der "Abbrechen"-Button in der Modal-Box angeklickt wurde.
     *
     * Bricht die Aufnahme des Fehlerprotokolls ab und schließt die Modal-Box.
     *
     */
    public cancelIssue() {
        let modalElement = document.getElementById('modal');
        modalElement.className = modalElement.className.replace('active', 'disabled');

        this.resetFormFields();
    }

    /**
     * Wird aufgerufen, wenn der "Protokoll aufnehmen"-Button in der Modal-Box angeklickt wurde.
     *
     * Prueft, ob die eingegebenen Daten korrekt sind, fuegt das Fehlerprotokoll zur Liste hinzu und faerbt das Geraet rot ein.
     * Falls die Daten ungueltig sind, wird stattdessen eine Fehlermeldung eingeblendet, die das Problem beschreibt.
     *
     * @returns {function(): undefined}
     */
    public addIssue() {
        let modalElement = document.getElementById('modal');
        return () => {
            if (this.issueDeviceId.peek() !== 0) {

                if (this.description.peek() === '' || this.description.peek().length > 500) {
                    this.showError(true);
                    this.error(RoomLayout.DESCRIPTION_INVALID);
                } else {
                    this.showError(false);
                    this.error('');

                    let issue = new Issue();

                    issue.title = this.title.peek();
                    issue.description = this.description.peek();
                    let recipients = this.issueRecipients.peek();

                    if (this.addWorkshopToMail.peek() === true) {
                        recipients += RoomLayout.WORKSHOP_MAIL;
                    }


                    if (this.issueRecipients.peek().indexOf(',') > -1) {
                        issue.recipients = recipients.trim().split(',');
                    } else {
                        issue.recipients = [recipients];
                    }

                    issue.deviceId = this.issueDeviceId.peek();
                    issue.issueId = this.issueCounter++;
                    issue.roomId = this.roomId;
                    let deviceElement = document.getElementById('device-' + issue.deviceId);

                    deviceElement.classList.add('issue');

                    this.issueList.push(issue);
                    this.issueFormContainer.addIssue(issue);
                    modalElement.className = modalElement.className.replace('active', 'disabled');
                    this.resetFormFields();
                }
            }
        };
    }

    /**
     * Stellt beim Laden der Seite Variablen mit Informationen zum aktuellen Raum bereit.
     *
     * @param room
     */
    public onLoad(room) {
        this.roomId = room.roomId;
        this.roomContact(room.contact);
        this.roomContactInput(room.contact);
        this.roomContactMail(room.contactMail);
        this.roomContactMailInput(room.contactMail);
        this.room = room;
    }

    /**
     * Wird aufgerufen, wann immer ein Geraet im Layout ausgewaehlt wird.
     *
     * Oeffnet die Modal-Box mit der Aufforderung ein neues Fehlerprotokoll fur dieses Geraet aufzunehmen.
     *
     * @param device
     * @returns {function(): undefined}
     */
    public deviceClick(device: string) {
        let modalElement = document.getElementById('modal');

        return () => {
            console.log('click' + device);
            modalElement.className = modalElement.className.replace('disabled', 'active');
            this.issueDeviceId(parseInt(device));
        };
    }

    /**
     * Schließt das Fenster der Fehlermeldung.
     *
     * @returns {function(): undefined}
     */
    public hideToast() {
        return () => {

            this.showError(false);
            this.error('');
        };
    }

    /**
     * Setzt die Formularfelder innerhalb der Modal-Box zurueck.
     *
     */
    private resetFormFields() {
        this.description('');
        this.issueRecipients('');
        this.title('');
        this.addTeachersToMail(false);
        this.addWorkshopToMail(false);
        this.issueDeviceId(0);
    }

    /**
     * Prueft, ob noch ein Fehlerprotokoll fuer angegebenes Geraet in der Liste steht.
     * Falls nicht, wird das Geraet im Layout wieder gruen eingefaerbt.
     *
     * @param deviceId
     * @param issues
     */
    private removeDeviceIssueClassIfNoLongerInIssueList(deviceId, issues) {
        let issuesWithCurrentDeviceId = issues.filter((issue) => issue.deviceId === deviceId);

        if (issuesWithCurrentDeviceId.length < 1) {
            let element = document.getElementById('device-' + deviceId);
            element.classList.remove('issue');
        }
    }

}
