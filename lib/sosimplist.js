/**
 * Use gjslint lib/*.js to check coding rules
 * Use fixjsstyle lib/*.js to fix coding rules
 *
 */

 /**
  * Constant
  */
var DEBUG = 1;

/**
 * @private
 * @constructor
 */
function Sosimplist() {
    /** @private */
    this.viewId_ = 'body';
    this.mapOfList_ = {};

}

/** @private */
Sosimplist.prototype.buildView_ = function() {
    try {
        document.getElementById(this.viewId_).innerHTML = '';
        for (var listId in this.mapOfList_) {
//             window.location.pathname += '?'+this.mapOfList_[listId].serialize();
//             document.getElementById(this.viewId_).innerHTML += this.mapOfList_[listId].serialize();
            document.getElementById(this.viewId_).innerHTML += this.mapOfList_[listId].getView();
        }

        document.getElementById(this.viewId_).innerHTML += "<button onclick='sosimplist.addList()'>Add list</button>";
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
    this.buildView_();
};

/**
 * @public
 */
Sosimplist.prototype.addList = function() {
    var myList = new List();
    this.mapOfList_[myList.getListId()] = myList;
    this.buildView_();
};

/**
 * @public
 * @param {string} listId
 */
Sosimplist.prototype.addItem = function(listId) {
    try {
        this.mapOfList_[listId].addItem();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
    this.buildView_();
};

/**
 * @private
 * @return {Object}
 */
function Sosimplist_create() {
    return new Sosimplist();
}

var sosimplist = Sosimplist_create();



