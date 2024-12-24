import { M as MFDataPrefetch } from './prefetch.esm.js';
import { b as getScope } from './runtime-utils.esm.js';
import '@module-federation/runtime';
import '@module-federation/sdk';

function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function prefetch(options) {
    var id = options.id, _options_functionId = options.functionId, functionId = _options_functionId === void 0 ? 'default' : _options_functionId;
    var mfScope = getScope();
    var prefetchInstance = MFDataPrefetch.getInstance(mfScope) || new MFDataPrefetch({
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

export { prefetch };
