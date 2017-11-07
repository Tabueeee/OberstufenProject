import * as ko from "knockout";

export interface Handler extends ko.BindingHandler {
    name: string;
}
