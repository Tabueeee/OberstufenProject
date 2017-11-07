import Forge = require("forge-di");
import {LinkHandler} from "./handlers/Link";
import {StylesSupplier} from "./config/Styles";
import {TemplateSupplier} from "./config/Templates";
import {knockoutComponentFactory} from "./KnockoutComponentFactory";
import {componentClassMapping} from "./config/Components";
import {KnockoutInitializer} from "./KnockoutInitializer";

export class KnockoutDependencies {
    private forge: Forge;

    public constructor(forge: Forge) {
        this.forge = forge;
        this.registerKnockoutServices();
        this.registerKnockoutModules();
        this.forge.bind('componentClassMapping').to.instance(componentClassMapping);
        this.forge.bind('knockoutInitializer').to.type(KnockoutInitializer);
    }

    public registerKnockoutServices() {
        this.forge.bind('knockoutHandlers').to.type(LinkHandler);
    }

    public registerKnockoutModules() {
        this.forge.bind('knockoutHandlers').to.type(LinkHandler);
        this.forge.bind('stylesSupplier').to.type(StylesSupplier);
        this.forge.bind('templateSupplier').to.type(TemplateSupplier);
        this.forge.bind('componentSetup').to.type(knockoutComponentFactory);

        let componentSetup: knockoutComponentFactory = this.forge.get<knockoutComponentFactory>('componentSetup');
        this.forge.bind('knockoutComponents').to.function(componentSetup.createKnockoutComponents.bind(componentSetup));
    }
}
