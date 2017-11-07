import * as ko from "knockout";
import {KnockoutComponent} from "./knockOutComponent";
import {Handler} from "./handlers/Handler";

export class KnockoutInitializer {

    private knockoutComponents: Array<KnockoutComponent>;
    private knockoutHandlers: Array<Handler>;

    public constructor(
        knockoutComponents: Array<KnockoutComponent>,
        knockoutHandlers: Array<Handler>,
    ) {
        this.knockoutComponents = knockoutComponents;
        this.knockoutHandlers = knockoutHandlers;
    }

    public initialize() {

        for (let knockoutComponent of this.knockoutComponents) {
            ko.components.register(knockoutComponent.name, knockoutComponent);
        }

        for (let handler of this.knockoutHandlers) {
            ko.bindingHandlers[handler.name] = handler;
        }
    }
}
