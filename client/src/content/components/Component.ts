export abstract class Component {
    public name: string;
    protected update: () => void;

    public constructor(name: string) {
        this.name = name;
    }

    public setUpdate() {

    }

    public onRender() {

    }

    public onLoad(room?: any) {

    }

    public onInit() {
    }
}
