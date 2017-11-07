import Forge = require('forge-di');
import {Sidebar} from './components/sidebar/sidebar';
import {PageRenderer} from './PageRenderer';
import {Home} from './components/home/home';
import {ComponentResolver} from './components/ComponentResolver';

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
    }

    public registerComponents() {
        this.forge.bind('components').to.type(Home);
        this.forge.bind('components').to.type(Sidebar);
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
