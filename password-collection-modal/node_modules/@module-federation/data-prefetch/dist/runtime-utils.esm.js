import { getInstance } from '@module-federation/runtime';
import { encodeName, MFPrefetchCommon } from '@module-federation/sdk';

var getScope = function() {
    return getInstance().options.name;
};
var getPrefetchId = function(id) {
    return encodeName("".concat(id, "/").concat(MFPrefetchCommon.identifier));
};
var compatGetPrefetchId = function(id) {
    return encodeName("".concat(id, "/VmokPrefetch"));
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

export { getSignalFromManifest as a, getScope as b, compatGetPrefetchId as c, getPrefetchId as g };
