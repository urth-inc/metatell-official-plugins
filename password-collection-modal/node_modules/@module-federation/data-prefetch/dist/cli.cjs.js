'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var require$$1 = require('path');
var require$$0$2 = require('fs');
var require$$0 = require('constants');
var require$$0$1 = require('stream');
var require$$4 = require('util');
var require$$5 = require('assert');
var sdk = require('@module-federation/sdk');
var normalizeWebpackPath = require('@module-federation/sdk/normalize-webpack-path');
var runtimeUtils = require('./runtime-utils.cjs.js');
require('@module-federation/runtime');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$0__default$2 = /*#__PURE__*/_interopDefaultLegacy(require$$0$2);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
var require$$4__default = /*#__PURE__*/_interopDefaultLegacy(require$$4);
var require$$5__default = /*#__PURE__*/_interopDefaultLegacy(require$$5);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var lib = {
    exports: {}
};

var fs$i = {};

var universalify$1 = {};

universalify$1.fromCallback = function(fn) {
    return Object.defineProperty(function() {
        var _this = this;
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (typeof args[args.length - 1] === 'function') fn.apply(this, args);
        else {
            return new Promise(function(resolve, reject) {
                args.push(function(err, res) {
                    return err != null ? reject(err) : resolve(res);
                });
                fn.apply(_this, args);
            });
        }
    }, 'name', {
        value: fn.name
    });
};
universalify$1.fromPromise = function(fn) {
    return Object.defineProperty(function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        var cb = args[args.length - 1];
        if (typeof cb !== 'function') return fn.apply(this, args);
        else {
            args.pop();
            fn.apply(this, args).then(function(r) {
                return cb(null, r);
            }, cb);
        }
    }, 'name', {
        value: fn.name
    });
};

var constants = require$$0__default["default"];
var origCwd = process.cwd;
var cwd = null;
var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
    if (!cwd) cwd = origCwd.call(process);
    return cwd;
};
try {
    process.cwd();
} catch (er) {}
// This check is needed until node.js 12 is required
if (typeof process.chdir === 'function') {
    var chdir = process.chdir;
    process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
    };
    if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
}
var polyfills$1 = patch$1;
function patch$1(fs) {
    // (re-)implement some things that are known busted or missing.
    // lchmod, broken prior to 0.6.2
    // back-port the fix here.
    if (constants.hasOwnProperty('O_SYMLINK') && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs);
    }
    // lutimes implementation, or no-op
    if (!fs.lutimes) {
        patchLutimes(fs);
    }
    // https://github.com/isaacs/node-graceful-fs/issues/4
    // Chown should not fail on einval or eperm if non-root.
    // It should not fail on enosys ever, as this just indicates
    // that a fs doesn't support the intended operation.
    fs.chown = chownFix(fs.chown);
    fs.fchown = chownFix(fs.fchown);
    fs.lchown = chownFix(fs.lchown);
    fs.chmod = chmodFix(fs.chmod);
    fs.fchmod = chmodFix(fs.fchmod);
    fs.lchmod = chmodFix(fs.lchmod);
    fs.chownSync = chownFixSync(fs.chownSync);
    fs.fchownSync = chownFixSync(fs.fchownSync);
    fs.lchownSync = chownFixSync(fs.lchownSync);
    fs.chmodSync = chmodFixSync(fs.chmodSync);
    fs.fchmodSync = chmodFixSync(fs.fchmodSync);
    fs.lchmodSync = chmodFixSync(fs.lchmodSync);
    fs.stat = statFix(fs.stat);
    fs.fstat = statFix(fs.fstat);
    fs.lstat = statFix(fs.lstat);
    fs.statSync = statFixSync(fs.statSync);
    fs.fstatSync = statFixSync(fs.fstatSync);
    fs.lstatSync = statFixSync(fs.lstatSync);
    // if lchmod/lchown do not exist, then make them no-ops
    if (fs.chmod && !fs.lchmod) {
        fs.lchmod = function(path, mode, cb) {
            if (cb) process.nextTick(cb);
        };
        fs.lchmodSync = function() {};
    }
    if (fs.chown && !fs.lchown) {
        fs.lchown = function(path, uid, gid, cb) {
            if (cb) process.nextTick(cb);
        };
        fs.lchownSync = function() {};
    }
    // on Windows, A/V software can lock the directory, causing this
    // to fail with an EACCES or EPERM if the directory contains newly
    // created files.  Try again on failure, for up to 60 seconds.
    // Set the timeout this long because some Windows Anti-Virus, such as Parity
    // bit9, may lock files for up to a minute, causing npm package install
    // failures. Also, take care to yield the scheduler. Windows scheduling gives
    // CPU to a busy looping process, which can cause the program causing the lock
    // contention to be starved of CPU by node, so the contention doesn't resolve.
    if (platform === "win32") {
        fs.rename = typeof fs.rename !== 'function' ? fs.rename : function(fs$rename) {
            function rename(from, to, cb) {
                var start = Date.now();
                var backoff = 0;
                fs$rename(from, to, function CB(er) {
                    if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 60000) {
                        setTimeout(function() {
                            fs.stat(to, function(stater, st) {
                                if (stater && stater.code === "ENOENT") fs$rename(from, to, CB);
                                else cb(er);
                            });
                        }, backoff);
                        if (backoff < 100) backoff += 10;
                        return;
                    }
                    if (cb) cb(er);
                });
            }
            if (Object.setPrototypeOf) Object.setPrototypeOf(rename, fs$rename);
            return rename;
        }(fs.rename);
    }
    // if read() returns EAGAIN, then just try it again.
    fs.read = typeof fs.read !== 'function' ? fs.read : function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
            var callback;
            if (callback_ && typeof callback_ === 'function') {
                var eagCounter = 0;
                callback = function(er, _, __) {
                    if (er && er.code === 'EAGAIN' && eagCounter < 10) {
                        eagCounter++;
                        return fs$read.call(fs, fd, buffer, offset, length, position, callback);
                    }
                    callback_.apply(this, arguments);
                };
            }
            return fs$read.call(fs, fd, buffer, offset, length, position, callback);
        }
        // This ensures `util.promisify` works as it does for native `fs.read`.
        if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
        return read;
    }(fs.read);
    fs.readSync = typeof fs.readSync !== 'function' ? fs.readSync : function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
            var eagCounter = 0;
            while(true){
                try {
                    return fs$readSync.call(fs, fd, buffer, offset, length, position);
                } catch (er) {
                    if (er.code === 'EAGAIN' && eagCounter < 10) {
                        eagCounter++;
                        continue;
                    }
                    throw er;
                }
            }
        };
    }(fs.readSync);
    function patchLchmod(fs) {
        fs.lchmod = function(path, mode, callback) {
            fs.open(path, constants.O_WRONLY | constants.O_SYMLINK, mode, function(err, fd) {
                if (err) {
                    if (callback) callback(err);
                    return;
                }
                // prefer to return the chmod error, if one occurs,
                // but still try to close, and report closing errors if they occur.
                fs.fchmod(fd, mode, function(err) {
                    fs.close(fd, function(err2) {
                        if (callback) callback(err || err2);
                    });
                });
            });
        };
        fs.lchmodSync = function(path, mode) {
            var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode);
            // prefer to return the chmod error, if one occurs,
            // but still try to close, and report closing errors if they occur.
            var threw = true;
            var ret;
            try {
                ret = fs.fchmodSync(fd, mode);
                threw = false;
            } finally{
                if (threw) {
                    try {
                        fs.closeSync(fd);
                    } catch (er) {}
                } else {
                    fs.closeSync(fd);
                }
            }
            return ret;
        };
    }
    function patchLutimes(fs) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs.futimes) {
            fs.lutimes = function(path, at, mt, cb) {
                fs.open(path, constants.O_SYMLINK, function(er, fd) {
                    if (er) {
                        if (cb) cb(er);
                        return;
                    }
                    fs.futimes(fd, at, mt, function(er) {
                        fs.close(fd, function(er2) {
                            if (cb) cb(er || er2);
                        });
                    });
                });
            };
            fs.lutimesSync = function(path, at, mt) {
                var fd = fs.openSync(path, constants.O_SYMLINK);
                var ret;
                var threw = true;
                try {
                    ret = fs.futimesSync(fd, at, mt);
                    threw = false;
                } finally{
                    if (threw) {
                        try {
                            fs.closeSync(fd);
                        } catch (er) {}
                    } else {
                        fs.closeSync(fd);
                    }
                }
                return ret;
            };
        } else if (fs.futimes) {
            fs.lutimes = function(_a, _b, _c, cb) {
                if (cb) process.nextTick(cb);
            };
            fs.lutimesSync = function() {};
        }
    }
    function chmodFix(orig) {
        if (!orig) return orig;
        return function(target, mode, cb) {
            return orig.call(fs, target, mode, function(er) {
                if (chownErOk(er)) er = null;
                if (cb) cb.apply(this, arguments);
            });
        };
    }
    function chmodFixSync(orig) {
        if (!orig) return orig;
        return function(target, mode) {
            try {
                return orig.call(fs, target, mode);
            } catch (er) {
                if (!chownErOk(er)) throw er;
            }
        };
    }
    function chownFix(orig) {
        if (!orig) return orig;
        return function(target, uid, gid, cb) {
            return orig.call(fs, target, uid, gid, function(er) {
                if (chownErOk(er)) er = null;
                if (cb) cb.apply(this, arguments);
            });
        };
    }
    function chownFixSync(orig) {
        if (!orig) return orig;
        return function(target, uid, gid) {
            try {
                return orig.call(fs, target, uid, gid);
            } catch (er) {
                if (!chownErOk(er)) throw er;
            }
        };
    }
    function statFix(orig) {
        if (!orig) return orig;
        // Older versions of Node erroneously returned signed integers for
        // uid + gid.
        return function(target, options, cb) {
            if (typeof options === 'function') {
                cb = options;
                options = null;
            }
            function callback(er, stats) {
                if (stats) {
                    if (stats.uid < 0) stats.uid += 0x100000000;
                    if (stats.gid < 0) stats.gid += 0x100000000;
                }
                if (cb) cb.apply(this, arguments);
            }
            return options ? orig.call(fs, target, options, callback) : orig.call(fs, target, callback);
        };
    }
    function statFixSync(orig) {
        if (!orig) return orig;
        // Older versions of Node erroneously returned signed integers for
        // uid + gid.
        return function(target, options) {
            var stats = options ? orig.call(fs, target, options) : orig.call(fs, target);
            if (stats) {
                if (stats.uid < 0) stats.uid += 0x100000000;
                if (stats.gid < 0) stats.gid += 0x100000000;
            }
            return stats;
        };
    }
    // ENOSYS means that the fs doesn't support the op. Just ignore
    // that, because it doesn't matter.
    //
    // if there's no getuid, or if getuid() is something other
    // than 0, and the error is EINVAL or EPERM, then just ignore
    // it.
    //
    // This specific case is a silent failure in cp, install, tar,
    // and most other unix tools that manage permissions.
    //
    // When running as root, or if other types of errors are
    // encountered, then it's strict.
    function chownErOk(er) {
        if (!er) return true;
        if (er.code === "ENOSYS") return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
            if (er.code === "EINVAL" || er.code === "EPERM") return true;
        }
        return false;
    }
}

