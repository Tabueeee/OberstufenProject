import {isComponentName} from './knockout/config/Components';
import * as ko from 'knockout';
import {ComponentResolver} from './content/components/ComponentResolver';
import {PageRenderer} from './content/PageRenderer';

export class Router {
    private static readonly layoutMap = {
        'groups': 'roomGroups',
        'circle': 'roomCircular',
        'angled': 'roomGroupsAngled'
    };
    private pageRenderer: PageRenderer;
    private readonly INITIAL_PAGE = 'home';
    private componentResolver: ComponentResolver;
    private rooms: Array<any>;

    public constructor(
        pageRenderer: PageRenderer,
        componentResolver: ComponentResolver,
        rooms: Array<any>
    ) {
        this.pageRenderer = pageRenderer;
        this.componentResolver = componentResolver;
        this.rooms = rooms;
    }

    public renderLayout() {
        let component = this.componentResolver.getComponentByModuleName('sidebar');
        ko.applyBindings(component, this.pageRenderer.getLayoutNode());
    }

    public renderPage(roomId: string): void {
        let componentName = this.getComponentNameByRoomId(roomId);

        let component = this.componentResolver.getComponentByModuleName(componentName);
        console.log(component);
        let node = this.pageRenderer.renderRootComponent(componentName, component);

        ko.applyBindings(component, node);
        component.onLoad(roomId);
    }

    private getComponentNameByRoomId(roomId) {
        let componentName = this.INITIAL_PAGE;

        let room = this.rooms.filter((room) => room.roomid === roomId)[0];

        if (typeof room !== 'undefined') {
            let name = Router.layoutMap[room.layout];
            if (isComponentName(name) !== false) {
                componentName = name;
            } else {
                console.log(`route: "${name}" not found, redirecting to home page.`);
            }
        }

        return componentName;
    }
}
