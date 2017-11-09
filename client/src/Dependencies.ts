import {ContentDependencies} from './content/ContentDependencies';
import {KnockoutDependencies} from './knockout/knockoutDependencies';
import {ParamReader} from './common/ParamReader';
import {Application} from './Application';
import {UserActions} from './UserActions';
import {Router} from './Router';
import {ServerActions} from './common/ServerActions';
import {XhrRequest} from './common/XhrRequest';
import Forge = require('forge-di');
import {XhrPost} from './common/XhrPost';

export class Dependencies {
    private forge: Forge;

    public constructor() {
        this.forge = new Forge();

    }

    public get<T extends Object>(name: string): T {
        return this.forge.get(name);
    }

    public async registerDependencies() {
        this.forge.bind('name').to.instance('');
        this.forge.bind('application').to.type(Application);
        this.registerDOMElements();
        this.registerAppDependencies();
        await this.registerServerData();
        new ContentDependencies(this.forge);
        new KnockoutDependencies(this.forge);

        return this;
    }

    private async registerServerData() {
        let serverActions = this.forge.get<ServerActions>('serverActions');
        let rooms = await serverActions.getRooms();
        let commonIssues = await serverActions.getCommonIssues();

        this.forge.bind('rooms').to.instance(rooms);
        this.forge.bind('commonIssues').to.instance(commonIssues);
    }

    private registerAppDependencies() {
        this.forge.bind('paramReader').to.type(ParamReader);
        this.forge.bind('userActions').to.type(UserActions);
        this.forge.bind('router').to.type(Router);
        this.forge.bind('xhrRequest').to.type(XhrRequest);
        this.forge.bind('xhrPost').to.type(XhrPost);
        this.forge.bind('serverActions').to.type(ServerActions);
    }

    private registerDOMElements() {
        let node = window.document.getElementById('main');
        let sidebarNode = window.document.getElementById('sidebar');

        this.forge.bind('rootNode').to.instance(node);
        this.forge.bind('sidebarNode').to.instance(sidebarNode);
    }
}

