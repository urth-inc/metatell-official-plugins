'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sdk = require('@module-federation/sdk');
var runtimeUtils = require('./runtime-utils.cjs.js');
var prefetch = require('./prefetch.cjs.js');
var index = require('./index.cjs2.js');
require('@module-federation/runtime');

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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
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
var loadingArray = [];
var strategy = 'loaded-first';
var sharedFlag = strategy;
// eslint-disable-next-line max-lines-per-function
var prefetchPlugin = function() {
    return {
        name: 'data-prefetch-runtime-plugin',
        initContainer: function initContainer(options) {
            var remoteSnapshot = options.remoteSnapshot, remoteInfo = options.remoteInfo, id = options.id, origin = options.origin;
            var snapshot = remoteSnapshot;
            var name = remoteInfo.name;
            var prefetchOptions = {
                name: name,
                remote: remoteInfo,
                origin: origin,
                remoteSnapshot: snapshot
            };
            var signal = runtimeUtils.getSignalFromManifest(snapshot);
            if (!signal) {
                return options;
            }
            if (sharedFlag !== strategy) {
                throw new Error("[Module Federation Data Prefetch]: If you want to use data prefetch, the shared strategy must be 'loaded-first'");
            }
            var instance = prefetch.MFDataPrefetch.getInstance(name) || new prefetch.MFDataPrefetch(prefetchOptions);
            var prefetchUrl;
            // @ts-expect-error
            if (snapshot.prefetchEntry) {
                // @ts-expect-error
                prefetchUrl = sdk.getResourceUrl(snapshot, snapshot.prefetchEntry);
            }
            var exist = loadingArray.find(function(loading) {
                return loading.id === id;
            });
            if (exist) {
                return options;
            }
            var promise = instance.loadEntry(prefetchUrl).then(/*#__PURE__*/ _async_to_generator(function() {
                var projectExports;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            projectExports = instance.getProjectExports();
                            if (!_instanceof(projectExports, Promise)) return [
                                3,
                                2
                            ];
                            return [
                                4,
                                projectExports
                            ];
                        case 1:
                            _state.sent();
                            _state.label = 2;
                        case 2:
                            return [
                                2,
                                Promise.resolve().then(function() {
                                    var exports = instance.getExposeExports(id);
                                    index.logger.info("1. Start Prefetch initContainer: ".concat(id, " - ").concat(performance.now()));
                                    var result = Object.keys(exports).map(function(k) {
                                        var value = instance.prefetch({
                                            id: id,
                                            functionId: k
                                        });
                                        var functionId = k;
                                        return {
                                            value: value,
                                            functionId: functionId
                                        };
                                    });
                                    return result;
                                })
                            ];
                    }
                });
            }));
            loadingArray.push({
                id: id,
                promise: promise
            });
            return options;
        },
        afterResolve: function afterResolve(options) {
            var remoteSnapshot = options.remoteSnapshot, remoteInfo = options.remoteInfo, id = options.id, origin = options.origin;
            var snapshot = remoteSnapshot;
            var name = remoteInfo.name;
            var prefetchOptions = {
                name: name,
                remote: remoteInfo,
                origin: origin,
                remoteSnapshot: snapshot
            };
            var signal = runtimeUtils.getSignalFromManifest(snapshot);
            if (!signal) {
                return options;
            }
            var inited = loadingArray.some(function(info) {
                return info.id === id;
            });
            if (!inited) {
                return options;
            }
            if (sharedFlag !== strategy) {
                throw new Error("[Module Federation Data Prefetch]: If you want to use data prefetch, the shared strategy must be 'loaded-first'");
            }
            var instance = prefetch.MFDataPrefetch.getInstance(name) || new prefetch.MFDataPrefetch(prefetchOptions);
            var prefetchUrl;
            // @ts-expect-error
            if (snapshot.prefetchEntry) {
                // @ts-expect-error
                prefetchUrl = sdk.getResourceUrl(snapshot, snapshot.prefetchEntry);
            }
            var index$1 = loadingArray.findIndex(function(loading) {
                return loading.id === id;
            });
            // clear cache
            if (index$1 !== -1) {
                loadingArray.splice(index$1, 1);
            }
            var promise = instance.loadEntry(prefetchUrl).then(/*#__PURE__*/ _async_to_generator(function() {
                var projectExports;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            projectExports = instance.getProjectExports();
                            if (!_instanceof(projectExports, Promise)) return [
                                3,
                                2
                            ];
                            return [
                                4,
                                projectExports
                            ];
                        case 1:
                            _state.sent();
                            _state.label = 2;
                        case 2:
                            return [
                                2,
                                Promise.resolve().then(function() {
                                    var exports = instance.getExposeExports(id);
                                    index.logger.info("1. Start Prefetch afterResolve: ".concat(id, " - ").concat(performance.now()));
                                    var result = Object.keys(exports).map(function(k) {
                                        var value = instance.prefetch({
                                            id: id,
                                            functionId: k
                                        });
                                        var functionId = k;
                                        return {
                                            value: value,
                                            functionId: functionId
                                        };
                                    });
                                    return result;
                                })
                            ];
                    }
                });
            }));
            loadingArray.push({
                id: id,
                promise: promise
            });
            return options;
        },
        onLoad: function onLoad(options) {
            return _async_to_generator(function() {
                var _loadingArray_find, remote, id, name, promise, prefetch$1, prefetchValue, instance;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            remote = options.remote, id = options.id;
                            name = remote.name;
                            promise = (_loadingArray_find = loadingArray.find(function(loading) {
                                return loading.id === id;
                            })) === null || _loadingArray_find === void 0 ? void 0 : _loadingArray_find.promise;
                            if (!promise) return [
                                3,
                                3
                            ];
                            return [
                                4,
                                promise
                            ];
                        case 1:
                            prefetch$1 = _state.sent();
                            prefetchValue = prefetch$1.map(function(result) {
                                return result.value;
                            });
                            return [
                                4,
                                Promise.all(prefetchValue)
                            ];
                        case 2:
                            _state.sent();
                            instance = prefetch.MFDataPrefetch.getInstance(name);
                            prefetch$1.forEach(function(result) {
                                var value = result.value, functionId = result.functionId;
                                instance.memorize(id + functionId, value);
                            });
                            _state.label = 3;
                        case 3:
                            return [
                                2,
                                options
                            ];
                    }
                });
            })();
        },
        beforeLoadShare: function beforeLoadShare(options) {
            var shareInfo = options.shareInfo;
            sharedFlag = (shareInfo === null || shareInfo === void 0 ? void 0 : shareInfo.strategy) || sharedFlag;
            return options;
        }
    };
};

exports["default"] = prefetchPlugin;
exports.prefetchPlugin = prefetchPlugin;
