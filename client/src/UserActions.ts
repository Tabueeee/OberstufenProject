import {Router} from './Router';

export abstract class UserActions {
    private router: Router;

    public constructor(router: Router) {
        this.router = router;
    }

    public changePage(moduleName: string) {
        this.router.renderPage(moduleName);
    }
}
