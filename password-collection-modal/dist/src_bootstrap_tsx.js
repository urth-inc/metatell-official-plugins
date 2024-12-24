/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkpassword_collection_modal"] = self["webpackChunkpassword_collection_modal"] || []).push([["src_bootstrap_tsx"],{

/***/ "./src/App.tsx":
/*!*********************!*\
  !*** ./src/App.tsx ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"webpack/sharing/consume/default/react/react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_CustomOverlay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/CustomOverlay */ \"./src/components/CustomOverlay/index.ts\");\n/* harmony import */ var _App_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App.module.scss */ \"./src/App.module.scss\");\n\n\n\nvar App = function App() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: _App_module_scss__WEBPACK_IMPORTED_MODULE_2__.appContainer\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"h2\", {\n    className: _App_module_scss__WEBPACK_IMPORTED_MODULE_2__.appHeadingContainer\n  }, \"password-collection-modal Component\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_CustomOverlay__WEBPACK_IMPORTED_MODULE_1__.CustomOverlay, null));\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);\n\n//# sourceURL=webpack://password-collection-modal/./src/App.tsx?");

/***/ }),

/***/ "./src/bootstrap.tsx":
/*!***************************!*\
  !*** ./src/bootstrap.tsx ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"webpack/sharing/consume/default/react/react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ \"./node_modules/react-dom/client.js\");\n/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App */ \"./src/App.tsx\");\n\n\n\nvar remoteElement = document.getElementById(\"root\");\nvar root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(remoteElement);\nroot.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().StrictMode), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_App__WEBPACK_IMPORTED_MODULE_2__[\"default\"], null)));\n\n//# sourceURL=webpack://password-collection-modal/./src/bootstrap.tsx?");

/***/ }),

/***/ "./src/components/CustomOverlay/CustomOverlay.tsx":
/*!********************************************************!*\
  !*** ./src/components/CustomOverlay/CustomOverlay.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CustomOverlay: () => (/* binding */ CustomOverlay)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"webpack/sharing/consume/default/react/react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _CustomOverlay_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CustomOverlay.module.scss */ \"./src/components/CustomOverlay/CustomOverlay.module.scss\");\n/* harmony import */ var _PasswordCollectionModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../PasswordCollectionModal */ \"./src/components/PasswordCollectionModal/index.ts\");\n\n\n\nvar CustomOverlay = function CustomOverlay() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    className: _CustomOverlay_module_scss__WEBPACK_IMPORTED_MODULE_1__.customOverlayContainer\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_PasswordCollectionModal__WEBPACK_IMPORTED_MODULE_2__.PasswordCollectionModal, null));\n};\n\n//# sourceURL=webpack://password-collection-modal/./src/components/CustomOverlay/CustomOverlay.tsx?");

/***/ }),

/***/ "./src/components/CustomOverlay/index.ts":
/*!***********************************************!*\
  !*** ./src/components/CustomOverlay/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CustomOverlay: () => (/* reexport safe */ _CustomOverlay__WEBPACK_IMPORTED_MODULE_0__.CustomOverlay)\n/* harmony export */ });\n/* harmony import */ var _CustomOverlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CustomOverlay */ \"./src/components/CustomOverlay/CustomOverlay.tsx\");\n\n\n//# sourceURL=webpack://password-collection-modal/./src/components/CustomOverlay/index.ts?");

/***/ }),

/***/ "./src/components/PasswordCollectionModal/PasswordCollectionModal.tsx":
/*!****************************************************************************!*\
  !*** ./src/components/PasswordCollectionModal/PasswordCollectionModal.tsx ***!
  \****************************************************************************/
