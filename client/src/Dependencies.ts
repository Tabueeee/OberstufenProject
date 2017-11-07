import Forge from 'forge-di';
import {ContentDependencies} from './content/ContentDependencies';
import {KnockoutDependencies} from './knockout/knockoutDependencies';
import {HistoryManager} from './common/HistoryManager';
import {ParamReader} from './common/ParamReader';


export class Dependencies {
    private forge: Forge;

    public constructor() {
        this.forge = new Forge();
        this.registerDOMElements();
        this.registerDependencies();
        new ContentDependencies(this.forge);
        new KnockoutDependencies(this.forge);
    }

    public get<T extends Object>(name: string): T {
        return this.forge.get(name);
    }

    private registerDependencies() {
        this.forge.bind('historyManager').to.type(HistoryManager);
        this.forge.bind('paramReader').to.type(ParamReader);
    }

    private registerDOMElements() {
        let node = window.document.getElementById('main');
        let sidebarNode = window.document.getElementById('sidebar');

        this.forge.bind('rootNode').to.instance(node);
        this.forge.bind('sidebarNode').to.instance(sidebarNode);
    }
}

