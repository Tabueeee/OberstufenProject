import {Sidebar} from './components/sidebar/sidebar';
import {PageRenderer} from './PageRenderer';
import {Home} from './components/home/home';
import {ComponentResolver} from './components/ComponentResolver';
import Forge = require("forge-di");
import {RoomGroups} from './components/roomGroups/roomGroups';
import {RoomGroupsAngled} from './components/roomGroupsAngled/roomGroupsAngled';
import {RoomCircular} from './components/roomCircular/roomCircular';
import {IssueFormContainer} from '../common/IssueFormContainer';

export class ContentDependencies {
    private forge: Forge;

    public constructor(forge: Forge) {
        this.forge = forge;
        this.registerComponents();
        // this.registerControllers();
        this.registerOther();
    }

    public registerOther() {
        // this.forge.bind('viewModelUpdater').to.type(ViewModelUpdater);
        this.forge.bind('pageRenderer').to.type(PageRenderer);
        this.forge.bind('issueFormContainer').to.type(IssueFormContainer);
    }

    public registerComponents() {
        this.forge.bind('components').to.type(Home);
        this.forge.bind('components').to.type(Sidebar);
        this.forge.bind('components').to.type(RoomGroups);
        this.forge.bind('components').to.type(RoomGroupsAngled);
        this.forge.bind('components').to.type(RoomCircular);
        this.forge.bind('componentResolver').to.type(ComponentResolver);
    }

    public registerControllers() {
        // this.forge.bind('componentControllerMapping').to.instance(componentControllerMapping);
        // this.forge.bind('controllers').to.type(SidebarController);
        // this.forge.bind('controllers').to.type(SingleComponentController);
        // this.forge.bind('controllers').to.type(HomeController);
        // this.forge.bind('controllerResolver').to.type(ControllerResolver);
    }
}