function _instanceof$2(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var Stream = require$$0__default$1["default"].Stream;
var legacyStreams = legacy$1;
function legacy$1(fs) {
    return {
        ReadStream: ReadStream,
        WriteStream: WriteStream
    };
    function ReadStream(path, options) {
        if (!_instanceof$2(this, ReadStream)) return new ReadStream(path, options);
        Stream.call(this);
        var self = this;
        this.path = path;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = 'r';
        this.mode = 438; /*=0666*/ 
        this.bufferSize = 64 * 1024;
        options = options || {};
        // Mixin options into this
        var keys = Object.keys(options);
        for(var index = 0, length = keys.length; index < length; index++){
            var key = keys[index];
            this[key] = options[key];
        }
        if (this.encoding) this.setEncoding(this.encoding);
        if (this.start !== undefined) {
            if ('number' !== typeof this.start) {
                throw TypeError('start must be a Number');
            }
            if (this.end === undefined) {
                this.end = Infinity;
            } else if ('number' !== typeof this.end) {
                throw TypeError('end must be a Number');
            }
            if (this.start > this.end) {
                throw new Error('start must be <= end');
            }
            this.pos = this.start;
        }
        if (this.fd !== null) {
            process.nextTick(function() {
                self._read();
            });
            return;
        }
        fs.open(this.path, this.flags, this.mode, function(err, fd) {
            if (err) {
                self.emit('error', err);
                self.readable = false;
                return;
            }
            self.fd = fd;
            self.emit('open', fd);
            self._read();
        });
    }
    function WriteStream(path, options) {
        if (!_instanceof$2(this, WriteStream)) return new WriteStream(path, options);
        Stream.call(this);
        this.path = path;
        this.fd = null;
        this.writable = true;
        this.flags = 'w';
        this.encoding = 'binary';
        this.mode = 438; /*=0666*/ 
        this.bytesWritten = 0;
        options = options || {};
        // Mixin options into this
        var keys = Object.keys(options);
        for(var index = 0, length = keys.length; index < length; index++){
            var key = keys[index];
            this[key] = options[key];
        }
        if (this.start !== undefined) {
            if ('number' !== typeof this.start) {
                throw TypeError('start must be a Number');
            }
            if (this.start < 0) {
                throw new Error('start must be >= zero');
            }
            this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
            this._open = fs.open;
            this._queue.push([
                this._open,
                this.path,
                this.flags,
                this.mode,
                undefined
            ]);
            this.flush();
        }
    }
}

function _instanceof$1(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _type_of$1(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var clone_1 = clone$1;
var getPrototypeOf = Object.getPrototypeOf || function(obj) {
    return obj.__proto__;
};
function clone$1(obj) {
    if (obj === null || (typeof obj === "undefined" ? "undefined" : _type_of$1(obj)) !== 'object') return obj;
    if (_instanceof$1(obj, Object)) var copy = {
        __proto__: getPrototypeOf(obj)
    };
    else var copy = Object.create(null);
    Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
    });
    return copy;
}

function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var fs$h = require$$0__default$2["default"];
var polyfills = polyfills$1;
var legacy = legacyStreams;
var clone = clone_1;
var util$1 = require$$4__default["default"];
/* istanbul ignore next - node 0.x polyfill */ var gracefulQueue;
var previousSymbol;
/* istanbul ignore else - node 0.x polyfill */ if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
    gracefulQueue = Symbol.for('graceful-fs.queue');
    // This is used in testing by future versions
    previousSymbol = Symbol.for('graceful-fs.previous');
} else {
    gracefulQueue = '___graceful-fs.queue';
    previousSymbol = '___graceful-fs.previous';
}
function noop() {}
function publishQueue(context, queue) {
    Object.defineProperty(context, gracefulQueue, {
        get: function get() {
            return queue;
        }
    });
}
var debug = noop;
if (util$1.debuglog) debug = util$1.debuglog('gfs4');
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) debug = function debug() {
    var m = util$1.format.apply(util$1, arguments);
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ');
    console.error(m);
};
// Once time initialization
if (!fs$h[gracefulQueue]) {
    // This queue can be shared by multiple loaded instances
    var queue = commonjsGlobal[gracefulQueue] || [];
    publishQueue(fs$h, queue);
    // Patch fs.close/closeSync to shared queue version, because we need
    // to retry() whenever a close happens *anywhere* in the program.
    // This is essential when multiple graceful-fs instances are
    // in play at the same time.
    fs$h.close = function(fs$close) {
        function close(fd, cb) {
            return fs$close.call(fs$h, fd, function(err) {
                // This function uses the graceful-fs shared queue
                if (!err) {
                    resetQueue();
                }
                if (typeof cb === 'function') cb.apply(this, arguments);
            });
        }
        Object.defineProperty(close, previousSymbol, {
            value: fs$close
        });
        return close;
    }(fs$h.close);
    fs$h.closeSync = function(fs$closeSync) {
        function closeSync(fd) {
            // This function uses the graceful-fs shared queue
            fs$closeSync.apply(fs$h, arguments);
            resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
            value: fs$closeSync
        });
        return closeSync;
    }(fs$h.closeSync);
    if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
        process.on('exit', function() {
            debug(fs$h[gracefulQueue]);
            require$$5__default["default"].equal(fs$h[gracefulQueue].length, 0);
        });
    }
}
if (!commonjsGlobal[gracefulQueue]) {
    publishQueue(commonjsGlobal, fs$h[gracefulQueue]);
}
var gracefulFs = patch(clone(fs$h));
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs$h.__patched) {
    gracefulFs = patch(fs$h);
    fs$h.__patched = true;
}
function patch(fs) {
    // Everything that references the open() function needs to be in here
    polyfills(fs);
    fs.gracefulify = patch;
    fs.createReadStream = createReadStream;
    fs.createWriteStream = createWriteStream;
    var fs$readFile = fs.readFile;
    fs.readFile = readFile;
    function readFile(path, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        return go$readFile(path, options, cb);
        function go$readFile(path, options, cb, startTime) {
            return fs$readFile(path, options, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) enqueue([
                    go$readFile,
                    [
                        path,
                        options,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (typeof cb === 'function') cb.apply(this, arguments);
                }
            });
        }
    }
    var fs$writeFile = fs.writeFile;
    fs.writeFile = writeFile;
    function writeFile(path, data, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        return go$writeFile(path, data, options, cb);
        function go$writeFile(path, data, options, cb, startTime) {
            return fs$writeFile(path, data, options, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) enqueue([
                    go$writeFile,
                    [
                        path,
                        data,
                        options,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (typeof cb === 'function') cb.apply(this, arguments);
                }
            });
        }
    }
    var fs$appendFile = fs.appendFile;
    if (fs$appendFile) fs.appendFile = appendFile;
    function appendFile(path, data, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        return go$appendFile(path, data, options, cb);
        function go$appendFile(path, data, options, cb, startTime) {
            return fs$appendFile(path, data, options, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) enqueue([
                    go$appendFile,
                    [
                        path,
                        data,
                        options,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (typeof cb === 'function') cb.apply(this, arguments);
                }
            });
        }
    }
    var fs$copyFile = fs.copyFile;
    if (fs$copyFile) fs.copyFile = copyFile;
    function copyFile(src, dest, flags, cb) {
        if (typeof flags === 'function') {
            cb = flags;
            flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src, dest, flags, cb, startTime) {
            return fs$copyFile(src, dest, flags, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) enqueue([
                    go$copyFile,
                    [
                        src,
                        dest,
                        flags,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (typeof cb === 'function') cb.apply(this, arguments);
                }
            });
        }
    }
    var fs$readdir = fs.readdir;
    fs.readdir = readdir;
    var noReaddirOptionVersions = /^v[0-5]\./;
    function readdir(path, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir(path, options, cb, startTime) {
            return fs$readdir(path, fs$readdirCallback(path, options, cb, startTime));
        } : function go$readdir(path, options, cb, startTime) {
            return fs$readdir(path, options, fs$readdirCallback(path, options, cb, startTime));
        };
        return go$readdir(path, options, cb);
        function fs$readdirCallback(path, options, cb, startTime) {
            return function(err, files) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) enqueue([
                    go$readdir,
                    [
                        path,
                        options,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (files && files.sort) files.sort();
                    if (typeof cb === 'function') cb.call(this, err, files);
                }
            };
        }
    }
    if (process.version.substr(0, 4) === 'v0.8') {
        var legStreams = legacy(fs);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
    }
    var fs$ReadStream = fs.ReadStream;
    if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
    }
    var fs$WriteStream = fs.WriteStream;
    if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
    }
    Object.defineProperty(fs, 'ReadStream', {
        get: function get() {
            return ReadStream;
        },
        set: function set(val) {
            ReadStream = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fs, 'WriteStream', {
        get: function get() {
            return WriteStream;
        },
        set: function set(val) {
            WriteStream = val;
        },
        enumerable: true,
        configurable: true
    });
    // legacy names
    var FileReadStream = ReadStream;
    Object.defineProperty(fs, 'FileReadStream', {
        get: function get() {
            return FileReadStream;
        },
        set: function set(val) {
            FileReadStream = val;
        },
        enumerable: true,
        configurable: true
    });
    var FileWriteStream = WriteStream;
    Object.defineProperty(fs, 'FileWriteStream', {
        get: function get() {
            return FileWriteStream;
        },
        set: function set(val) {
            FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
    });
    function ReadStream(path, options) {
        if (_instanceof(this, ReadStream)) return fs$ReadStream.apply(this, arguments), this;
        else return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
    }
    function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
            if (err) {
                if (that.autoClose) that.destroy();
                that.emit('error', err);
            } else {
                that.fd = fd;
                that.emit('open', fd);
                that.read();
            }
        });
    }
    function WriteStream(path, options) {
        if (_instanceof(this, WriteStream)) return fs$WriteStream.apply(this, arguments), this;
        else return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
    }
    function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
            if (err) {
                that.destroy();
                that.emit('error', err);
            } else {
                that.fd = fd;
                that.emit('open', fd);
            }
        });
    }
    function createReadStream(path, options) {
        return new fs.ReadStream(path, options);
    }
    function createWriteStream(path, options) {
        return new fs.WriteStream(path, options);
    }
    var fs$open = fs.open;
    fs.open = open;
    function open(path, flags, mode, cb) {
        if (typeof mode === 'function') cb = mode, mode = null;
        return go$open(path, flags, mode, cb);
        function go$open(path, flags, mode, cb, startTime) {
            return fs$open(path, flags, mode, function(err, fd) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) enqueue([
                    go$open,
                    [
                        path,
                        flags,
                        mode,
                        cb
                    ],
                    err,
                    startTime || Date.now(),
                    Date.now()
                ]);
                else {
                    if (typeof cb === 'function') cb.apply(this, arguments);
                }
            });
        }
    }
    return fs;
}
function enqueue(elem) {
    debug('ENQUEUE', elem[0].name, elem[1]);
    fs$h[gracefulQueue].push(elem);
    retry();
}
// keep track of the timeout between retry() calls
var retryTimer;
// reset the startTime and lastTime to now
// this resets the start of the 60 second overall timeout as well as the
// delay between attempts so that we'll retry these jobs sooner
function resetQueue() {
    var now = Date.now();
    for(var i = 0; i < fs$h[gracefulQueue].length; ++i){
        // entries that are only a length of 2 are from an older version, don't
        // bother modifying those since they'll be retried anyway.
        if (fs$h[gracefulQueue][i].length > 2) {
            fs$h[gracefulQueue][i][3] = now // startTime
            ;
            fs$h[gracefulQueue][i][4] = now // lastTime
            ;
        }
    }
    // call retry to make sure we're actively processing the queue
    retry();
}
function retry() {
    // clear the timer and remove it to help prevent unintended concurrency
    clearTimeout(retryTimer);
    retryTimer = undefined;
    if (fs$h[gracefulQueue].length === 0) return;
    var elem = fs$h[gracefulQueue].shift();
    var fn = elem[0];
    var args = elem[1];
    // these items may be unset if they were added by an older graceful-fs
    var err = elem[2];
    var startTime = elem[3];
    var lastTime = elem[4];
    // if we don't have a startTime we have no way of knowing if we've waited
    // long enough, so go ahead and retry this item now
    if (startTime === undefined) {
        debug('RETRY', fn.name, args);
        fn.apply(null, args);
    } else if (Date.now() - startTime >= 60000) {
        // it's been more than 60 seconds total, bail now
        debug('TIMEOUT', fn.name, args);
        var cb = args.pop();
        if (typeof cb === 'function') cb.call(null, err);
    } else {
        // the amount of time between the last attempt and right now
        var sinceAttempt = Date.now() - lastTime;
        // the amount of time between when we first tried, and when we last tried
        // rounded up to at least 1
        var sinceStart = Math.max(lastTime - startTime, 1);
        // backoff. wait longer than the total time we've been retrying, but only
        // up to a maximum of 100ms
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        // it's been long enough since the last retry, do it again
        if (sinceAttempt >= desiredDelay) {
            debug('RETRY', fn.name, args);
            fn.apply(null, args.concat([
                startTime
            ]));
        } else {
            // if we can't do this job yet, push it to the end of the queue
            // and let the next iteration check again
            fs$h[gracefulQueue].push(elem);
        }
    }
    // schedule our next run if one isn't already scheduled
    if (retryTimer === undefined) {
        retryTimer = setTimeout(retry, 0);
    }
}

