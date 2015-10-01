'use strict';

/* object prototype inheritance from javascript The Good Parts p52+
* featuring fully private methods and properties and no new keyword in sight */

function aBase (properties, privates) {
    /* jshint maxcomplexity: 7 */
    var instance = {};

    // Initialise privates from properties or existing privates
    properties = properties || {};
    privates = privates || {};
    privates.counter = privates.counter || 0;
    privates.name = properties.name || privates.name || 'unnamed' + privates.counter;

    // peek only access to private data, users cannot change.
    instance.privates = function getPrivates () {
        var string = JSON.stringify(privates);
        return string;
    };

    instance.name = function name () {
        return privates.name;
    };

    instance.counter = function counter () {
        return privates.counter;
    };

    return instance;
}

module.exports = aBase;