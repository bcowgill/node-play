/*
 aDerived.js
 object prototype inheritance from javascript The Good Parts p52+
 featuring fully private methods and properties and no new keyword in sight
 */
'use strict';

var _v, _init,
    aBase = require('./aBase');

function aDerived (properties, privates) {
    var instance = aBase(properties,  privates);

    privates = _init(properties, privates);

    instance._inherits = function _inherits() {
        return privates._inherits;
    };

    // (debug) peek only access to private data, users cannot change.
    instance._privates = function _getPrivates () {
        var _privates = JSON.parse(JSON.stringify(privates));
        return _privates;
    };

    instance.mass = function mass () {
        return privates.mass;
    };

    instance.summary = function summary () {
        return instance.counter() + ': ' + instance.name() + ' is ' +
                privates.mass + 'kg';
    };

    return instance;
}

// Initialise privates from properties or existing privates
_init = function _init(properties, privates) {
    properties = properties || {};
    privates = privates || {};

    privates._inherits = privates._inherits || [];
    privates._inherits.unshift('aDerived');

    privates.mass = _v(properties.mass,
        _v(privates.mass, 0));

    return privates;
};

// Return value or fall back to default
_v = function (value, defaultValue) {
    if (value !== void 0 && value !== null) {
        return value;
    }
    return defaultValue;
};

//aDerived.base = aBase;

module.exports = aDerived;
