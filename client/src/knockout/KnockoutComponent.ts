import {Component} from "../content/components/Component";

export class KnockoutComponent {

    public name: string;
    public template: string;
    public viewModel: { instance: Component }

    public constructor(template: string, component: Component) {
        this.name = component.name;
        this.template = template;
        this.viewModel = {instance: component};
    }
}
