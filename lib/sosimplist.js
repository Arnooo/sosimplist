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
    var self_ = this;
    self_.sosimplistId_ = new Date().getTime();
    self_.viewId_ = '';
    self_.view_ = null;
    self_.mapOfList_ = {};

    //load data from URI
    var hrefArray = window.location.href.split('#');
    if (hrefArray[1]) {
        self_.unserialize(hrefArray[1]);
    }
}

/**
 * @public
 * @param {string} viewId
 */
Sosimplist.prototype.init = function(viewId) {
    try {
        var self_ = this;
        self_.viewId_ = viewId;

        //build view
        self_.view_ = document.getElementById(this.viewId_);
        self_.view_.className += 'sosimplist';
        self_.view_.addEventListener(
             'keyup',
             function() {
                self_.updateLocation_();
             },
             false
         );
         self_.view_.addEventListener(
             'change',
             function() {
                self_.updateLocation_();
             },
             false
         );
         self_.view_.addEventListener(
             'click',
             function() {
                self_.updateLocation_();
             },
             false
         );
         self_.view_.addEventListener(
             'dragend',
             function() {
                self_.updateLocation_();
             },
             false
         );

        self_.listContainer_ = document.createElement('div');
        self_.listContainer_.id = 'sosimplist-container-list' + self_.sosimplistId_;
        self_.listContainer_.className = 'sosimplist-container-list';
        self_.listContainer_.addEventListener(
            'dragstart',
            function(event) {
                if(false && event.srcElement.classList.contains('sosimplist-list')){
                    var parentToDrag = event.target.closest('.sosimplist-list');
                    parentToDrag.style.zIndex = 1;
                    parentToDrag.style.boxShadow = '3px 3px 3px grey';
                    event.dataTransfer.setData('elementId', parentToDrag.id);
                    event.dataTransfer.setData('source', 'list');
                   
                    var mask = document.createElement('div');
                    mask.id = 'mask';
                    mask.style.backgroundColor = 'red'; //To check if opacity is working 
                    mask.style.opacity = 0; // Should be not visible with opacity = 0
                    mask.style.width = parentToDrag.clientWidth;
                    mask.style.height = parentToDrag.clientHeight;
                    mask.style.cursor = 'move';
                    document.body.appendChild(mask);
                    //event.dataTransfer.setDragImage(mask, 0, 0);
                }else{}
            },
            false
        );
        self_.listContainer_.addEventListener(
            'dragenter',
            function(event) {
                event.preventDefault();
                if(false && event.dataTransfer.getData('source') === 'list'){
                    var elementDragged = document.getElementById(event.dataTransfer.getData('elementId'));
                    if(elementDragged){
                        var parentTarget = event.target.closest('.sosimplist-list');
                        var isContainInThisList = parentTarget.parentNode.contains(elementDragged);
                        if(isContainInThisList){
                            elementDragged.nextSibling === parentTarget ?
                            elementDragged.parentNode.insertBefore(elementDragged, parentTarget.nextSibling) :
                            elementDragged.parentNode.insertBefore(elementDragged, parentTarget);
                        }else{}
                    }else{}
                }else{}
            },
            false
        );
         self_.listContainer_.addEventListener(
            'drop',
            function(event) {
                if(false && event.dataTransfer.getData('source') === 'list'){
                    var elementDragged = document.getElementById(event.dataTransfer.getData('elementId'));
                    if(elementDragged){
                        document.body.removeChild(document.getElementById('mask'));
                        elementDragged.style.boxShadow = '';
                        elementDragged.style.zIndex = '0';
                    }else{}
                }else{}
            },
            false
         );
         self_.listContainer_.addEventListener(
            'dragover',
            function(event) {
                event.preventDefault();
            },
            false
         );
        self_.view_.appendChild(self_.listContainer_);

        for (var listId in self_.mapOfList_) {
            self_.listContainer_.appendChild(self_.mapOfList_[listId].getView());
        }

        var buttonAddList = document.createElement('input');
            buttonAddList.className = 'sosimplist-button';
            buttonAddList.type = 'button';
            buttonAddList.value = 'Add list';
            buttonAddList.addEventListener(
                'click',
                function() {self_.addList();},
                false
            );
        self_.view_.appendChild(buttonAddList);

        var buttonClear = document.createElement('input');
            buttonClear.className = 'sosimplist-button';
            buttonClear.type = 'button';
            buttonClear.value = 'Clear';
            buttonClear.addEventListener(
                'click',
                function() {self_.clearAll();},
                false
            );
        self_.view_.appendChild(buttonClear);
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
    var self_ = this;
    var content = {
        viewId_: self_.viewId_,
        mapOfList_: {}
    };
    for (var listId in self_.mapOfList_) {
        content.mapOfList_[listId] = self_.mapOfList_[listId].serialize();
    }

    return btoa(JSON.stringify(content));
};

/**
 * @public
 * @param {string} str content serialized in a base64 string to decode
 */
Sosimplist.prototype.unserialize = function(str) {
    try {
        var self_ = this;
        var content = JSON.parse(atob(str));
        self_.viewId_ = content.viewId_;
        self_.mapOfList_ = {};
        for (var listId in content.mapOfList_) {
            var myList = new List();
            myList.unserialize(content.mapOfList_[listId]);
            myList.buildView();
            self_.mapOfList_[listId] = myList;
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
        var self_ = this;
        var myList = new List();
        myList.buildView();
        self_.listContainer_.appendChild(myList.getView());
        self_.mapOfList_[myList.getListId()] = myList;
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
        var self_ = this;
        self_.mapOfList_[listId].addItem();
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
        var self_ = this;
        self_.mapOfList_ = {};
        // Removing all children from an element
        var el = document.getElementById('sosimplist-container-list' + self_.sosimplistId_);
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        self_.updateLocation_();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @private
 * @param {string} viewId
 */
Sosimplist.prototype.updateLocation_ = function(viewId) {
    var self_ = this;
    window.location.href = window.location.href.split('#')[0] + '#' + self_.serialize();
    //console.log("Location changed !");
};

/**
 * @private
 * @return {Object}
 */
function Sosimplist_create() {
    return new Sosimplist();
}

var sosimplist = Sosimplist_create();



