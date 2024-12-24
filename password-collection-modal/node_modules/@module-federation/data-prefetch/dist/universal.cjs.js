'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var prefetch$1 = require('./prefetch.cjs.js');
var runtimeUtils = require('./runtime-utils.cjs.js');
require('@module-federation/runtime');
require('@module-federation/sdk');

function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function prefetch(options) {
    var id = options.id, _options_functionId = options.functionId, functionId = _options_functionId === void 0 ? 'default' : _options_functionId;
    var mfScope = runtimeUtils.getScope();
    var prefetchInstance = prefetch$1.MFDataPrefetch.getInstance(mfScope) || new prefetch$1.MFDataPrefetch({
        name: mfScope
    });
    var res = prefetchInstance.getProjectExports();
    if (_instanceof(res, Promise)) {
        var promise = res.then(function() {
            var result = prefetchInstance.prefetch(options);
            prefetchInstance.memorize(id + functionId, result);
            return result;
        });
        return promise;
    } else {
        var result = prefetchInstance.prefetch(options);
        prefetchInstance.memorize(id + functionId, result);
        return result;
    }
}

exports.prefetch = prefetch;
