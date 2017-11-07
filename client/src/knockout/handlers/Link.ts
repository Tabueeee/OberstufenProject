import * as ko from 'knockout';
import {AllBindingsAccessor, BindingContext} from 'knockout';
import {Handler} from './Handler';
import {UserActions} from '../../UserActions';

export class LinkHandler implements Handler {

    public name: string;
    private userActions: UserActions;

    public constructor(userActions: UserActions) {
        this.userActions = userActions;
        this.name = 'link';
        this.init = this.init.bind(this);
    }

    public init(element: any, valueAccessor: () => any, allBindingsAccessor: AllBindingsAccessor, viewModel: any, bindingContext: BindingContext<any>) {
        let accessor: () => any = this.customAccessor(valueAccessor(), viewModel, allBindingsAccessor);
        ko.bindingHandlers
          .click
          .init(element, accessor, allBindingsAccessor, viewModel, bindingContext);
    }

    private customAccessor(originalFunction, viewModel, allBindingsAccessor): any {
        return function () {
            return function () {
                if (ko.utils.unwrapObservable(allBindingsAccessor().condition)) {
                    originalFunction.apply(viewModel, arguments);
                }

                let moduleName: string = arguments[0];
                this.userActions.changePage(moduleName);
            }.bind(this);
        }.bind(this);
    }
}
