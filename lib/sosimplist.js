/**
 * Use gjslint lib/*.js to check coding rules
 * Use fixjsstyle lib/*.js to fix coding rules
 *
 */

/**
 * @private
 * @constructor
 */
function Sosimplist() {
    /** @private */
    this.viewId_ = 'body';
}

/** @private */
Sosimplist.prototype.build_ = function() {
    try {
        document.getElementById(this.viewId_).innerHTML = 'Sosimplist';
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 * @param {string} viewId
 */
Sosimplist.prototype.setViewId = function(viewId) {
    this.viewId_ = viewId;
    this.build_();
};


/**
 * @private
 * @return {Object}
 */
function Sosimplist_create() {
    return new Sosimplist();
}

var sosimplist = Sosimplist_create();



