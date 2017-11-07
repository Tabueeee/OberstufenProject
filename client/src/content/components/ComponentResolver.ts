import {Component} from './Component';
import {Resolver} from '../../common/Resolver';

export class ComponentResolver extends Resolver<Component> {
    private componentList: Record<string, string>;

    public constructor(components: Array<Component>, componentClassMapping: Record<string, string>) {
        super(components);
        this.componentList = componentClassMapping;
    }

    public getComponent(classToResolve: string): Component {
        return super.getServiceByJobName(classToResolve);
    }

    public getComponentByModuleName(moduleName: string): Component {
        if (typeof this.componentList[moduleName] !== 'string') {
            throw new Error('Component not found: ' + moduleName);
        }

        let classToResolve = this.componentList[moduleName];
        return this.getComponent(classToResolve);
    }
}
