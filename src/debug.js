'use strict';

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function DEBUGCheckNoArgument(inArguments) {
    console.assert(inArguments.length === 0);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function DEBUGCheckArgumentsAreValids(inArguments, inNbArgument) {
    console.assert(inArguments.length === inNbArgument, 'Set ' + inArguments.length + ' arguments in place of ' + inNbArgument);

    DEBUGCheckFirstArgumentsAreValids(inArguments, inNbArgument);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function DEBUGCheckFirstArgumentsAreValids(inArguments, inNbArgument) {
    for (var i = 0; i < inNbArgument; i++) {
        var arg = inArguments[i];
        var type = typeof arg;

        console.assert(type !== 'undefined', 'Argument ' + i + ' is undefined');
        console.assert(!(type === 'number' && isNaN(arg)), 'Argument ' + i + ' is undefined');
        console.assert(!(type === 'object' && arg === null), 'Argument ' + i + ' is null');
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function DEBUGAssertValue(inValue) { // tddo rename me
    var type = typeof inValue;

    console.assert(type !== 'undefined');
    console.assert(!(type === 'number' && isNaN(inValue)));
    console.assert(!(type === 'object' && inValue === null));
}
