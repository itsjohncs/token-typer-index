declare class libWrapper {
    /**
     * Get libWrapper version
     * @returns {string}  libWrapper version in string form, i.e. "<MAJOR>.<MINOR>.<PATCH>.<SUFFIX><META>"
     */
    static get version(): string;
    /**
     * Get libWrapper version
     * @returns {[number,number,number,number,string]}  libWrapper version in array form, i.e. [<MAJOR>, <MINOR>, <PATCH>, <SUFFIX>, <META>]
     */
    static get versions(): [number, number, number, number, string];
    /**
     * Get the Git version identifier.
     * @returns {string}  Git version identifier, usually 'HEAD' or the commit hash.
     */
    static get git_version(): string;
    /**
     * @returns {boolean}  The real libWrapper module will always return false. Fallback implementations (e.g. poly-fill / shim) should return true.
     */
    static get is_fallback(): boolean;
    static get LibWrapperError(): ErrorConstructor;
    static get Error(): ErrorConstructor;
    static get LibWrapperInternalError(): ErrorConstructor;
    static get InternalError(): ErrorConstructor;
    static get LibWrapperPackageError(): ErrorConstructor;
    static get PackageError(): ErrorConstructor;
    static get LibWrapperAlreadyOverriddenError(): ErrorConstructor;
    static get AlreadyOverriddenError(): ErrorConstructor;
    static get LibWrapperInvalidWrapperChainError(): ErrorConstructor;
    static get InvalidWrapperChainError(): ErrorConstructor;
    static get onUnhandledError(): (error: any, prepend_stack?: any) => void;
    static get WRAPPER(): any;
    static get MIXED(): any;
    static get OVERRIDE(): any;
    static get PERF_NORMAL(): any;
    static get PERF_AUTO(): any;
    static get PERF_FAST(): any;
    /**
     * Test for a minimum libWrapper version.
     * First introduced in v1.4.0.0.
     *
     * @param {number} major   Minimum major version
     * @param {number} minor   [Optional] Minimum minor version. Default is 0.
     * @param {number} patch   [Optional] Minimum patch version. Default is 0.
     * @param {number} suffix  [Optional] Minimum suffix version. Default is 0.
     * @returns {boolean}      Returns true if the libWrapper version is at least the queried version, otherwise false.
     */
    static get version_at_least(): boolean;
    /**
     * Register a new wrapper.
     * Important: If called before the 'init' hook, this method will fail.
     *
     * In addition to wrapping class methods, there is also support for wrapping methods on specific object instances, as well as class methods inherited from parent classes.
     * However, it is recommended to wrap methods directly in the class that defines them whenever possible, as inheritance/instance wrapping is less thoroughly tested and will incur a performance penalty.
     *
     * Triggers FVTT hook 'libWrapper.Register' when successful.
     *
     * Returns a unique numeric target identifier, which can be used as a replacement for 'target' in future calls to 'libWrapper.register' and 'libWrapper.unregister'.
     *
     * @param {string} package_id  The package identifier, i.e. the 'id' field in your module/system/world's manifest.
     *
     * @param {number|string} target The target identifier, specifying which wrapper should be registered.
     *
     *   This can be either:
     *     1. A unique target identifier obtained from a previous 'libWrapper.register' call.
     *     2. A string containing the path to the function you wish to add the wrapper to, starting at global scope, for example 'SightLayer.prototype.updateToken'.
     *
     *   Support for the unique target identifiers (option #1) was added in v1.11.0.0, with previous versions only supporting option #2.
     *
     *   Since v1.8.0.0, the string path (option #2) can contain string array indexing.
     *   For example, 'CONFIG.Actor.sheetClasses.character["dnd5e.ActorSheet5eCharacter"].cls.prototype._onLongRest' is a valid path.
     *   It is important to note that indexing in libWrapper does not work exactly like in JavaScript:
     *     - The index must be a single string, quoted using the ' or " characters. It does not support e.g. numbers or objects.
     *     - A backslash \ can be used to escape another character so that it loses its special meaning, e.g. quotes i.e. ' and " as well as the character \ itself.
     *
     *   By default, libWrapper searches for normal methods or property getters only. To wrap a property's setter, append '#set' to the name, for example 'SightLayer.prototype.blurDistance#set'.
     *
     * @param {function} fn        Wrapper function. The first argument will be the next function in the chain, except for 'OVERRIDE' wrappers.
     *                             The remaining arguments will correspond to the parameters passed to the wrapped method.
     *
     * @param {string} type        [Optional] The type of the wrapper. Default is 'MIXED'.
     *
     *   The possible types are:
     *
     *   'WRAPPER' / libWrapper.WRAPPER:
     *     Use if your wrapper will *always* continue the chain.
     *     This type has priority over every other type. It should be used whenever possible as it massively reduces the likelihood of conflicts.
     *     Note that the library will auto-detect if you use this type but do not call the original function, and automatically unregister your wrapper.
     *
     *   'MIXED' / libWrapper.MIXED:
     *     Default type. Your wrapper will be allowed to decide whether it continue the chain or not.
     *     These will always come after 'WRAPPER'-type wrappers. Order is not guaranteed, but conflicts will be auto-detected.
     *
     *   'OVERRIDE' / libWrapper.OVERRIDE:
     *     Use if your wrapper will *never* continue the chain. This type has the lowest priority, and will always be called last.
     *     If another package already has an 'OVERRIDE' wrapper registered to the same method, using this type will throw a <libWrapper.ERRORS.package> exception.
     *     Catching this exception should allow you to fail gracefully, and for example warn the user of the conflict.
     *     Note that if the GM has explicitly given your package priority over the existing one, no exception will be thrown and your wrapper will take over.
     *
     * @param {Object} options [Optional] Additional options to libWrapper.
     *
     * @param {boolean} options.chain [Optional] If 'true', the first parameter to 'fn' will be a function object that can be called to continue the chain.
     *   This parameter must be 'true' when registering non-OVERRIDE wrappers.
     *   Default is 'false' if type=='OVERRIDE', otherwise 'true'.
     *   First introduced in v1.3.6.0.
     *
     * @param {string} options.perf_mode [Optional] Selects the preferred performance mode for this wrapper. Default is 'AUTO'.
     *   It will be used if all other wrappers registered on the same target also prefer the same mode, otherwise the default will be used instead.
     *   This option should only be specified with good reason. In most cases, using 'AUTO' in order to allow the GM to choose is the best option.
     *   First introduced in v1.5.0.0.
     *
     *   The possible modes are:
     *
     *   'NORMAL' / libWrapper.PERF_NORMAL:
     *     Enables all conflict detection capabilities provided by libWrapper. Slower than 'FAST'.
     *     Useful if wrapping a method commonly modified by other packages, to ensure most issues are detected.
     *     In most other cases, this mode is not recommended and 'AUTO' should be used instead.
     *
     *   'FAST' / libWrapper.PERF_FAST:
     *     Disables some conflict detection capabilities provided by libWrapper, in exchange for performance. Faster than 'NORMAL'.
     *     Will guarantee wrapper call order and per-package prioritization, but fewer conflicts will be detectable.
     *     This performance mode will result in comparable performance to traditional non-libWrapper wrapping methods.
     *     Useful if wrapping a method called repeatedly in a tight loop, for example 'WallsLayer.testWall'.
     *     In most other cases, this mode is not recommended and 'AUTO' should be used instead.
     *
     *   'AUTO' / libWrapper.PERF_AUTO:
     *     Default performance mode. If unsure, choose this mode.
     *     Will allow the GM to choose which performance mode to use.
     *     Equivalent to 'FAST' when the libWrapper 'High-Performance Mode' setting is enabled by the GM, otherwise 'NORMAL'.
     *
     * @param {any[]} options.bind [Optional] An array of parameters that should be passed to 'fn'.
     *
     *   This allows avoiding an extra function call, for instance:
     *     libWrapper.register(PACKAGE_ID, "foo", function(wrapped, ...args) { return someFunction.call(this, wrapped, "foo", "bar", ...args) });
     *   becomes
     *     libWrapper.register(PACKAGE_ID, "foo", someFunction, "WRAPPER", {bind: ["foo", "bar"]});
     *
     *   First introduced in v1.12.0.0.
     *
     * @returns {number} Unique numeric 'target' identifier which can be used in future 'libWrapper.register' and 'libWrapper.unregister' calls.
     *   Added in v1.11.0.0.
     */
    static register(
        package_id: string,
        target: number | string,
        fn: Function,
        type?: string,
        options?: {
            chain: boolean;
            perf_mode: string;
            bind: any[];
        },
    ): number;
    /**
     * Unregister an existing wrapper.
     *
     * Triggers FVTT hook 'libWrapper.Unregister' when successful.
     *
     * @param {string} package_id     The package identifier, i.e. the 'id' field in your module/system/world's manifest.
     *
     * @param {number|string} target  The target identifier, specifying which wrapper should be unregistered.
     *
     *   This can be either:
     *     1. A unique target identifier obtained from a previous 'libWrapper.register' call. This is the recommended option.
     *     2. A string containing the path to the function you wish to remove the wrapper from, starting at global scope, with the same syntax as the 'target' parameter to 'libWrapper.register'.
     *
     *   Support for the unique target identifiers (option #1) was added in v1.11.0.0, with previous versions only supporting option #2.
     *   It is recommended to use option #1 if possible, in order to guard against the case where the class or object at the given path is no longer the same as when `libWrapper.register' was called.
     *
     * @param {function} fail         [Optional] If true, this method will throw an exception if it fails to find the method to unwrap. Default is 'true'.
     */
    static unregister(
        package_id: string,
        target: number | string,
        fail?: Function,
    ): void;
    /**
     * Unregister all wrappers created by a given package.
     *
     * Triggers FVTT hook 'libWrapper.UnregisterAll' when successful.
     *
     * @param {string} package_id  The package identifier, i.e. the 'id' field in your module/system/world's manifest.
     */
    static unregister_all(package_id: string): void;
    /**
     * Ignore conflicts matching specific filters when detected, instead of warning the user.
     *
     * This can be used when there are conflict warnings that are known not to cause any issues, but are unable to be resolved.
     * Conflicts will be ignored if they involve both 'package_id' and one of 'ignore_ids', and relate to one of 'targets'.
     *
     * Note that the user can still see which detected conflicts were ignored, by toggling "Show ignored conflicts" in the "Conflicts" tab in the libWrapper settings.
     *
     * First introduced in v1.7.0.0.
     *
     * @param {string}            package_id  The package identifier, i.e. the 'id' field in your module/system/world's manifest. This will be the package that owns this ignore entry.
     *
     * @param {(string|string[])} ignore_ids  Other package ID(s) with which conflicts should be ignored.
     *
     * @param {(string|string[])} targets     Target(s) for which conflicts should be ignored, corresponding to the 'target' parameter to 'libWrapper.register'.
     *   This method does not accept the unique target identifiers returned by 'libWrapper.register'.
     *
     * @param {Object} options [Optional] Additional options to libWrapper.
     *
     * @param {boolean} options.ignore_errors  [Optional] If 'true', will also ignore confirmed conflicts (i.e. errors), rather than only potential conflicts (i.e. warnings).
     *   Be careful when setting this to 'true', as confirmed conflicts are almost certainly something the user should be made aware of.
     *   Defaults to 'false'.
     */
    static ignore_conflicts(
        package_id: string,
        ignore_ids: string | string[],
        targets: string | string[],
        options?: {
            ignore_errors: boolean;
        },
    ): void;
}
