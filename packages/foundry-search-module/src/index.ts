import packageId from "./packageId";

function log(...args: unknown[]): void {
    console.log("!!!", ...args);
}

type Wrapped<T extends (...args: any[]) => any> = (
    next: T,
    ...args: Parameters<T>
) => ReturnType<T>;

const render: Wrapped<FilePicker["render"]> = function (
    this: FilePicker,
    next,
    force,
    options,
) {
    log(this._tabs);
    return next(force, options);
};

Hooks.once("init", function () {
    libWrapper.register(
        packageId,
        "FilePicker.prototype.render",
        render,
        "WRAPPER",
    );
});
