'use strict';

/* object prototype inheritance from javascript The Good Parts p52+
* featuring fully private methods and properties and no new keyword in sight */

var _v, _init;

function aBase (properties, privates) {
    var instance = {};

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

    return instance;
}

// Initialise privates from properties or existing privates
_init = function _init(properties, privates) {
    properties = properties || {};
    privates = privates || {};

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

module.exports = aBase;
