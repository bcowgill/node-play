"use strict";

function capitalize (str)
{
    var firstLetter = str.charAt(0).toUpperCase();
    var rest = str.slice(1).toLowerCase();
/*    if (arguments.length > 3) {
        str += "easter egg";
    }
*/
    return firstLetter + rest;
}

module.exports = capitalize;