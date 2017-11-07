import {StylesSupplier} from "./config/Styles";
import {TemplateSupplier} from "./config/Templates";
import {Component} from "../content/components/Component";
import {KnockoutComponent} from "./KnockoutComponent";

export class knockoutComponentFactory {

    private stylesSupplier: StylesSupplier;
    private templateSupplier: TemplateSupplier;
    private components: Array<Component>;

    public constructor(
        templateSupplier: TemplateSupplier,
        stylesSupplier: StylesSupplier,
        components: Array<Component>
    ) {
        this.templateSupplier = templateSupplier;
        this.stylesSupplier = stylesSupplier;
        this.components = components;
    }

    public createKnockoutComponents(): Array<KnockoutComponent> {
        let knockoutComponents: Array<KnockoutComponent> = [];

        for (let component of this.components) {
            knockoutComponents.push(this.createKnockoutComponent(component));
        }

        return knockoutComponents;
    }

    public createKnockoutComponent(component: Component): KnockoutComponent {
        let componentName = this.getComponentName(component);
        let template = '<style>' + this.stylesSupplier.getStyles(componentName) + '</style>' + this.templateSupplier.getTemplate(componentName);

        return new KnockoutComponent(template, component);
    }

    private getComponentName(component: Component): string {
        if (typeof component.name === 'undefined') {
            throw new Error('Component name is missing.');
        }

        return component.name;
    }
}
