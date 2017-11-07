import {KnockoutInitializer} from './knockout/KnockoutInitializer';
import {ParamReader} from './common/ParamReader';
import {Router} from './Router';

export class Application {

    private paramReader: ParamReader;
    private knockoutInitializer: KnockoutInitializer;
    private router: Router;

    public constructor(
        knockoutInitializer: KnockoutInitializer,
        paramReader: ParamReader,
        router: Router
    ) {
        this.knockoutInitializer = knockoutInitializer;
        this.paramReader = paramReader;
        this.router = router;
    }

    public run(): void {
        let requestedPage = this.paramReader.getQueryVariable('page');
        this.knockoutInitializer.initialize();
        this.router.renderLayout();
        this.router.renderPage(requestedPage);
    }
}
