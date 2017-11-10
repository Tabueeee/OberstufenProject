export class HistoryManager {
    private popFunctions: Array<(event: any) => void> = [];

    public constructor() {
        window.onpopstate = this.onHistoryPop.bind(this);
    }

    public addPopFunction(f: (event: any) => void) {
        this.popFunctions.push(f);
    }

    // todo generalize and use router to resolve moduleName => route
    public addState(moduleName: string) {
        window.history.pushState(moduleName, moduleName, './index.html?page=' + moduleName);
    }

    private onHistoryPop(e) {
        // todo find out and fix pop not removing last state, maybe becuase render page adds state...

        if (e.state) {
            for (let popFunction of this.popFunctions) {
                popFunction(e.state);
            }
        }
    }
}
