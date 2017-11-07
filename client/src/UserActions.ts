import {Router} from './Router';
import {ComponentName} from './knockout/config/Components';

export abstract class UserActions {
    private router: Router;

    public constructor(router: Router) {
        this.router = router;
    }

    public changePage(moduleName: ComponentName, roomName?: string) {


        this.router.renderPage(moduleName);
    }
}
