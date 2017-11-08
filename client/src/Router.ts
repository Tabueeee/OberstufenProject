import {isComponentName} from './knockout/config/Components';
import * as ko from 'knockout';
import {ComponentResolver} from './content/components/ComponentResolver';
import {PageRenderer} from './content/PageRenderer';
import {HistoryManager} from './common/HistoryManager';

export class Router {
    private pageRenderer: PageRenderer;
    private readonly INITIAL_PAGE = 'home';
    private componentResolver: ComponentResolver;

    public constructor(
        pageRenderer: PageRenderer,
        componentResolver: ComponentResolver
    ) {
        this.pageRenderer = pageRenderer;
        this.componentResolver = componentResolver;
    }

    public renderLayout() {
        ko.applyBindings({}, this.pageRenderer.getLayoutNode());
    }

    public renderPage(pageName: string): void {
        if (isComponentName(pageName) === false) {
            console.log(`route: "${pageName}" not found, redirecting to home page.`);
            pageName = this.INITIAL_PAGE;
        }

        // let controller = this.controllerResolver.getControllerByComponentName(pageName);
        let component = this.componentResolver.getComponentByModuleName(pageName);
        console.log(component);
        // controller.control(pageName, component);
        let node = this.pageRenderer.renderRootComponent(pageName, component);

        ko.applyBindings(component, node);
        component.onLoad();
    }
}