/***/ (() => {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nSyntaxError: /mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/src/components/PasswordCollectionModal/PasswordCollectionModal.tsx: Unexpected token, expected \\\"...\\\" (46:12)\\n\\n\\u001b[0m \\u001b[90m 44 |\\u001b[39m \\u001b[90m          isOpen ? \\\"opened\\\" : \\\"closed\\\",\\u001b[39m\\n \\u001b[90m 45 |\\u001b[39m \\u001b[90m        )}\\u001b[39m\\n\\u001b[31m\\u001b[1m>\\u001b[22m\\u001b[39m\\u001b[90m 46 |\\u001b[39m \\u001b[90m          */\\u001b[39m}\\n \\u001b[90m    |\\u001b[39m             \\u001b[31m\\u001b[1m^\\u001b[22m\\u001b[39m\\n \\u001b[90m 47 |\\u001b[39m         onClick\\u001b[33m=\\u001b[39m{toggleIsOpen}\\n \\u001b[90m 48 |\\u001b[39m       \\u001b[33m>\\u001b[39m\\n \\u001b[90m 49 |\\u001b[39m         \\u001b[33m<\\u001b[39m\\u001b[33mdiv\\u001b[39m \\u001b[0m\\n    at constructor (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:352:19)\\n    at TypeScriptParserMixin.raise (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:3250:19)\\n    at TypeScriptParserMixin.unexpected (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:3270:16)\\n    at TypeScriptParserMixin.expect (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:3580:12)\\n    at TypeScriptParserMixin.jsxParseAttribute (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:6686:12)\\n    at TypeScriptParserMixin.jsxParseOpeningElementAfterName (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:6708:28)\\n    at TypeScriptParserMixin.jsxParseOpeningElementAfterName (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:9666:18)\\n    at TypeScriptParserMixin.jsxParseOpeningElementAt (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:6703:17)\\n    at TypeScriptParserMixin.jsxParseElementAt (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:6727:33)\\n    at TypeScriptParserMixin.jsxParseElementAt (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:6739:32)\\n    at TypeScriptParserMixin.jsxParseElement (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:6790:17)\\n    at TypeScriptParserMixin.parseExprAtom (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:6800:19)\\n    at TypeScriptParserMixin.parseExprSubscripts (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10565:23)\\n    at TypeScriptParserMixin.parseUpdate (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10550:21)\\n    at TypeScriptParserMixin.parseMaybeUnary (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10530:23)\\n    at TypeScriptParserMixin.parseMaybeUnary (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:9458:18)\\n    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10384:61)\\n    at TypeScriptParserMixin.parseExprOps (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10389:23)\\n    at TypeScriptParserMixin.parseMaybeConditional (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10366:23)\\n    at TypeScriptParserMixin.parseMaybeAssign (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10329:21)\\n    at /mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:9396:39\\n    at TypeScriptParserMixin.tryParse (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:3588:20)\\n    at TypeScriptParserMixin.parseMaybeAssign (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:9396:18)\\n    at /mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10299:39\\n    at TypeScriptParserMixin.allowInAnd (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:11914:12)\\n    at TypeScriptParserMixin.parseMaybeAssignAllowIn (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10299:17)\\n    at TypeScriptParserMixin.parseParenAndDistinguishExpression (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:11176:28)\\n    at TypeScriptParserMixin.parseExprAtom (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10832:23)\\n    at TypeScriptParserMixin.parseExprAtom (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:6805:20)\\n    at TypeScriptParserMixin.parseExprSubscripts (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10565:23)\\n    at TypeScriptParserMixin.parseUpdate (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10550:21)\\n    at TypeScriptParserMixin.parseMaybeUnary (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10530:23)\\n    at TypeScriptParserMixin.parseMaybeUnary (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:9458:18)\\n    at TypeScriptParserMixin.parseMaybeUnaryOrPrivate (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10384:61)\\n    at TypeScriptParserMixin.parseExprOps (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10389:23)\\n    at TypeScriptParserMixin.parseMaybeConditional (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10366:23)\\n    at TypeScriptParserMixin.parseMaybeAssign (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10329:21)\\n    at TypeScriptParserMixin.parseMaybeAssign (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:9407:20)\\n    at TypeScriptParserMixin.parseExpressionBase (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10283:23)\\n    at /mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10279:39\\n    at TypeScriptParserMixin.allowInAnd (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:11909:16)\\n    at TypeScriptParserMixin.parseExpression (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:10279:17)\\n    at TypeScriptParserMixin.parseReturnStatement (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:12599:28)\\n    at TypeScriptParserMixin.parseStatementContent (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:12251:21)\\n    at TypeScriptParserMixin.parseStatementContent (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:9132:18)\\n    at TypeScriptParserMixin.parseStatementLike (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:12220:17)\\n    at TypeScriptParserMixin.parseStatementListItem (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:12200:17)\\n    at TypeScriptParserMixin.parseBlockOrModuleBlockBody (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:12773:61)\\n    at TypeScriptParserMixin.parseBlockBody (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:12766:10)\\n    at TypeScriptParserMixin.parseBlock (/mnt/sdc/kira/work/urth/metatell-official-plugins/password-collection-modal/node_modules/@babel/parser/lib/index.js:12754:10)\");\n\n//# sourceURL=webpack://password-collection-modal/./src/components/PasswordCollectionModal/PasswordCollectionModal.tsx?");

/***/ }),

