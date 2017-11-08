import {Component} from '../Component';


export const commonIssues = [
    {
        description: 'Maus fehlt'
    },
    {
        description: 'Maus fehlt'
    },
    {
        description: 'Maus fehlt'
    },
    {
        description: 'Maus fehlt'
    }
];

export class Home extends Component {
    private static readonly COMPONENT_NAME = 'home';

    private a: number = 0;
    private commonIssueList = commonIssues;
    private templateSelector: HTMLElement;

    public constructor() {
        super(Home.COMPONENT_NAME);


    }

    public updateViewModel(viewModel: any) {
    }

    public onRender() {
        console.log('rendering home');

    }

    public onLoad() {
        console.log('home loaded');
        let elem = document.getElementById('template-select');
        let b = elem instanceof HTMLElement;
        console.log(b);
    }

    public onInit() {
        console.log('init home');
    }

    public deviceClick(device: string) {
        // let templateSelector = document.getElementById('template-select');
        // console.log(templateSelector);
        // if (templateSelector instanceof HTMLElement) {
        //     this.templateSelector = templateSelector;
        //     templateSelector.onchange = function (event) {
        //         console.log('changed');
        //     };
        // }
        return () => {
            console.log('click' + device);
        };
    }
}
