import {Component} from './components/Component';

export class PageRenderer {
    private rootNode: HTMLElement;
    private sidebarNode: HTMLElement;

    public constructor(rootNode: HTMLElement, sidebarNode: HTMLElement) {
        this.rootNode = rootNode;
        this.sidebarNode = sidebarNode;
    }

    public getLayoutNode() {
        return this.sidebarNode;
    }

    public renderRootComponent(moduleName: string, component: Component): any {
        this.rootNode.innerHTML = `<div><div id="${moduleName}" data-bind='component: "${moduleName}"'></div></div>`;
        let node = this.rootNode.children[0];
        component.onRender();

        return node;
    }
}
