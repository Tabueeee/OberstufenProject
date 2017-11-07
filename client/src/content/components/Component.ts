export abstract class Component {
    public name: string;
    protected update: () => void;

    public constructor(name: string) {
        this.name = name;
    }

    public setUpdate() {

    }

    public abstract updateViewModel(viewModel: any);

    public onRender() {

    }

    public onInit() {
    }
}