(function (exports) {
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
// This is adapted from https://github.com/normalize/mz
// Copyright (c) 2014-2016 Jonathan Ong me@jongleberry.com and Contributors
var u = universalify$1.fromCallback;
var fs = gracefulFs;
var api = [
    'access',
    'appendFile',
    'chmod',
    'chown',
    'close',
    'copyFile',
    'fchmod',
    'fchown',
    'fdatasync',
    'fstat',
    'fsync',
    'ftruncate',
    'futimes',
    'lchmod',
    'lchown',
    'link',
    'lstat',
    'mkdir',
    'mkdtemp',
    'open',
    'opendir',
    'readdir',
    'readFile',
    'readlink',
    'realpath',
    'rename',
    'rm',
    'rmdir',
    'stat',
    'symlink',
    'truncate',
    'unlink',
    'utimes',
    'writeFile'
].filter(function(key) {
    // Some commands are not available on some systems. Ex:
    // fs.opendir was added in Node.js v12.12.0
    // fs.rm was added in Node.js v14.14.0
    // fs.lchown is not available on at least some Linux
    return typeof fs[key] === 'function';
});
// Export all keys:
Object.keys(fs).forEach(function(key) {
    if (key === 'promises') {
        // fs.promises is a getter property that triggers ExperimentalWarning
        // Don't re-export it here, the getter is defined in "lib/index.js"
        return;
    }
    exports[key] = fs[key];
});
// Universalify async methods:
api.forEach(function(method) {
    exports[method] = u(fs[method]);
});
// We differ from mz/fs in that we still ship the old, broken, fs.exists()
// since we are a drop-in replacement for the native module
exports.exists = function(filename, callback) {
    if (typeof callback === 'function') {
        return fs.exists(filename, callback);
    }
    return new Promise(function(resolve) {
        return fs.exists(filename, resolve);
    });
};
// fs.read(), fs.write(), & fs.writev() need special treatment due to multiple callback args
exports.read = function(fd, buffer, offset, length, position, callback) {
    if (typeof callback === 'function') {
        return fs.read(fd, buffer, offset, length, position, callback);
    }
    return new Promise(function(resolve, reject) {
        fs.read(fd, buffer, offset, length, position, function(err, bytesRead, buffer) {
            if (err) return reject(err);
            resolve({
                bytesRead: bytesRead,
                buffer: buffer
            });
        });
    });
};
// Function signature can be
// fs.write(fd, buffer[, offset[, length[, position]]], callback)
// OR
// fs.write(fd, string[, position[, encoding]], callback)
// We need to handle both cases, so we use ...args
exports.write = function(fd, buffer) {
    for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        args[_key - 2] = arguments[_key];
    }
    if (typeof args[args.length - 1] === 'function') {
        var _fs;
        return (_fs = fs).write.apply(_fs, [
            fd,
            buffer
        ].concat(_to_consumable_array(args)));
    }
    return new Promise(function(resolve, reject) {
        var _fs;
        (_fs = fs).write.apply(_fs, [
            fd,
            buffer
        ].concat(_to_consumable_array(args), [
            function(err, bytesWritten, buffer) {
                if (err) return reject(err);
                resolve({
                    bytesWritten: bytesWritten,
                    buffer: buffer
                });
            }
        ]));
    });
};
// fs.writev only available in Node v12.9.0+
if (typeof fs.writev === 'function') {
    // Function signature is
    // s.writev(fd, buffers[, position], callback)
    // We need to handle the optional arg, so we use ...args
    exports.writev = function(fd, buffers) {
        for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
            args[_key - 2] = arguments[_key];
        }
        if (typeof args[args.length - 1] === 'function') {
            var _fs;
            return (_fs = fs).writev.apply(_fs, [
                fd,
                buffers
            ].concat(_to_consumable_array(args)));
        }
        return new Promise(function(resolve, reject) {
            var _fs;
            (_fs = fs).writev.apply(_fs, [
                fd,
                buffers
            ].concat(_to_consumable_array(args), [
                function(err, bytesWritten, buffers) {
                    if (err) return reject(err);
                    resolve({
                        bytesWritten: bytesWritten,
                        buffers: buffers
                    });
                }
            ]));
        });
    };
}
// fs.realpath.native only available in Node v9.2+
if (typeof fs.realpath.native === 'function') {
    exports.realpath.native = u(fs.realpath.native);
}
}(fs$i));

var makeDir$1 = {};

var atLeastNode$2 = function(r) {
    var n = process.versions.node.split('.').map(function(x) {
        return parseInt(x, 10);
    });
    r = r.split('.').map(function(x) {
        return parseInt(x, 10);
    });
    return n[0] > r[0] || n[0] === r[0] && (n[1] > r[1] || n[1] === r[1] && n[2] >= r[2]);
};

function asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, key, arg) {
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
function _async_to_generator$2(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property$1(obj, key, value) {
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
            _define_property$1(target, key, source[key]);
        });
    }
    return target;
}
function _ts_generator$2(thisArg, body) {
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
var fs$g = fs$i;
var path$c = require$$1__default["default"];
var atLeastNode$1 = atLeastNode$2;
var useNativeRecursiveOption = atLeastNode$1('10.12.0');
// https://github.com/nodejs/node/issues/8987
// https://github.com/libuv/libuv/pull/1088
var checkPath = function(pth) {
    if (process.platform === 'win32') {
        var pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path$c.parse(pth).root, ''));
        if (pathHasInvalidWinCharacters) {
            var error = new Error("Path contains invalid characters: ".concat(pth));
            error.code = 'EINVAL';
            throw error;
        }
    }
};
var processOptions = function(options) {
    var defaults = {
        mode: 511
    };
    if (typeof options === 'number') options = {
        mode: options
    };
    return _object_spread({}, defaults, options);
};
var permissionError = function(pth) {
    // This replicates the exception of `fs.mkdir` with native the
    // `recusive` option when run on an invalid drive under Windows.
    var error = new Error("operation not permitted, mkdir '".concat(pth, "'"));
    error.code = 'EPERM';
    error.errno = -4048;
    error.path = pth;
    error.syscall = 'mkdir';
    return error;
};
makeDir$1.makeDir = function() {
    var _ref = _async_to_generator$2(function(input, options) {
        var pth, make;
        return _ts_generator$2(this, function(_state) {
            checkPath(input);
            options = processOptions(options);
            if (useNativeRecursiveOption) {
                pth = path$c.resolve(input);
                return [
                    2,
                    fs$g.mkdir(pth, {
                        mode: options.mode,
                        recursive: true
                    })
                ];
            }
            make = function() {
                var _ref = _async_to_generator$2(function(pth) {
                    var error, stats;
                    return _ts_generator$2(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    8
                                ]);
                                return [
                                    4,
                                    fs$g.mkdir(pth, options.mode)
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    3,
                                    8
                                ];
                            case 2:
                                error = _state.sent();
                                if (error.code === 'EPERM') {
                                    throw error;
                                }
                                if (!(error.code === 'ENOENT')) return [
                                    3,
                                    4
                                ];
                                if (path$c.dirname(pth) === pth) {
                                    throw permissionError(pth);
                                }
                                if (error.message.includes('null bytes')) {
                                    throw error;
                                }
                                return [
                                    4,
                                    make(path$c.dirname(pth))
                                ];
                            case 3:
                                _state.sent();
                                return [
                                    2,
                                    make(pth)
                                ];
                            case 4:
                                _state.trys.push([
                                    4,
                                    6,
                                    ,
                                    7
                                ]);
                                return [
                                    4,
                                    fs$g.stat(pth)
                                ];
                            case 5:
                                stats = _state.sent();
                                if (!stats.isDirectory()) {
                                    // This error is never exposed to the user
                                    // it is caught below, and the original error is thrown
                                    throw new Error('The path is not a directory');
                                }
                                return [
                                    3,
                                    7
                                ];
                            case 6:
                                _state.sent();
                                throw error;
                            case 7:
                                return [
                                    3,
                                    8
                                ];
                            case 8:
                                return [
                                    2
                                ];
                        }
                    });
                });
                return function make(pth) {
                    return _ref.apply(this, arguments);
                };
            }();
            return [
                2,
                make(path$c.resolve(input))
            ];
        });
    });
    return function(input, options) {
        return _ref.apply(this, arguments);
    };
}();
makeDir$1.makeDirSync = function(input, options) {
    checkPath(input);
    options = processOptions(options);
    if (useNativeRecursiveOption) {
        var pth = path$c.resolve(input);
        return fs$g.mkdirSync(pth, {
            mode: options.mode,
            recursive: true
        });
    }
    var make = function(pth) {
        try {
            fs$g.mkdirSync(pth, options.mode);
        } catch (error) {
            if (error.code === 'EPERM') {
                throw error;
            }
            if (error.code === 'ENOENT') {
                if (path$c.dirname(pth) === pth) {
                    throw permissionError(pth);
                }
                if (error.message.includes('null bytes')) {
                    throw error;
                }
                make(path$c.dirname(pth));
                return make(pth);
            }
            try {
                if (!fs$g.statSync(pth).isDirectory()) {
                    // This error is never exposed to the user
                    // it is caught below, and the original error is thrown
                    throw new Error('The path is not a directory');
                }
            } catch (e) {
                throw error;
            }
        }
    };
    return make(path$c.resolve(input));
};

var u$a = universalify$1.fromPromise;
var _require$2 = makeDir$1, _makeDir = _require$2.makeDir, makeDirSync = _require$2.makeDirSync;
var makeDir = u$a(_makeDir);
var mkdirs$2 = {
    mkdirs: makeDir,
    mkdirsSync: makeDirSync,
    // alias
    mkdirp: makeDir,
    mkdirpSync: makeDirSync,
    ensureDir: makeDir,
    ensureDirSync: makeDirSync
};

var fs$f = gracefulFs;
function utimesMillis$1(path, atime, mtime, callback) {
    // if (!HAS_MILLIS_RES) return fs.utimes(path, atime, mtime, callback)
    fs$f.open(path, 'r+', function(err, fd) {
        if (err) return callback(err);
        fs$f.futimes(fd, atime, mtime, function(futimesErr) {
            fs$f.close(fd, function(closeErr) {
                if (callback) callback(futimesErr || closeErr);
            });
        });
    });
}
function utimesMillisSync$1(path, atime, mtime) {
    var fd = fs$f.openSync(path, 'r+');
    fs$f.futimesSync(fd, atime, mtime);
    return fs$f.closeSync(fd);
}
var utimes = {
    utimesMillis: utimesMillis$1,
    utimesMillisSync: utimesMillisSync$1
};

