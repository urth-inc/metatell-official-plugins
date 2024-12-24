'use strict';

var require$$1 = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);

// no used now
var attribute = 'id';
var hookId = 'usePrefetch';
var importPackage = '@module-federation/data-prefetch/react';
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function babel(babel, options) {
    var t = babel.types;
    var shouldHandle = false;
    var scope = '';
    var name = options.name, exposes = options.exposes;
    if (!exposes) {
        return {};
    }
    var exposesKey = Object.keys(exposes);
    var processedExposes = exposesKey.map(function(expose) {
        return {
            key: expose.replace('.', ''),
            value: require$$1__default["default"].resolve(// @ts-ignore
            typeof exposes[expose] === 'string' ? exposes[expose] : exposes[expose].import)
        };
    });
    return {
        visitor: {
            ImportDeclaration: function ImportDeclaration(nodePath, // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            state) {
                var source = nodePath.node.source.value;
                var specifiers = nodePath.node.specifiers;
                var filename = state.file.opts.filename;
                if (source === importPackage) {
                    shouldHandle = specifiers.some(function(specifier) {
                        return specifier.imported && specifier.imported.name === hookId && processedExposes.find(// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
                        function(expose) {
                            return expose.value === filename && (scope = expose.key);
                        });
                    });
                }
            },
            CallExpression: function CallExpression(nodePath) {
                if (shouldHandle && t.isIdentifier(nodePath.node.callee, {
                    name: hookId
                }) && nodePath.node.arguments.length > 0) {
                    var objectExpression = nodePath.node.arguments[0];
                    if (objectExpression && t.isObjectExpression(objectExpression) && !objectExpression.properties.find(function(p) {
                        return p.key.name === attribute;
                    })) {
                        objectExpression.properties.push(t.objectProperty(t.identifier(attribute), t.stringLiteral(name + scope)));
                    }
                }
            }
        }
    };
}

module.exports = babel;
