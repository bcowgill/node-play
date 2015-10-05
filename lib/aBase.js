/*
    aBase.js
    object prototype inheritance from javascript The Good Parts p52+
    featuring fully private methods and properties and no new keyword in sight
*/
'use strict';

var _v, _init, _addMethod, _proto = function () {}, _className = 'aBase';
void _proto;

function aBase (properties, privates) {
    var instance = {
        prototype: function () {},
        _inherits: [_className],
        _addMethod: _addMethod
    };


    privates = _init(properties, privates);

    // (debug) peek only access to private data, users cannot change.
    instance._privates = function _getPrivates () {
        var _privates = JSON.parse(JSON.stringify(privates));
        return _privates;
    };

    instance.name = function name () {
        return privates.name;
    };

    instance.counter = function counter () {
        return privates.counter;
    };

    instance._addMethod('superior', function (name) {
        var self = this,
            method = self[name];
        return function () {
            return method.apply(self, arguments);
        };
    });


    return instance;
}

// Initialise privates from properties or existing privates
_init = function _init(properties, privates) {
    properties = properties || {};
    privates = privates || {};

    privates._isa = _className;
    privates.counter = _v(privates.counter, 0);
    privates.name    = _v(properties.name,
        _v(privates.name, 'unnamed' + privates.counter));

    return privates;
};

// Return value or fall back to default
_v = function (value, defaultValue) {
    if (value !== void 0 && value !== null) {
        return value;
    }
    return defaultValue;
};

_addMethod = function (name, func) {
    this.prototype[name] = func;
    return this;
};

/*
    Javascript: The Good Parts globals for defining methods 
    this is bad practice though, so change it to be a method
    of aBase which all then serves as the master base class
*/
/* jshint -W121 */ // Extending prototype of native object
/*
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};
// jshint +W121

Object.method('superior', function (name) {
    var self = this,
        method = self[name];
    return function () {
        return method.apply(self, arguments);
    };
});
*/

module.exports = aBase;