function _array_like_to_array$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
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
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array$1(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$1(o, minLen);
}
var fs$e = fs$i;
var path$b = require$$1__default["default"];
var util = require$$4__default["default"];
var atLeastNode = atLeastNode$2;
var nodeSupportsBigInt = atLeastNode('10.5.0');
var stat$4 = function(file) {
    return nodeSupportsBigInt ? fs$e.stat(file, {
        bigint: true
    }) : fs$e.stat(file);
};
var statSync = function(file) {
    return nodeSupportsBigInt ? fs$e.statSync(file, {
        bigint: true
    }) : fs$e.statSync(file);
};
function getStats$2(src, dest) {
    return Promise.all([
        stat$4(src),
        stat$4(dest).catch(function(err) {
            if (err.code === 'ENOENT') return null;
            throw err;
        })
    ]).then(function(param) {
        var _param = _sliced_to_array(param, 2), srcStat = _param[0], destStat = _param[1];
        return {
            srcStat: srcStat,
            destStat: destStat
        };
    });
}
function getStatsSync(src, dest) {
    var destStat;
    var srcStat = statSync(src);
    try {
        destStat = statSync(dest);
    } catch (err) {
        if (err.code === 'ENOENT') return {
            srcStat: srcStat,
            destStat: null
        };
        throw err;
    }
    return {
        srcStat: srcStat,
        destStat: destStat
    };
}
function checkPaths(src, dest, funcName, cb) {
    util.callbackify(getStats$2)(src, dest, function(err, stats) {
        if (err) return cb(err);
        var srcStat = stats.srcStat, destStat = stats.destStat;
        if (destStat && areIdentical(srcStat, destStat)) {
            return cb(new Error('Source and destination must not be the same.'));
        }
        if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
            return cb(new Error(errMsg(src, dest, funcName)));
        }
        return cb(null, {
            srcStat: srcStat,
            destStat: destStat
        });
    });
}
function checkPathsSync(src, dest, funcName) {
    var _getStatsSync = getStatsSync(src, dest), srcStat = _getStatsSync.srcStat, destStat = _getStatsSync.destStat;
    if (destStat && areIdentical(srcStat, destStat)) {
        throw new Error('Source and destination must not be the same.');
    }
    if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
    }
    return {
        srcStat: srcStat,
        destStat: destStat
    };
}
// recursively check if dest parent is a subdirectory of src.
// It works for all file types including symlinks since it
// checks the src and dest inodes. It starts from the deepest
// parent and stops once it reaches the src parent or the root path.
function checkParentPaths(src, srcStat, dest, funcName, cb) {
    var srcParent = path$b.resolve(path$b.dirname(src));
    var destParent = path$b.resolve(path$b.dirname(dest));
    if (destParent === srcParent || destParent === path$b.parse(destParent).root) return cb();
    var callback = function(err, destStat) {
        if (err) {
            if (err.code === 'ENOENT') return cb();
            return cb(err);
        }
        if (areIdentical(srcStat, destStat)) {
            return cb(new Error(errMsg(src, dest, funcName)));
        }
        return checkParentPaths(src, srcStat, destParent, funcName, cb);
    };
    if (nodeSupportsBigInt) fs$e.stat(destParent, {
        bigint: true
    }, callback);
    else fs$e.stat(destParent, callback);
}
function checkParentPathsSync(src, srcStat, dest, funcName) {
    var srcParent = path$b.resolve(path$b.dirname(src));
    var destParent = path$b.resolve(path$b.dirname(dest));
    if (destParent === srcParent || destParent === path$b.parse(destParent).root) return;
    var destStat;
    try {
        destStat = statSync(destParent);
    } catch (err) {
        if (err.code === 'ENOENT') return;
        throw err;
    }
    if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
    }
    return checkParentPathsSync(src, srcStat, destParent, funcName);
}
function areIdentical(srcStat, destStat) {
    if (destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev) {
        if (nodeSupportsBigInt || destStat.ino < Number.MAX_SAFE_INTEGER) {
            // definitive answer
            return true;
        }
        // Use additional heuristics if we can't use 'bigint'.
        // Different 'ino' could be represented the same if they are >= Number.MAX_SAFE_INTEGER
        // See issue 657
        if (destStat.size === srcStat.size && destStat.mode === srcStat.mode && destStat.nlink === srcStat.nlink && destStat.atimeMs === srcStat.atimeMs && destStat.mtimeMs === srcStat.mtimeMs && destStat.ctimeMs === srcStat.ctimeMs && destStat.birthtimeMs === srcStat.birthtimeMs) {
            // heuristic answer
            return true;
        }
    }
    return false;
}
// return true if dest is a subdir of src, otherwise false.
// It only checks the path strings.
function isSrcSubdir(src, dest) {
    var srcArr = path$b.resolve(src).split(path$b.sep).filter(function(i) {
        return i;
    });
    var destArr = path$b.resolve(dest).split(path$b.sep).filter(function(i) {
        return i;
    });
    return srcArr.reduce(function(acc, cur, i) {
        return acc && destArr[i] === cur;
    }, true);
}
function errMsg(src, dest, funcName) {
    return "Cannot ".concat(funcName, " '").concat(src, "' to a subdirectory of itself, '").concat(dest, "'.");
}
var stat_1 = {
    checkPaths: checkPaths,
    checkPathsSync: checkPathsSync,
    checkParentPaths: checkParentPaths,
    checkParentPathsSync: checkParentPathsSync,
    isSrcSubdir: isSrcSubdir
};

var fs$d = gracefulFs;
var path$a = require$$1__default["default"];
var mkdirsSync$1 = mkdirs$2.mkdirsSync;
var utimesMillisSync = utimes.utimesMillisSync;
var stat$3 = stat_1;
function copySync$2(src, dest, opts) {
    if (typeof opts === 'function') {
        opts = {
            filter: opts
        };
    }
    opts = opts || {};
    opts.clobber = 'clobber' in opts ? !!opts.clobber : true // default to true for now
    ;
    opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber // overwrite falls back to clobber
    ;
    // Warn about using preserveTimestamps on 32-bit node
    if (opts.preserveTimestamps && process.arch === 'ia32') {
        console.warn("fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n\n    see https://github.com/jprichardson/node-fs-extra/issues/269");
    }
    var _stat_checkPathsSync = stat$3.checkPathsSync(src, dest, 'copy'), srcStat = _stat_checkPathsSync.srcStat, destStat = _stat_checkPathsSync.destStat;
    stat$3.checkParentPathsSync(src, srcStat, dest, 'copy');
    return handleFilterAndCopy(destStat, src, dest, opts);
}
function handleFilterAndCopy(destStat, src, dest, opts) {
    if (opts.filter && !opts.filter(src, dest)) return;
    var destParent = path$a.dirname(dest);
    if (!fs$d.existsSync(destParent)) mkdirsSync$1(destParent);
    return startCopy$1(destStat, src, dest, opts);
}
function startCopy$1(destStat, src, dest, opts) {
    if (opts.filter && !opts.filter(src, dest)) return;
    return getStats$1(destStat, src, dest, opts);
}
function getStats$1(destStat, src, dest, opts) {
    var statSync = opts.dereference ? fs$d.statSync : fs$d.lstatSync;
    var srcStat = statSync(src);
    if (srcStat.isDirectory()) return onDir$1(srcStat, destStat, src, dest, opts);
    else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile$1(srcStat, destStat, src, dest, opts);
    else if (srcStat.isSymbolicLink()) return onLink$1(destStat, src, dest, opts);
}
function onFile$1(srcStat, destStat, src, dest, opts) {
    if (!destStat) return copyFile$1(srcStat, src, dest, opts);
    return mayCopyFile$1(srcStat, src, dest, opts);
}
function mayCopyFile$1(srcStat, src, dest, opts) {
    if (opts.overwrite) {
        fs$d.unlinkSync(dest);
        return copyFile$1(srcStat, src, dest, opts);
    } else if (opts.errorOnExist) {
        throw new Error("'".concat(dest, "' already exists"));
    }
}
function copyFile$1(srcStat, src, dest, opts) {
    fs$d.copyFileSync(src, dest);
    if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest);
    return setDestMode$1(dest, srcStat.mode);
}
function handleTimestamps(srcMode, src, dest) {
    // Make sure the file is writable before setting the timestamp
    // otherwise open fails with EPERM when invoked with 'r+'
    // (through utimes call)
    if (fileIsNotWritable$1(srcMode)) makeFileWritable$1(dest, srcMode);
    return setDestTimestamps$1(src, dest);
}
function fileIsNotWritable$1(srcMode) {
    return (srcMode & 128) === 0;
}
function makeFileWritable$1(dest, srcMode) {
    return setDestMode$1(dest, srcMode | 128);
}
function setDestMode$1(dest, srcMode) {
    return fs$d.chmodSync(dest, srcMode);
}
function setDestTimestamps$1(src, dest) {
    // The initial srcStat.atime cannot be trusted
    // because it is modified by the read(2) system call
    // (See https://nodejs.org/api/fs.html#fs_stat_time_values)
    var updatedSrcStat = fs$d.statSync(src);
    return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
}
function onDir$1(srcStat, destStat, src, dest, opts) {
    if (!destStat) return mkDirAndCopy$1(srcStat.mode, src, dest, opts);
    if (destStat && !destStat.isDirectory()) {
        throw new Error("Cannot overwrite non-directory '".concat(dest, "' with directory '").concat(src, "'."));
    }
    return copyDir$1(src, dest, opts);
}
function mkDirAndCopy$1(srcMode, src, dest, opts) {
    fs$d.mkdirSync(dest);
    copyDir$1(src, dest, opts);
    return setDestMode$1(dest, srcMode);
}
function copyDir$1(src, dest, opts) {
    fs$d.readdirSync(src).forEach(function(item) {
        return copyDirItem$1(item, src, dest, opts);
    });
}
function copyDirItem$1(item, src, dest, opts) {
    var srcItem = path$a.join(src, item);
    var destItem = path$a.join(dest, item);
    var destStat = stat$3.checkPathsSync(srcItem, destItem, 'copy').destStat;
    return startCopy$1(destStat, srcItem, destItem, opts);
}
function onLink$1(destStat, src, dest, opts) {
    var resolvedSrc = fs$d.readlinkSync(src);
    if (opts.dereference) {
        resolvedSrc = path$a.resolve(process.cwd(), resolvedSrc);
    }
    if (!destStat) {
        return fs$d.symlinkSync(resolvedSrc, dest);
    } else {
        var resolvedDest;
        try {
            resolvedDest = fs$d.readlinkSync(dest);
        } catch (err) {
            // dest exists and is a regular file or directory,
            // Windows may throw UNKNOWN error. If dest already exists,
            // fs throws error anyway, so no need to guard against it here.
            if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return fs$d.symlinkSync(resolvedSrc, dest);
            throw err;
        }
        if (opts.dereference) {
            resolvedDest = path$a.resolve(process.cwd(), resolvedDest);
        }
        if (stat$3.isSrcSubdir(resolvedSrc, resolvedDest)) {
            throw new Error("Cannot copy '".concat(resolvedSrc, "' to a subdirectory of itself, '").concat(resolvedDest, "'."));
        }
        // prevent copy if src is a subdir of dest since unlinking
        // dest in this case would result in removing src contents
        // and therefore a broken symlink would be created.
        if (fs$d.statSync(dest).isDirectory() && stat$3.isSrcSubdir(resolvedDest, resolvedSrc)) {
            throw new Error("Cannot overwrite '".concat(resolvedDest, "' with '").concat(resolvedSrc, "'."));
        }
        return copyLink$1(resolvedSrc, dest);
    }
}
function copyLink$1(resolvedSrc, dest) {
    fs$d.unlinkSync(dest);
    return fs$d.symlinkSync(resolvedSrc, dest);
}
var copySync_1 = copySync$2;

