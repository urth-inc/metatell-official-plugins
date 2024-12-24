import { getRemoteInfo, getRemoteEntry } from '@module-federation/runtime';
import { loadScript } from '@module-federation/sdk';
import { g as getPrefetchId, c as compatGetPrefetchId } from './runtime-utils.esm.js';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var // @ts-ignore init global variable for test
_globalThis, _globalThis___FEDERATION__;
var ___FEDERATION__;
(___FEDERATION__ = (_globalThis = globalThis).__FEDERATION__) !== null && ___FEDERATION__ !== void 0 ? ___FEDERATION__ : _globalThis.__FEDERATION__ = {};
var ___PREFETCH__;
(___PREFETCH__ = (_globalThis___FEDERATION__ = globalThis.__FEDERATION__).__PREFETCH__) !== null && ___PREFETCH__ !== void 0 ? ___PREFETCH__ : _globalThis___FEDERATION__.__PREFETCH__ = {
    entryLoading: {},
    instance: new Map(),
    __PREFETCH_EXPORTS__: {}
};
var MFDataPrefetch = /*#__PURE__*/ function() {
    function MFDataPrefetch(options) {
        _class_call_check(this, MFDataPrefetch);
        _define_property(this, "prefetchMemory", void 0);
        _define_property(this, "recordOutdate", void 0);
        _define_property(this, "_exports", void 0);
        _define_property(this, "_options", void 0);
        this.prefetchMemory = new Map();
        this.recordOutdate = {};
        this._exports = {};
        this._options = options;
        this.global.instance.set(options.name, this);
    }
    _create_class(MFDataPrefetch, [
        {
            key: "global",
            get: function get() {
                return globalThis.__FEDERATION__.__PREFETCH__;
            }
        },
        {
            key: "loadEntry",
            value: function loadEntry(entry) {
                var _this = this;
                return _async_to_generator(function() {
                    var _this__options, name, remoteSnapshot, remote, origin, buildVersion, globalName, uniqueKey, remoteInfo, module;
                    return _ts_generator(this, function(_state) {
                        _this__options = _this._options, name = _this__options.name, remoteSnapshot = _this__options.remoteSnapshot, remote = _this__options.remote, origin = _this__options.origin;
                        if (entry) {
                            buildVersion = remoteSnapshot.buildVersion, globalName = remoteSnapshot.globalName;
                            uniqueKey = globalName || "".concat(name, ":").concat(buildVersion);
                            if (!_this.global.entryLoading[uniqueKey]) {
                                _this.global.entryLoading[uniqueKey] = loadScript(entry, {});
                            }
                            return [
                                2,
                                _this.global.entryLoading[uniqueKey]
                            ];
                        } else {
                            remoteInfo = getRemoteInfo(remote);
                            module = origin.moduleCache.get(remoteInfo.name);
                            return [
                                2,
                                getRemoteEntry({
                                    origin: origin,
                                    remoteInfo: remoteInfo,
                                    remoteEntryExports: module ? module.remoteEntryExports : undefined
                                })
                            ];
                        }
                    });
                })();
            }
        },
        {
            key: "getProjectExports",
            value: function getProjectExports() {
                var _this = this;
                var _globalThis___FEDERATION_____PREFETCH_____PREFETCH_EXPORTS__;
                if (Object.keys(this._exports).length > 0) {
                    return this._exports;
                }
                var name = this._options.name;
                var exportsPromiseFn = (_globalThis___FEDERATION_____PREFETCH_____PREFETCH_EXPORTS__ = globalThis.__FEDERATION__.__PREFETCH__.__PREFETCH_EXPORTS__) === null || _globalThis___FEDERATION_____PREFETCH_____PREFETCH_EXPORTS__ === void 0 ? void 0 : _globalThis___FEDERATION_____PREFETCH_____PREFETCH_EXPORTS__[name];
                var exportsPromise = typeof exportsPromiseFn === 'function' ? exportsPromiseFn() : Promise.resolve({});
                var resolve = exportsPromise.then(function() {
                    var exports = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                    // Match prefetch based on the function name suffix so that other capabilities can be expanded later.
                    // Not all functions should be directly identified as prefetch functions
                    var memory = {};
                    Object.keys(exports).forEach(function(key) {
                        memory[key] = {};
                        var exportVal = exports[key];
                        Object.keys(exportVal).reduce(function(memo, current) {
                            if (current.toLocaleLowerCase().endsWith('prefetch') || current.toLocaleLowerCase() === 'default') {
                                memo[current] = exportVal[current];
                            }
                            return memo;
                        }, memory[key]);
                    });
                    _this.memorizeExports(memory);
                });
                return resolve;
            }
        },
        {
            key: "memorizeExports",
            value: function memorizeExports(exports) {
                this._exports = exports;
            }
        },
        {
            key: "getExposeExports",
            value: function getExposeExports(id) {
                var prefetchId = getPrefetchId(id);
                var compatId = compatGetPrefetchId(id);
                var prefetchExports = this._exports[prefetchId] || this._exports[compatId];
                return prefetchExports || {};
            }
        },
        {
            key: "prefetch",
            value: function prefetch(prefetchOptions) {
                var id = prefetchOptions.id, _prefetchOptions_functionId = prefetchOptions.functionId, functionId = _prefetchOptions_functionId === void 0 ? 'default' : _prefetchOptions_functionId, refetchParams = prefetchOptions.refetchParams;
                var prefetchResult;
                var prefetchId = getPrefetchId(id);
                var compatId = compatGetPrefetchId(id);
                var memorizeId = id + functionId;
                var memory = this.prefetchMemory.get(memorizeId);
                if (!this.checkOutdate(prefetchOptions) && memory) {
                    return memory;
                }
                var prefetchExports = this._exports[prefetchId] || this._exports[compatId];
                if (!prefetchExports) {
                    return;
                }
                var executePrefetch = prefetchExports[functionId];
                if (typeof executePrefetch === 'function') {
                    if (refetchParams) {
                        prefetchResult = executePrefetch(refetchParams);
                    } else {
                        prefetchResult = executePrefetch();
                    }
                } else {
                    throw new Error("[Module Federation Data Prefetch]: No prefetch function called ".concat(functionId, " export in prefetch file"));
                }
                this.memorize(memorizeId, prefetchResult);
                return prefetchResult;
            }
        },
        {
            key: "memorize",
            value: function memorize(id, value) {
                this.prefetchMemory.set(id, value);
            }
        },
        {
            key: "markOutdate",
            value: function markOutdate(markOptions, isOutdate) {
                var id = markOptions.id, _markOptions_functionId = markOptions.functionId, functionId = _markOptions_functionId === void 0 ? 'default' : _markOptions_functionId;
                if (!this.recordOutdate[id]) {
                    this.recordOutdate[id] = {};
                }
                this.recordOutdate[id][functionId] = isOutdate;
            }
        },
        {
            key: "checkOutdate",
            value: function checkOutdate(outdateOptions) {
                var id = outdateOptions.id, _outdateOptions_functionId = outdateOptions.functionId, functionId = _outdateOptions_functionId === void 0 ? 'default' : _outdateOptions_functionId, cacheStrategy = outdateOptions.cacheStrategy;
                if (typeof cacheStrategy === 'function') {
                    return cacheStrategy();
                }
                if (!this.recordOutdate[id]) {
                    this.recordOutdate[id] = {};
                }
                if (this.recordOutdate[id][functionId]) {
                    this.markOutdate({
                        id: id,
                        functionId: functionId
                    }, false);
                    return true;
                } else {
                    return false;
                }
            }
        }
    ], [
        {
            key: "getInstance",
            value: function getInstance(id) {
                return globalThis.__FEDERATION__.__PREFETCH__.instance.get(id);
            }
        }
    ]);
    return MFDataPrefetch;
}();

export { MFDataPrefetch as M };