/***/ "./src/components/PasswordCollectionModal/index.ts":
/*!*********************************************************!*\
  !*** ./src/components/PasswordCollectionModal/index.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PasswordCollectionModal: () => (/* reexport safe */ _PasswordCollectionModal__WEBPACK_IMPORTED_MODULE_0__.PasswordCollectionModal)\n/* harmony export */ });\n/* harmony import */ var _PasswordCollectionModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PasswordCollectionModal */ \"./src/components/PasswordCollectionModal/PasswordCollectionModal.tsx\");\n\n\n//# sourceURL=webpack://password-collection-modal/./src/components/PasswordCollectionModal/index.ts?");

/***/ }),

/***/ "./src/App.module.scss":
/*!*****************************!*\
  !*** ./src/App.module.scss ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"app-container\": () => (/* binding */ _1),\n/* harmony export */   \"app-heading-container\": () => (/* binding */ _2),\n/* harmony export */   appContainer: () => (/* binding */ _3),\n/* harmony export */   appHeadingContainer: () => (/* binding */ _4)\n/* harmony export */ });\n// extracted by mini-css-extract-plugin\nvar _1 = \"App-module__app-container__hnrRj\";\nvar _2 = \"App-module__app-heading-container__gq_xC\";\nvar _3 = \"App-module__app-container__hnrRj\";\nvar _4 = \"App-module__app-heading-container__gq_xC\";\n\n\n\n//# sourceURL=webpack://password-collection-modal/./src/App.module.scss?");

/***/ }),

/***/ "./src/components/CustomOverlay/CustomOverlay.module.scss":
/*!****************************************************************!*\
  !*** ./src/components/CustomOverlay/CustomOverlay.module.scss ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"custom-overlay-container\": () => (/* binding */ _1),\n/* harmony export */   customOverlayContainer: () => (/* binding */ _2)\n/* harmony export */ });\n// extracted by mini-css-extract-plugin\nvar _1 = \"CustomOverlay-module__custom-overlay-container__sBThk\";\nvar _2 = \"CustomOverlay-module__custom-overlay-container__sBThk\";\n\n\n\n//# sourceURL=webpack://password-collection-modal/./src/components/CustomOverlay/CustomOverlay.module.scss?");

/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nvar m = __webpack_require__(/*! react-dom */ \"webpack/sharing/consume/default/react-dom/react-dom\");\nif (false) {} else {\n  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;\n  exports.createRoot = function(c, o) {\n    i.usingClientEntryPoint = true;\n    try {\n      return m.createRoot(c, o);\n    } finally {\n      i.usingClientEntryPoint = false;\n    }\n  };\n  exports.hydrateRoot = function(c, h, o) {\n    i.usingClientEntryPoint = true;\n    try {\n      return m.hydrateRoot(c, h, o);\n    } finally {\n      i.usingClientEntryPoint = false;\n    }\n  };\n}\n\n\n//# sourceURL=webpack://password-collection-modal/./node_modules/react-dom/client.js?");

/***/ })

}]);