var copySync$1 = {
    copySync: copySync_1
};

var u$9 = universalify$1.fromPromise;
var fs$c = fs$i;
function pathExists$6(path) {
    return fs$c.access(path).then(function() {
        return true;
    }).catch(function() {
        return false;
    });
}
var pathExists_1 = {
    pathExists: u$9(pathExists$6),
    pathExistsSync: fs$c.existsSync
};

var fs$b = gracefulFs;
var path$9 = require$$1__default["default"];
var mkdirs$1 = mkdirs$2.mkdirs;
var pathExists$5 = pathExists_1.pathExists;
var utimesMillis = utimes.utimesMillis;
var stat$2 = stat_1;
function copy$2(src, dest, opts, cb) {
    if (typeof opts === 'function' && !cb) {
        cb = opts;
        opts = {};
    } else if (typeof opts === 'function') {
        opts = {
            filter: opts
        };
    }
    cb = cb || function() {};
    opts = opts || {};
    opts.clobber = 'clobber' in opts ? !!opts.clobber : true // default to true for now
    ;
    opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber // overwrite falls back to clobber
    ;
    // Warn about using preserveTimestamps on 32-bit node
    if (opts.preserveTimestamps && process.arch === 'ia32') {
        console.warn("fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n\n    see https://github.com/jprichardson/node-fs-extra/issues/269");
    }
    stat$2.checkPaths(src, dest, 'copy', function(err, stats) {
        if (err) return cb(err);
        var srcStat = stats.srcStat, destStat = stats.destStat;
        stat$2.checkParentPaths(src, srcStat, dest, 'copy', function(err) {
            if (err) return cb(err);
            if (opts.filter) return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
            return checkParentDir(destStat, src, dest, opts, cb);
        });
    });
}
function checkParentDir(destStat, src, dest, opts, cb) {
    var destParent = path$9.dirname(dest);
    pathExists$5(destParent, function(err, dirExists) {
        if (err) return cb(err);
        if (dirExists) return startCopy(destStat, src, dest, opts, cb);
        mkdirs$1(destParent, function(err) {
            if (err) return cb(err);
            return startCopy(destStat, src, dest, opts, cb);
        });
    });
}
function handleFilter(onInclude, destStat, src, dest, opts, cb) {
    Promise.resolve(opts.filter(src, dest)).then(function(include) {
        if (include) return onInclude(destStat, src, dest, opts, cb);
        return cb();
    }, function(error) {
        return cb(error);
    });
}
function startCopy(destStat, src, dest, opts, cb) {
    if (opts.filter) return handleFilter(getStats, destStat, src, dest, opts, cb);
    return getStats(destStat, src, dest, opts, cb);
}
function getStats(destStat, src, dest, opts, cb) {
    var stat = opts.dereference ? fs$b.stat : fs$b.lstat;
    stat(src, function(err, srcStat) {
        if (err) return cb(err);
        if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts, cb);
    });
}
function onFile(srcStat, destStat, src, dest, opts, cb) {
    if (!destStat) return copyFile(srcStat, src, dest, opts, cb);
    return mayCopyFile(srcStat, src, dest, opts, cb);
}
function mayCopyFile(srcStat, src, dest, opts, cb) {
    if (opts.overwrite) {
        fs$b.unlink(dest, function(err) {
            if (err) return cb(err);
            return copyFile(srcStat, src, dest, opts, cb);
        });
    } else if (opts.errorOnExist) {
        return cb(new Error("'".concat(dest, "' already exists")));
    } else return cb();
}
function copyFile(srcStat, src, dest, opts, cb) {
    fs$b.copyFile(src, dest, function(err) {
        if (err) return cb(err);
        if (opts.preserveTimestamps) return handleTimestampsAndMode(srcStat.mode, src, dest, cb);
        return setDestMode(dest, srcStat.mode, cb);
    });
}
function handleTimestampsAndMode(srcMode, src, dest, cb) {
    // Make sure the file is writable before setting the timestamp
    // otherwise open fails with EPERM when invoked with 'r+'
    // (through utimes call)
    if (fileIsNotWritable(srcMode)) {
        return makeFileWritable(dest, srcMode, function(err) {
            if (err) return cb(err);
            return setDestTimestampsAndMode(srcMode, src, dest, cb);
        });
    }
    return setDestTimestampsAndMode(srcMode, src, dest, cb);
}
function fileIsNotWritable(srcMode) {
    return (srcMode & 128) === 0;
}
function makeFileWritable(dest, srcMode, cb) {
    return setDestMode(dest, srcMode | 128, cb);
}
function setDestTimestampsAndMode(srcMode, src, dest, cb) {
    setDestTimestamps(src, dest, function(err) {
        if (err) return cb(err);
        return setDestMode(dest, srcMode, cb);
    });
}
function setDestMode(dest, srcMode, cb) {
    return fs$b.chmod(dest, srcMode, cb);
}
function setDestTimestamps(src, dest, cb) {
    // The initial srcStat.atime cannot be trusted
    // because it is modified by the read(2) system call
    // (See https://nodejs.org/api/fs.html#fs_stat_time_values)
    fs$b.stat(src, function(err, updatedSrcStat) {
        if (err) return cb(err);
        return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
    });
}
function onDir(srcStat, destStat, src, dest, opts, cb) {
    if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts, cb);
    if (destStat && !destStat.isDirectory()) {
        return cb(new Error("Cannot overwrite non-directory '".concat(dest, "' with directory '").concat(src, "'.")));
    }
    return copyDir(src, dest, opts, cb);
}
function mkDirAndCopy(srcMode, src, dest, opts, cb) {
    fs$b.mkdir(dest, function(err) {
        if (err) return cb(err);
        copyDir(src, dest, opts, function(err) {
            if (err) return cb(err);
            return setDestMode(dest, srcMode, cb);
        });
    });
}
function copyDir(src, dest, opts, cb) {
    fs$b.readdir(src, function(err, items) {
        if (err) return cb(err);
        return copyDirItems(items, src, dest, opts, cb);
    });
}
function copyDirItems(items, src, dest, opts, cb) {
    var item = items.pop();
    if (!item) return cb();
    return copyDirItem(items, item, src, dest, opts, cb);
}
function copyDirItem(items, item, src, dest, opts, cb) {
    var srcItem = path$9.join(src, item);
    var destItem = path$9.join(dest, item);
    stat$2.checkPaths(srcItem, destItem, 'copy', function(err, stats) {
        if (err) return cb(err);
        var destStat = stats.destStat;
        startCopy(destStat, srcItem, destItem, opts, function(err) {
            if (err) return cb(err);
            return copyDirItems(items, src, dest, opts, cb);
        });
    });
}
function onLink(destStat, src, dest, opts, cb) {
    fs$b.readlink(src, function(err, resolvedSrc) {
        if (err) return cb(err);
        if (opts.dereference) {
            resolvedSrc = path$9.resolve(process.cwd(), resolvedSrc);
        }
        if (!destStat) {
            return fs$b.symlink(resolvedSrc, dest, cb);
        } else {
            fs$b.readlink(dest, function(err, resolvedDest) {
                if (err) {
                    // dest exists and is a regular file or directory,
                    // Windows may throw UNKNOWN error. If dest already exists,
                    // fs throws error anyway, so no need to guard against it here.
                    if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return fs$b.symlink(resolvedSrc, dest, cb);
                    return cb(err);
                }
                if (opts.dereference) {
                    resolvedDest = path$9.resolve(process.cwd(), resolvedDest);
                }
                if (stat$2.isSrcSubdir(resolvedSrc, resolvedDest)) {
                    return cb(new Error("Cannot copy '".concat(resolvedSrc, "' to a subdirectory of itself, '").concat(resolvedDest, "'.")));
                }
                // do not copy if src is a subdir of dest since unlinking
                // dest in this case would result in removing src contents
                // and therefore a broken symlink would be created.
                if (destStat.isDirectory() && stat$2.isSrcSubdir(resolvedDest, resolvedSrc)) {
                    return cb(new Error("Cannot overwrite '".concat(resolvedDest, "' with '").concat(resolvedSrc, "'.")));
                }
                return copyLink(resolvedSrc, dest, cb);
            });
        }
    });
}
function copyLink(resolvedSrc, dest, cb) {
    fs$b.unlink(dest, function(err) {
        if (err) return cb(err);
        return fs$b.symlink(resolvedSrc, dest, cb);
    });
}
var copy_1 = copy$2;

var u$8 = universalify$1.fromCallback;
var copy$1 = {
    copy: u$8(copy_1)
};

