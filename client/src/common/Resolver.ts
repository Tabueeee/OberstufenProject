export class Resolver<T> {
    private classes: Array<T>;

    //todo add caching
    public constructor(classes: Array<T>) {
        this.classes = classes;
    }

    //todo consider stronger type for classToResolve
    public getServiceByJobName(classToResolve: string): T {
        let rec = function (index) {
            if (this.classes[index].constructor.name === classToResolve) {
                return this.classes[index];
            }

            if (index < 1) {
                throw new Error('cannot resolve service: ' + classToResolve);
            }

            return rec(index - 1);
        }.bind(this);

        return rec(this.classes.length - 1);
    }
}
