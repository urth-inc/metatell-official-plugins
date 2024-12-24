'use strict';

var sharedStrategy = function() {
    return {
        name: 'shared-strategy',
        beforeInit: function beforeInit(args) {
            var userOptions = args.userOptions;
            var shared = userOptions.shared;
            if (shared) {
                Object.keys(shared).forEach(function(sharedKey) {
                    var sharedConfigs = shared[sharedKey];
                    var arraySharedConfigs = Array.isArray(sharedConfigs) ? sharedConfigs : [
                        sharedConfigs
                    ];
                    arraySharedConfigs.forEach(function(s) {
                        s.strategy = 'loaded-first';
                    });
                });
                console.warn("[Module Federation Data Prefetch]: Your shared strategy is set to 'loaded-first', this is a necessary condition for data prefetch");
            }
            return args;
        }
    };
};

module.exports = sharedStrategy;