function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var fs$a = gracefulFs;
var path$8 = require$$1__default["default"];
var assert = require$$5__default["default"];
var isWindows = process.platform === 'win32';
function defaults(options) {
    var methods = [
        'unlink',
        'chmod',
        'stat',
        'lstat',
        'rmdir',
        'readdir'
    ];
    methods.forEach(function(m) {
        options[m] = options[m] || fs$a[m];
        m = m + 'Sync';
        options[m] = options[m] || fs$a[m];
    });
    options.maxBusyTries = options.maxBusyTries || 3;
}
function rimraf$1(p, options, cb) {
    var busyTries = 0;
    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    assert(p, 'rimraf: missing path');
    assert.strictEqual(typeof p === "undefined" ? "undefined" : _type_of(p), 'string', 'rimraf: path should be a string');
    assert.strictEqual(typeof cb === "undefined" ? "undefined" : _type_of(cb), 'function', 'rimraf: callback function required');
    assert(options, 'rimraf: invalid options argument provided');
    assert.strictEqual(typeof options === "undefined" ? "undefined" : _type_of(options), 'object', 'rimraf: options should be object');
    defaults(options);
    rimraf_(p, options, function CB(er) {
        if (er) {
            if ((er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') && busyTries < options.maxBusyTries) {
                busyTries++;
                var time = busyTries * 100;
                // try again, with the same exact callback as this one.
                return setTimeout(function() {
                    return rimraf_(p, options, CB);
                }, time);
            }
            // already gone
            if (er.code === 'ENOENT') er = null;
        }
        cb(er);
    });
}
// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function rimraf_(p, options, cb) {
    assert(p);
    assert(options);
    assert(typeof cb === 'function');
    // sunos lets the root user unlink directories, which is... weird.
    // so we have to lstat here and make sure it's not a dir.
    options.lstat(p, function(er, st) {
        if (er && er.code === 'ENOENT') {
            return cb(null);
        }
        // Windows can EPERM on stat.  Life is suffering.
        if (er && er.code === 'EPERM' && isWindows) {
            return fixWinEPERM(p, options, er, cb);
        }
        if (st && st.isDirectory()) {
            return rmdir(p, options, er, cb);
        }
        options.unlink(p, function(er) {
            if (er) {
                if (er.code === 'ENOENT') {
                    return cb(null);
                }
                if (er.code === 'EPERM') {
                    return isWindows ? fixWinEPERM(p, options, er, cb) : rmdir(p, options, er, cb);
                }
                if (er.code === 'EISDIR') {
                    return rmdir(p, options, er, cb);
                }
            }
            return cb(er);
        });
    });
}
function fixWinEPERM(p, options, er, cb) {
    assert(p);
    assert(options);
    assert(typeof cb === 'function');
    options.chmod(p, 438, function(er2) {
        if (er2) {
            cb(er2.code === 'ENOENT' ? null : er);
        } else {
            options.stat(p, function(er3, stats) {
                if (er3) {
                    cb(er3.code === 'ENOENT' ? null : er);
                } else if (stats.isDirectory()) {
                    rmdir(p, options, er, cb);
                } else {
                    options.unlink(p, cb);
                }
            });
        }
    });
}
function fixWinEPERMSync(p, options, er) {
    var stats;
    assert(p);
    assert(options);
    try {
        options.chmodSync(p, 438);
    } catch (er2) {
        if (er2.code === 'ENOENT') {
            return;
        } else {
            throw er;
        }
    }
    try {
        stats = options.statSync(p);
    } catch (er3) {
        if (er3.code === 'ENOENT') {
            return;
        } else {
            throw er;
        }
    }
    if (stats.isDirectory()) {
        rmdirSync(p, options, er);
    } else {
        options.unlinkSync(p);
    }
}
function rmdir(p, options, originalEr, cb) {
    assert(p);
    assert(options);
    assert(typeof cb === 'function');
    // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
    // if we guessed wrong, and it's not a directory, then
    // raise the original error.
    options.rmdir(p, function(er) {
        if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) {
            rmkids(p, options, cb);
        } else if (er && er.code === 'ENOTDIR') {
            cb(originalEr);
        } else {
            cb(er);
        }
    });
}
function rmkids(p, options, cb) {
    assert(p);
    assert(options);
    assert(typeof cb === 'function');
    options.readdir(p, function(er, files) {
        if (er) return cb(er);
        var n = files.length;
        var errState;
        if (n === 0) return options.rmdir(p, cb);
        files.forEach(function(f) {
            rimraf$1(path$8.join(p, f), options, function(er) {
                if (errState) {
                    return;
                }
                if (er) return cb(errState = er);
                if (--n === 0) {
                    options.rmdir(p, cb);
                }
            });
        });
    });
}
// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
function rimrafSync(p, options) {
    var st;
    options = options || {};
    defaults(options);
    assert(p, 'rimraf: missing path');
    assert.strictEqual(typeof p === "undefined" ? "undefined" : _type_of(p), 'string', 'rimraf: path should be a string');
    assert(options, 'rimraf: missing options');
    assert.strictEqual(typeof options === "undefined" ? "undefined" : _type_of(options), 'object', 'rimraf: options should be object');
    try {
        st = options.lstatSync(p);
    } catch (er) {
        if (er.code === 'ENOENT') {
            return;
        }
        // Windows can EPERM on stat.  Life is suffering.
        if (er.code === 'EPERM' && isWindows) {
            fixWinEPERMSync(p, options, er);
        }
    }
    try {
        // sunos lets the root user unlink directories, which is... weird.
        if (st && st.isDirectory()) {
            rmdirSync(p, options, null);
        } else {
            options.unlinkSync(p);
        }
    } catch (er) {
        if (er.code === 'ENOENT') {
            return;
        } else if (er.code === 'EPERM') {
            return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
        } else if (er.code !== 'EISDIR') {
            throw er;
        }
        rmdirSync(p, options, er);
    }
}
function rmdirSync(p, options, originalEr) {
    assert(p);
    assert(options);
    try {
        options.rmdirSync(p);
    } catch (er) {
        if (er.code === 'ENOTDIR') {
            throw originalEr;
        } else if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM') {
            rmkidsSync(p, options);
        } else if (er.code !== 'ENOENT') {
            throw er;
        }
    }
}
function rmkidsSync(p, options) {
    assert(p);
    assert(options);
    options.readdirSync(p).forEach(function(f) {
        return rimrafSync(path$8.join(p, f), options);
    });
    if (isWindows) {
        // We only end up here once we got ENOTEMPTY at least once, and
        // at this point, we are guaranteed to have removed all the kids.
        // So, we know that it won't be ENOENT or ENOTDIR or anything else.
        // try really hard to delete stuff on windows, because it has a
        // PROFOUNDLY annoying habit of not closing handles promptly when
        // files are deleted, resulting in spurious ENOTEMPTY errors.
        var startTime = Date.now();
        do {
            try {
                var ret = options.rmdirSync(p, options);
                return ret;
            } catch (e) {}
        }while (Date.now() - startTime < 500); // give up after 500ms
    } else {
        var ret1 = options.rmdirSync(p, options);
        return ret1;
    }
}
var rimraf_1 = rimraf$1;
rimraf$1.sync = rimrafSync;

var u$7 = universalify$1.fromCallback;
var rimraf = rimraf_1;
var remove$2 = {
    remove: u$7(rimraf),
    removeSync: rimraf.sync
};

var u$6 = universalify$1.fromCallback;
var fs$9 = gracefulFs;
var path$7 = require$$1__default["default"];
var mkdir$3 = mkdirs$2;
var remove$1 = remove$2;
var emptyDir = u$6(function emptyDir(dir, callback) {
    callback = callback || function() {};
    fs$9.readdir(dir, function(err, items) {
        if (err) return mkdir$3.mkdirs(dir, callback);
        items = items.map(function(item) {
            return path$7.join(dir, item);
        });
        deleteItem();
        function deleteItem() {
            var item = items.pop();
            if (!item) return callback();
            remove$1.remove(item, function(err) {
                if (err) return callback(err);
                deleteItem();
            });
        }
    });
});
function emptyDirSync(dir) {
    var items;
    try {
        items = fs$9.readdirSync(dir);
    } catch (e) {
        return mkdir$3.mkdirsSync(dir);
    }
    items.forEach(function(item) {
        item = path$7.join(dir, item);
        remove$1.removeSync(item);
    });
}
var empty = {
    emptyDirSync: emptyDirSync,
    emptydirSync: emptyDirSync,
    emptyDir: emptyDir,
    emptydir: emptyDir
};

var u$5 = universalify$1.fromCallback;
var path$6 = require$$1__default["default"];
var fs$8 = gracefulFs;
var mkdir$2 = mkdirs$2;
function createFile(file, callback) {
    function makeFile() {
        fs$8.writeFile(file, '', function(err) {
            if (err) return callback(err);
            callback();
        });
    }
    fs$8.stat(file, function(err, stats) {
        if (!err && stats.isFile()) return callback();
        var dir = path$6.dirname(file);
        fs$8.stat(dir, function(err, stats) {
            if (err) {
                // if the directory doesn't exist, make it
                if (err.code === 'ENOENT') {
                    return mkdir$2.mkdirs(dir, function(err) {
                        if (err) return callback(err);
                        makeFile();
                    });
                }
                return callback(err);
            }
            if (stats.isDirectory()) makeFile();
            else {
                // parent is not a directory
                // This is just to cause an internal ENOTDIR error to be thrown
                fs$8.readdir(dir, function(err) {
                    if (err) return callback(err);
                });
            }
        });
    });
}
function createFileSync(file) {
    var stats;
    try {
        stats = fs$8.statSync(file);
    } catch (e) {}
    if (stats && stats.isFile()) return;
    var dir = path$6.dirname(file);
    try {
        if (!fs$8.statSync(dir).isDirectory()) {
            // parent is not a directory
            // This is just to cause an internal ENOTDIR error to be thrown
            fs$8.readdirSync(dir);
        }
    } catch (err) {
        // If the stat call above failed because the directory doesn't exist, create it
        if (err && err.code === 'ENOENT') mkdir$2.mkdirsSync(dir);
        else throw err;
    }
    fs$8.writeFileSync(file, '');
}
var file$1 = {
    createFile: u$5(createFile),
    createFileSync: createFileSync
};

var u$4 = universalify$1.fromCallback;
var path$5 = require$$1__default["default"];
var fs$7 = gracefulFs;
var mkdir$1 = mkdirs$2;
var pathExists$4 = pathExists_1.pathExists;
function createLink(srcpath, dstpath, callback) {
    function makeLink(srcpath, dstpath) {
        fs$7.link(srcpath, dstpath, function(err) {
            if (err) return callback(err);
            callback(null);
        });
    }
    pathExists$4(dstpath, function(err, destinationExists) {
        if (err) return callback(err);
        if (destinationExists) return callback(null);
        fs$7.lstat(srcpath, function(err) {
            if (err) {
                err.message = err.message.replace('lstat', 'ensureLink');
                return callback(err);
            }
            var dir = path$5.dirname(dstpath);
            pathExists$4(dir, function(err, dirExists) {
                if (err) return callback(err);
                if (dirExists) return makeLink(srcpath, dstpath);
                mkdir$1.mkdirs(dir, function(err) {
                    if (err) return callback(err);
                    makeLink(srcpath, dstpath);
                });
            });
        });
    });
}
function createLinkSync(srcpath, dstpath) {
    var destinationExists = fs$7.existsSync(dstpath);
    if (destinationExists) return undefined;
    try {
        fs$7.lstatSync(srcpath);
    } catch (err) {
        err.message = err.message.replace('lstat', 'ensureLink');
        throw err;
    }
    var dir = path$5.dirname(dstpath);
    var dirExists = fs$7.existsSync(dir);
    if (dirExists) return fs$7.linkSync(srcpath, dstpath);
    mkdir$1.mkdirsSync(dir);
    return fs$7.linkSync(srcpath, dstpath);
}
var link$1 = {
    createLink: u$4(createLink),
    createLinkSync: createLinkSync
};

var path$4 = require$$1__default["default"];
var fs$6 = gracefulFs;
var pathExists$3 = pathExists_1.pathExists;
/**
 * Function that returns two types of paths, one relative to symlink, and one
 * relative to the current working directory. Checks if path is absolute or
 * relative. If the path is relative, this function checks if the path is
 * relative to symlink or relative to current working directory. This is an
 * initiative to find a smarter `srcpath` to supply when building symlinks.
 * This allows you to determine which path to use out of one of three possible
 * types of source paths. The first is an absolute path. This is detected by
 * `path.isAbsolute()`. When an absolute path is provided, it is checked to
 * see if it exists. If it does it's used, if not an error is returned
 * (callback)/ thrown (sync). The other two options for `srcpath` are a
 * relative url. By default Node's `fs.symlink` works by creating a symlink
 * using `dstpath` and expects the `srcpath` to be relative to the newly
 * created symlink. If you provide a `srcpath` that does not exist on the file
 * system it results in a broken symlink. To minimize this, the function
 * checks to see if the 'relative to symlink' source file exists, and if it
 * does it will use it. If it does not, it checks if there's a file that
 * exists that is relative to the current working directory, if does its used.
 * This preserves the expectations of the original fs.symlink spec and adds
 * the ability to pass in `relative to current working direcotry` paths.
 */ function symlinkPaths$1(srcpath, dstpath, callback) {
    if (path$4.isAbsolute(srcpath)) {
        return fs$6.lstat(srcpath, function(err) {
            if (err) {
                err.message = err.message.replace('lstat', 'ensureSymlink');
                return callback(err);
            }
            return callback(null, {
                toCwd: srcpath,
                toDst: srcpath
            });
        });
    } else {
        var dstdir = path$4.dirname(dstpath);
        var relativeToDst = path$4.join(dstdir, srcpath);
        return pathExists$3(relativeToDst, function(err, exists) {
            if (err) return callback(err);
            if (exists) {
                return callback(null, {
                    toCwd: relativeToDst,
                    toDst: srcpath
                });
            } else {
                return fs$6.lstat(srcpath, function(err) {
                    if (err) {
                        err.message = err.message.replace('lstat', 'ensureSymlink');
                        return callback(err);
                    }
                    return callback(null, {
                        toCwd: srcpath,
                        toDst: path$4.relative(dstdir, srcpath)
                    });
                });
            }
        });
    }
}
function symlinkPathsSync$1(srcpath, dstpath) {
    var exists;
    if (path$4.isAbsolute(srcpath)) {
        exists = fs$6.existsSync(srcpath);
        if (!exists) throw new Error('absolute srcpath does not exist');
        return {
            toCwd: srcpath,
            toDst: srcpath
        };
    } else {
        var dstdir = path$4.dirname(dstpath);
        var relativeToDst = path$4.join(dstdir, srcpath);
        exists = fs$6.existsSync(relativeToDst);
        if (exists) {
            return {
                toCwd: relativeToDst,
                toDst: srcpath
            };
        } else {
            exists = fs$6.existsSync(srcpath);
            if (!exists) throw new Error('relative srcpath does not exist');
            return {
                toCwd: srcpath,
                toDst: path$4.relative(dstdir, srcpath)
            };
        }
    }
}
var symlinkPaths_1 = {
    symlinkPaths: symlinkPaths$1,
    symlinkPathsSync: symlinkPathsSync$1
};

