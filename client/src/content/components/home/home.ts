import {Component} from '../Component';


export class Home extends Component {
    private static readonly COMPONENT_NAME = 'home';

    public constructor() {
        super(Home.COMPONENT_NAME);
    }

    public updateViewModel(viewModel: any) {
    }
}
