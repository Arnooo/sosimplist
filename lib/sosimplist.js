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
    this.viewId_ = '';
    this.mapOfList_ = {};
    
    //load data from URI
    var hrefArray = window.location.href.split('#');
    if(hrefArray[1]) {
        this.unserialize(hrefArray[1]);
    }
}

/** @private */
Sosimplist.prototype.buildView_ = function() {
    try {
        document.getElementById(this.viewId_).innerHTML = '';
        for (var listId in this.mapOfList_) {            
            document.getElementById(this.viewId_).innerHTML += this.mapOfList_[listId].getView();
        }

        document.getElementById(this.viewId_).innerHTML += "<button onclick='sosimplist.addList()'>Add list</button>";
        
        window.location.href = window.location.href.split('#')[0] + '#'+this.serialize();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 * @return {string} return content serialize in a base64 string 
 */
Sosimplist.prototype.serialize = function() {
    var content = {
        viewId_ : this.viewId_,
        mapOfList_ : {}
    };
    for (var listId in this.mapOfList_) {
        content.mapOfList_[listId] = this.mapOfList_[listId].serialize();
    }
    
    return btoa(JSON.stringify(content));
};

/**
 * @public
 * @param {string} str content serialized in a base64 string to decode
 */
Sosimplist.prototype.unserialize = function(str) {
    var content = JSON.parse(atob(str));
    this.viewId_ = content.viewId_;
    this.mapOfList_ = {}
    for (var listId in content.mapOfList_) {
        var myList = new List();
        myList.unserialize(content.mapOfList_[listId]);
        this.mapOfList_[listId] = myList;
    };
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