var fs$5 = gracefulFs;
function symlinkType$1(srcpath, type, callback) {
    callback = typeof type === 'function' ? type : callback;
    type = typeof type === 'function' ? false : type;
    if (type) return callback(null, type);
    fs$5.lstat(srcpath, function(err, stats) {
        if (err) return callback(null, 'file');
        type = stats && stats.isDirectory() ? 'dir' : 'file';
        callback(null, type);
    });
}
function symlinkTypeSync$1(srcpath, type) {
    var stats;
    if (type) return type;
    try {
        stats = fs$5.lstatSync(srcpath);
    } catch (e) {
        return 'file';
    }
    return stats && stats.isDirectory() ? 'dir' : 'file';
}
var symlinkType_1 = {
    symlinkType: symlinkType$1,
    symlinkTypeSync: symlinkTypeSync$1
};

var u$3 = universalify$1.fromCallback;
var path$3 = require$$1__default["default"];
var fs$4 = gracefulFs;
var _mkdirs = mkdirs$2;
var mkdirs = _mkdirs.mkdirs;
var mkdirsSync = _mkdirs.mkdirsSync;
var _symlinkPaths = symlinkPaths_1;
var symlinkPaths = _symlinkPaths.symlinkPaths;
var symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
var _symlinkType = symlinkType_1;
var symlinkType = _symlinkType.symlinkType;
var symlinkTypeSync = _symlinkType.symlinkTypeSync;
var pathExists$2 = pathExists_1.pathExists;
function createSymlink(srcpath, dstpath, type, callback) {
    callback = typeof type === 'function' ? type : callback;
    type = typeof type === 'function' ? false : type;
    pathExists$2(dstpath, function(err, destinationExists) {
        if (err) return callback(err);
        if (destinationExists) return callback(null);
        symlinkPaths(srcpath, dstpath, function(err, relative) {
            if (err) return callback(err);
            srcpath = relative.toDst;
            symlinkType(relative.toCwd, type, function(err, type) {
                if (err) return callback(err);
                var dir = path$3.dirname(dstpath);
                pathExists$2(dir, function(err, dirExists) {
                    if (err) return callback(err);
                    if (dirExists) return fs$4.symlink(srcpath, dstpath, type, callback);
                    mkdirs(dir, function(err) {
                        if (err) return callback(err);
                        fs$4.symlink(srcpath, dstpath, type, callback);
                    });
                });
            });
        });
    });
}
function createSymlinkSync(srcpath, dstpath, type) {
    var destinationExists = fs$4.existsSync(dstpath);
    if (destinationExists) return undefined;
    var relative = symlinkPathsSync(srcpath, dstpath);
    srcpath = relative.toDst;
    type = symlinkTypeSync(relative.toCwd, type);
    var dir = path$3.dirname(dstpath);
    var exists = fs$4.existsSync(dir);
    if (exists) return fs$4.symlinkSync(srcpath, dstpath, type);
    mkdirsSync(dir);
    return fs$4.symlinkSync(srcpath, dstpath, type);
}
var symlink$1 = {
    createSymlink: u$3(createSymlink),
    createSymlinkSync: createSymlinkSync
};

var file = file$1;
var link = link$1;
var symlink = symlink$1;
var ensure = {
    // file
    createFile: file.createFile,
    createFileSync: file.createFileSync,
    ensureFile: file.createFile,
    ensureFileSync: file.createFileSync,
    // link
    createLink: link.createLink,
    createLinkSync: link.createLinkSync,
    ensureLink: link.createLink,
    ensureLinkSync: link.createLinkSync,
    // symlink
    createSymlink: symlink.createSymlink,
    createSymlinkSync: symlink.createSymlinkSync,
    ensureSymlink: symlink.createSymlink,
    ensureSymlinkSync: symlink.createSymlinkSync
};

function stringify$3(obj) {
    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref_EOL = _ref.EOL, EOL = _ref_EOL === void 0 ? '\n' : _ref_EOL, _ref_finalEOL = _ref.finalEOL, finalEOL = _ref_finalEOL === void 0 ? true : _ref_finalEOL, _ref_replacer = _ref.replacer, replacer = _ref_replacer === void 0 ? null : _ref_replacer, spaces = _ref.spaces;
    var EOF = finalEOL ? EOL : '';
    var str = JSON.stringify(obj, replacer, spaces);
    return str.replace(/\n/g, EOL) + EOF;
}
function stripBom$1(content) {
    // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
    if (Buffer.isBuffer(content)) content = content.toString('utf8');
    return content.replace(/^\uFEFF/, '');
}
var utils = {
    stringify: stringify$3,
    stripBom: stripBom$1
};

