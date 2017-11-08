import {KnockoutInitializer} from './knockout/KnockoutInitializer';
import {ParamReader} from './common/ParamReader';
import {Router} from './Router';
import {ServerActions} from './common/ServerActions';

export class Application {

    private paramReader: ParamReader;
    private knockoutInitializer: KnockoutInitializer;
    private router: Router;
    private serverActions: ServerActions;

    public constructor(
        knockoutInitializer: KnockoutInitializer,
        paramReader: ParamReader,
        router: Router,
        serverActions: ServerActions
    ) {
        this.knockoutInitializer = knockoutInitializer;
        this.paramReader = paramReader;
        this.router = router;
        this.serverActions = serverActions;
    }

    public async run() {
        let roomId = this.paramReader.getQueryVariable('roomId');

        this.knockoutInitializer.initialize();
        this.router.renderLayout();

        this.router.renderPage(roomId);
    }
}
