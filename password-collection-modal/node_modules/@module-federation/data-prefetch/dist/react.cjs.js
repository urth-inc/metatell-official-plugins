'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var index = require('./index.cjs2.js');
var prefetch = require('./prefetch.cjs.js');
var universal = require('./universal.cjs.js');
var runtimeUtils = require('./runtime-utils.cjs.js');
require('@module-federation/sdk');
require('@module-federation/runtime');

var useFirstMounted = function() {
    var ref = react.useRef(true);
    react.useEffect(function() {
        ref.current = false;
    }, []);
    return ref.current;
};

function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
var usePrefetch = function(options) {
    var isFirstMounted = useFirstMounted();
    if (isFirstMounted) {
        var startTiming = performance.now();
        index.logger.info("2. Start Get Prefetch Data: ".concat(options.id, " - ").concat(options.functionId || 'default', " - ").concat(startTiming));
    }
    var id = options.id, functionId = options.functionId, deferId = options.deferId;
    var prefetchInfo = {
        id: id,
        functionId: functionId
    };
    var mfScope = runtimeUtils.getScope();
    var state;
    var prefetchResult = universal.prefetch(options);
    if (deferId) {
        if (_instanceof(prefetchResult, Promise)) {
            state = prefetchResult.then(function(deferredData) {
                return deferredData.data[deferId];
            });
        } else {
            state = prefetchResult.data[deferId];
        }
    } else {
        state = prefetchResult;
    }
    var _useState = _sliced_to_array(react.useState(state), 2), prefetchState = _useState[0], setPrefetchState = _useState[1];
    var prefetchInstance = prefetch.MFDataPrefetch.getInstance(mfScope);
    react.useEffect(function() {
        var useEffectTiming = performance.now();
        index.logger.info("3. Start Execute UseEffect: ".concat(options.id, " - ").concat(options.functionId || 'default', " - ").concat(useEffectTiming));
        return function() {
            prefetchInstance === null || prefetchInstance === void 0 ? void 0 : prefetchInstance.markOutdate(prefetchInfo, true);
        };
    }, []);
    var refreshExecutor = function(refetchParams) {
        var refetchOptions = _object_spread({}, options);
        if (refetchParams) {
            refetchOptions.refetchParams = refetchParams;
        }
        prefetchInstance === null || prefetchInstance === void 0 ? void 0 : prefetchInstance.markOutdate(prefetchInfo, true);
        var newVal = universal.prefetch(refetchOptions);
        var newState;
        if (deferId) {
            if (_instanceof(newVal, Promise)) {
                newState = newVal.then(function(deferredData) {
                    return deferredData.data[deferId];
                });
            } else {
                newState = newVal.data[deferId];
            }
        } else {
            newState = newVal;
        }
        setPrefetchState(newState);
    };
    return [
        prefetchState,
        refreshExecutor
    ];
};

exports.usePrefetch = usePrefetch;