function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
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
function _async_to_generator$1(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator$1(thisArg, body) {
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
var _fs;
try {
    _fs = gracefulFs;
} catch (_) {
    _fs = require$$0__default$2["default"];
}
var universalify = universalify$1;
var _require$1 = utils, stringify$2 = _require$1.stringify, stripBom = _require$1.stripBom;
function _readFile(file) {
    return __readFile.apply(this, arguments);
}
function __readFile() {
    __readFile = _async_to_generator$1(function(file) {
        var options, fs, shouldThrow, data, obj;
        var _arguments = arguments;
        return _ts_generator$1(this, function(_state) {
            switch(_state.label){
                case 0:
                    options = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : {};
                    if (typeof options === 'string') {
                        options = {
                            encoding: options
                        };
                    }
                    fs = options.fs || _fs;
                    shouldThrow = 'throws' in options ? options.throws : true;
                    return [
                        4,
                        universalify.fromCallback(fs.readFile)(file, options)
                    ];
                case 1:
                    data = _state.sent();
                    data = stripBom(data);
                    try {
                        obj = JSON.parse(data, options ? options.reviver : null);
                    } catch (err) {
                        if (shouldThrow) {
                            err.message = "".concat(file, ": ").concat(err.message);
                            throw err;
                        } else {
                            return [
                                2,
                                null
                            ];
                        }
                    }
                    return [
                        2,
                        obj
                    ];
            }
        });
    });
    return __readFile.apply(this, arguments);
}
var readFile = universalify.fromPromise(_readFile);
function readFileSync(file) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (typeof options === 'string') {
        options = {
            encoding: options
        };
    }
    var fs = options.fs || _fs;
    var shouldThrow = 'throws' in options ? options.throws : true;
    try {
        var content = fs.readFileSync(file, options);
        content = stripBom(content);
        return JSON.parse(content, options.reviver);
    } catch (err) {
        if (shouldThrow) {
            err.message = "".concat(file, ": ").concat(err.message);
            throw err;
        } else {
            return null;
        }
    }
}
function _writeFile(file, obj) {
    return __writeFile.apply(this, arguments);
}
function __writeFile() {
    __writeFile = _async_to_generator$1(function(file, obj) {
        var options, fs, str;
        var _arguments = arguments;
        return _ts_generator$1(this, function(_state) {
            switch(_state.label){
                case 0:
                    options = _arguments.length > 2 && _arguments[2] !== void 0 ? _arguments[2] : {};
                    fs = options.fs || _fs;
                    str = stringify$2(obj, options);
                    return [
                        4,
                        universalify.fromCallback(fs.writeFile)(file, str, options)
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return __writeFile.apply(this, arguments);
}
var writeFile = universalify.fromPromise(_writeFile);
function writeFileSync(file, obj) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var fs = options.fs || _fs;
    var str = stringify$2(obj, options);
    // not sure if fs.writeFileSync returns anything, but just in case
    return fs.writeFileSync(file, str, options);
}
var jsonfile$1 = {
    readFile: readFile,
    readFileSync: readFileSync,
    writeFile: writeFile,
    writeFileSync: writeFileSync
};
var jsonfile_1 = jsonfile$1;

var jsonFile$1 = jsonfile_1;
var jsonfile = {
    // jsonfile exports
    readJson: jsonFile$1.readFile,
    readJsonSync: jsonFile$1.readFileSync,
    writeJson: jsonFile$1.writeFile,
    writeJsonSync: jsonFile$1.writeFileSync
};

function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
var u$2 = universalify$1.fromCallback;
var fs$3 = gracefulFs;
var path$2 = require$$1__default["default"];
var mkdir = mkdirs$2;
var pathExists$1 = pathExists_1.pathExists;
function outputFile$1(file, data, encoding, callback) {
    if (typeof encoding === 'function') {
        callback = encoding;
        encoding = 'utf8';
    }
    var dir = path$2.dirname(file);
    pathExists$1(dir, function(err, itDoes) {
        if (err) return callback(err);
        if (itDoes) return fs$3.writeFile(file, data, encoding, callback);
        mkdir.mkdirs(dir, function(err) {
            if (err) return callback(err);
            fs$3.writeFile(file, data, encoding, callback);
        });
    });
}
function outputFileSync$1(file) {
    for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        args[_key - 1] = arguments[_key];
    }
    var _fs;
    var dir = path$2.dirname(file);
    if (fs$3.existsSync(dir)) {
        var _fs1;
        return (_fs1 = fs$3).writeFileSync.apply(_fs1, [
            file
        ].concat(_to_consumable_array(args)));
    }
    mkdir.mkdirsSync(dir);
    (_fs = fs$3).writeFileSync.apply(_fs, [
        file
    ].concat(_to_consumable_array(args)));
}
var output = {
    outputFile: u$2(outputFile$1),
    outputFileSync: outputFileSync$1
};

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
var stringify$1 = utils.stringify;
var outputFile = output.outputFile;
function outputJson(file, data) {
    return _outputJson.apply(this, arguments);
}
function _outputJson() {
    _outputJson = _async_to_generator(function(file, data) {
        var options, str;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    options = _arguments.length > 2 && _arguments[2] !== void 0 ? _arguments[2] : {};
                    str = stringify$1(data, options);
                    return [
                        4,
                        outputFile(file, str, options)
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _outputJson.apply(this, arguments);
}
var outputJson_1 = outputJson;

var stringify = utils.stringify;
var outputFileSync = output.outputFileSync;
function outputJsonSync(file, data, options) {
    var str = stringify(data, options);
    outputFileSync(file, str, options);
}
var outputJsonSync_1 = outputJsonSync;

var u$1 = universalify$1.fromPromise;
var jsonFile = jsonfile;
jsonFile.outputJson = u$1(outputJson_1);
jsonFile.outputJsonSync = outputJsonSync_1;
// aliases
jsonFile.outputJSON = jsonFile.outputJson;
jsonFile.outputJSONSync = jsonFile.outputJsonSync;
jsonFile.writeJSON = jsonFile.writeJson;
jsonFile.writeJSONSync = jsonFile.writeJsonSync;
jsonFile.readJSON = jsonFile.readJson;
jsonFile.readJSONSync = jsonFile.readJsonSync;
var json = jsonFile;

var fs$2 = gracefulFs;
var path$1 = require$$1__default["default"];
var copySync = copySync$1.copySync;
var removeSync = remove$2.removeSync;
var mkdirpSync = mkdirs$2.mkdirpSync;
var stat$1 = stat_1;
function moveSync$1(src, dest, opts) {
    opts = opts || {};
    var overwrite = opts.overwrite || opts.clobber || false;
    var srcStat = stat$1.checkPathsSync(src, dest, 'move').srcStat;
    stat$1.checkParentPathsSync(src, srcStat, dest, 'move');
    mkdirpSync(path$1.dirname(dest));
    return doRename$1(src, dest, overwrite);
}
function doRename$1(src, dest, overwrite) {
    if (overwrite) {
        removeSync(dest);
        return rename$1(src, dest, overwrite);
    }
    if (fs$2.existsSync(dest)) throw new Error('dest already exists.');
    return rename$1(src, dest, overwrite);
}
function rename$1(src, dest, overwrite) {
    try {
        fs$2.renameSync(src, dest);
    } catch (err) {
        if (err.code !== 'EXDEV') throw err;
        return moveAcrossDevice$1(src, dest, overwrite);
    }
}
function moveAcrossDevice$1(src, dest, overwrite) {
    var opts = {
        overwrite: overwrite,
        errorOnExist: true
    };
    copySync(src, dest, opts);
    return removeSync(src);
}
var moveSync_1 = moveSync$1;

var moveSync = {
    moveSync: moveSync_1
};

var fs$1 = gracefulFs;
var path = require$$1__default["default"];
var copy = copy$1.copy;
var remove = remove$2.remove;
var mkdirp = mkdirs$2.mkdirp;
var pathExists = pathExists_1.pathExists;
var stat = stat_1;
function move$1(src, dest, opts, cb) {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    var overwrite = opts.overwrite || opts.clobber || false;
    stat.checkPaths(src, dest, 'move', function(err, stats) {
        if (err) return cb(err);
        var srcStat = stats.srcStat;
        stat.checkParentPaths(src, srcStat, dest, 'move', function(err) {
            if (err) return cb(err);
            mkdirp(path.dirname(dest), function(err) {
                if (err) return cb(err);
                return doRename(src, dest, overwrite, cb);
            });
        });
    });
}
function doRename(src, dest, overwrite, cb) {
    if (overwrite) {
        return remove(dest, function(err) {
            if (err) return cb(err);
            return rename(src, dest, overwrite, cb);
        });
    }
    pathExists(dest, function(err, destExists) {
        if (err) return cb(err);
        if (destExists) return cb(new Error('dest already exists.'));
        return rename(src, dest, overwrite, cb);
    });
}
function rename(src, dest, overwrite, cb) {
    fs$1.rename(src, dest, function(err) {
        if (!err) return cb();
        if (err.code !== 'EXDEV') return cb(err);
        return moveAcrossDevice(src, dest, overwrite, cb);
    });
}
function moveAcrossDevice(src, dest, overwrite, cb) {
    var opts = {
        overwrite: overwrite,
        errorOnExist: true
    };
    copy(src, dest, opts, function(err) {
        if (err) return cb(err);
        return remove(src, cb);
    });
}
var move_1 = move$1;

var u = universalify$1.fromCallback;
var move = {
    move: u(move_1)
};

(function (module) {
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
module.exports = _object_spread({}, fs$i, copySync$1, copy$1, empty, ensure, json, mkdirs$2, moveSync, move, output, pathExists_1, remove$2);
// Export fs.promises as a getter property so that we don't trigger
// ExperimentalWarning before fs.promises is actually accessed.
var fs = require$$0__default$2["default"];
if (Object.getOwnPropertyDescriptor(fs, 'promises')) {
    Object.defineProperty(module.exports, 'promises', {
        get: function get() {
            return fs.promises;
        }
    });
}
}(lib));

var fs = lib.exports;

var TEMP_DIR = '.mf';

var fileExistsWithCaseSync = function(filepath) {
    var dir = require$$1__default["default"].dirname(filepath);
    if (filepath === '/' || filepath === '.') {
        return true;
    }
    var filenames = fs.readdirSync(dir);
    if (filenames.indexOf(require$$1__default["default"].basename(filepath)) === -1) {
        return false;
    }
    return fileExistsWithCaseSync(dir);
};
var fixPrefetchPath = function(exposePath) {
    var pathExt = [
        '.js',
        '.ts'
    ];
    var extReg = /\.(ts|js|tsx|jsx)$/;
    if (extReg.test(exposePath)) {
        return pathExt.map(function(ext) {
            return exposePath.replace(extReg, ".prefetch".concat(ext));
        });
    } else {
        return pathExt.map(function(ext) {
            return exposePath + ".prefetch".concat(ext);
        });
    }
};

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
var _require = require(normalizeWebpackPath.normalizeWebpackPath('webpack')), RuntimeGlobals = _require.RuntimeGlobals, Template = _require.Template;
function getFederationGlobalScope(runtimeGlobals) {
    return "".concat(runtimeGlobals.require || '__webpack_require__', ".federation");
}
var PrefetchPlugin = /*#__PURE__*/ function() {
    function PrefetchPlugin(options) {
        _class_call_check(this, PrefetchPlugin);
        _define_property(this, "options", void 0);
        _define_property(this, "_reWriteExports", void 0);
        this.options = options;
        this._reWriteExports = '';
    }
    _create_class(PrefetchPlugin, [
        {
            // eslint-disable-next-line max-lines-per-function
            key: "apply",
            value: function apply(compiler) {
                var _this = this;
                var _this_options_runtimePlugins, _this_options_runtimePlugins1;
                var _this_options = this.options, name = _this_options.name, exposes = _this_options.exposes;
                if (!exposes) {
                    return;
                }
                if (!compiler.options.context) {
                    throw new Error('compiler.options.context is not defined');
                }
                var runtimePlugins = this.options.runtimePlugins;
                if (!Array.isArray(runtimePlugins)) {
                    this.options.runtimePlugins = [];
                }
                var runtimePath = require$$1__default["default"].resolve(__dirname, './plugin.esm.js');
                var sharedPath = require$$1__default["default"].resolve(__dirname, './shared.esm.js');
                if (!((_this_options_runtimePlugins = this.options.runtimePlugins) === null || _this_options_runtimePlugins === void 0 ? void 0 : _this_options_runtimePlugins.includes(runtimePath))) {
                    this.options.runtimePlugins.push(runtimePath);
                }
                if (!((_this_options_runtimePlugins1 = this.options.runtimePlugins) === null || _this_options_runtimePlugins1 === void 0 ? void 0 : _this_options_runtimePlugins1.includes(sharedPath))) {
                    this.options.runtimePlugins.push(sharedPath);
                }
                var encodedName = sdk.encodeName(name);
                var asyncEntryPath = require$$1__default["default"].resolve(compiler.options.context, "node_modules/".concat(TEMP_DIR, "/").concat(encodedName, "/bootstrap.js"));
                if (fs.existsSync(asyncEntryPath)) {
                    fs.unlinkSync(asyncEntryPath);
                }
                if (!this.options.dataPrefetch) {
                    return;
                }
                var prefetchs = [];
                var exposeAlias = Object.keys(exposes);
                exposeAlias.forEach(function(alias) {
                    var exposePath;
                    // @ts-ignore
                    var exposeValue = exposes[alias];
                    if (typeof exposeValue === 'string') {
                        exposePath = exposeValue;
                    } else {
                        exposePath = exposeValue.import[0];
                    }
                    var targetPaths = fixPrefetchPath(exposePath);
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(var _iterator = targetPaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var pathItem = _step.value;
                            var absolutePath = require$$1__default["default"].resolve(compiler.options.context, pathItem);
                            if (fileExistsWithCaseSync(absolutePath)) {
                                prefetchs.push(pathItem);
                                var absoluteAlias = alias.replace('.', '');
                                _this._reWriteExports += "export * as ".concat(runtimeUtils.getPrefetchId("".concat(name).concat(absoluteAlias)), " from '").concat(absolutePath, "';\n");
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                });
                if (!this._reWriteExports) {
                    return;
                }
                var tempDirRealPath = require$$1__default["default"].resolve(compiler.options.context, 'node_modules', TEMP_DIR);
                if (!fs.existsSync(tempDirRealPath)) {
                    fs.mkdirSync(tempDirRealPath);
                }
                if (!fs.existsSync("".concat(tempDirRealPath, "/").concat(encodedName))) {
                    fs.mkdirSync("".concat(tempDirRealPath, "/").concat(encodedName));
                }
                fs.writeFileSync(asyncEntryPath, this._reWriteExports);
                new compiler.webpack.DefinePlugin({
                    FederationDataPrefetch: JSON.stringify(asyncEntryPath)
                }).apply(compiler);
            }
        }
    ], [
        {
            key: "addRuntime",
            value: function addRuntime(compiler, options) {
                var encodedName = sdk.encodeName(options.name);
                if (!compiler.options.context) {
                    throw new Error('compiler.options.context is not defined');
                }
                var prefetchEntry = require$$1__default["default"].resolve(compiler.options.context, "node_modules/.mf/".concat(encodedName, "/bootstrap.js"));
                var federationGlobal = getFederationGlobalScope(RuntimeGlobals || {});
                return Template.asString([
                    fs.existsSync(prefetchEntry) ? Template.indent([
                        'function injectPrefetch() {',
                        Template.indent([
                            "globalThis.__FEDERATION__ = globalThis.__FEDERATION__ || {};",
                            "globalThis.__FEDERATION__['".concat(sdk.MFPrefetchCommon.globalKey, "'] = globalThis.__FEDERATION__['").concat(sdk.MFPrefetchCommon.globalKey, "'] || {"),
                            "entryLoading: {},",
                            "instance: new Map(),",
                            "__PREFETCH_EXPORTS__: {},",
                            "};",
                            "globalThis.__FEDERATION__['".concat(sdk.MFPrefetchCommon.globalKey, "']['").concat(sdk.MFPrefetchCommon.exportsKey, "'] = globalThis.__FEDERATION__['").concat(sdk.MFPrefetchCommon.globalKey, "']['").concat(sdk.MFPrefetchCommon.exportsKey, "'] || {};"),
                            "globalThis.__FEDERATION__['".concat(sdk.MFPrefetchCommon.globalKey, "']['").concat(sdk.MFPrefetchCommon.exportsKey, "']['").concat(options.name, "'] = function(){ return import('").concat(prefetchEntry, "');}")
                        ]),
                        '}',
                        "".concat(federationGlobal, ".prefetch = injectPrefetch")
                    ]) : '',
                    Template.indent([
                        "if(!".concat(federationGlobal, ".isMFRemote && ").concat(federationGlobal, ".prefetch){"),
                        "".concat(federationGlobal, ".prefetch()"),
                        '}'
                    ])
                ]);
            }
        },
        {
            key: "setRemoteIdentifier",
            value: function setRemoteIdentifier() {
                var federationGlobal = getFederationGlobalScope(RuntimeGlobals || {});
                return Template.indent([
                    "".concat(federationGlobal, ".isMFRemote = true;")
                ]);
            }
        },
        {
            key: "removeRemoteIdentifier",
            value: function removeRemoteIdentifier() {
                var federationGlobal = getFederationGlobalScope(RuntimeGlobals || {});
                return Template.indent([
                    "".concat(federationGlobal, ".isMFRemote = false;")
                ]);
            }
        }
    ]);
    return PrefetchPlugin;
}();

exports.PrefetchPlugin = PrefetchPlugin;
exports.getFederationGlobalScope = getFederationGlobalScope;
