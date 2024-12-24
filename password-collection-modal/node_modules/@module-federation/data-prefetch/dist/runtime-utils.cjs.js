'use strict';

var runtime = require('@module-federation/runtime');
var sdk = require('@module-federation/sdk');

var getScope = function() {
    return runtime.getInstance().options.name;
};
var getPrefetchId = function(id) {
    return sdk.encodeName("".concat(id, "/").concat(sdk.MFPrefetchCommon.identifier));
};
var compatGetPrefetchId = function(id) {
    return sdk.encodeName("".concat(id, "/VmokPrefetch"));
};
var getSignalFromManifest = function(remoteSnapshot) {
    if (!remoteSnapshot) {
        return false;
    }
    if (!('prefetchEntry' in remoteSnapshot) && !('prefetchInterface' in remoteSnapshot)) {
        return false;
    }
    if (!remoteSnapshot.prefetchEntry && !remoteSnapshot.prefetchInterface) {
        return false;
    }
    return true;
};

exports.compatGetPrefetchId = compatGetPrefetchId;
exports.getPrefetchId = getPrefetchId;
exports.getScope = getScope;
exports.getSignalFromManifest = getSignalFromManifest;
