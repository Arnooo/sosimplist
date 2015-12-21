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
    this.view_ = null;
    this.mapOfList_ = {};

    //load data from URI
    var hrefArray = window.location.href.split('#');
    if (hrefArray[1]) {
        this.unserialize(hrefArray[1]);
    }
}

/**
 * @public
 */
Sosimplist.prototype.updateLocation_ = function(viewId) {
    var self_ = this;
    window.location.href = window.location.href.split('#')[0] + '#' + self_.serialize();
    console.log("Location changed !");
}

/**
 * @public
 * @param {string} viewId
 */
Sosimplist.prototype.init = function(viewId) {
    try {
        var self_ = this;
        this.viewId_ = viewId;

        //build view
        this.view_ = document.getElementById(this.viewId_);
        this.view_.addEventListener(
             "keyup",
             function() { 
                self_.updateLocation_();
             },
             false
         );
         this.view_.addEventListener(
             "change",
             function() { 
                self_.updateLocation_();
             },
             false
         );

        this.listContainer_ = document.createElement("div");
        this.listContainer_.id = 'container-list';
        this.view_.appendChild(this.listContainer_);

        for (var listId in this.mapOfList_) {
            this.listContainer_.appendChild(this.mapOfList_[listId].getView());
        }

        var buttonAddList = document.createElement("input");
            buttonAddList.type = "button";
            buttonAddList.value = "Add list";
            buttonAddList.addEventListener(
                "click",
                function(){self_.addList();},
                false
            );
        this.view_.appendChild(buttonAddList);

        var buttonClear = document.createElement("input");
            buttonClear.type = "button";
            buttonClear.value = "Clear";
            buttonClear.addEventListener(
                "click",
                function(){self_.clearAll();},
                false
            );
        this.view_.appendChild(buttonClear);
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
}

/**
 * @public
 * @return {string} return content serialize in a base64 string
 */
Sosimplist.prototype.serialize = function() {
    var content = {
        viewId_: this.viewId_,
        mapOfList_: {}
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
    try {
        var content = JSON.parse(atob(str));
        this.viewId_ = content.viewId_;
        this.mapOfList_ = {};
        for (var listId in content.mapOfList_) {
            var myList = new List();
            myList.unserialize(content.mapOfList_[listId]);
            myList.buildView();
            this.mapOfList_[listId] = myList;
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 */
Sosimplist.prototype.addList = function() {
    try {
        var myList = new List();
        myList.buildView();
        this.listContainer_.appendChild(myList.getView());
        this.mapOfList_[myList.getListId()] = myList;
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
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
};

/**
 * @public
 */
Sosimplist.prototype.clearAll = function() {
    try {
        this.mapOfList_ = {};
        // Removing all children from an element
        var el = document.getElementById('container-list');
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        this.updateLocation_();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @private
 * @return {Object}
 */
function Sosimplist_create() {
    return new Sosimplist();
}

var sosimplist = Sosimplist_create();



