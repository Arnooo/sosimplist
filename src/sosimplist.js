/**
 * Use gjslint lib/*.js to check coding rules
 * Use fixjsstyle lib/*.js to fix coding rules
 *
 */

 /**
  * Constant
  */
var E_SAVE_IN = {
    NONE: 0,
    URL: 1,
    FIREBASE: 2
};

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
    self_.options_ = {
        data: [],
        save: E_SAVE_IN.URL,
        edit: true, // edit / remove / add
        checkable: true  // can check list item or not
    };
}

/**
 * @public
 * @param {string} viewId is the element Id where to display the list manager
 * @param {object} options is used to configure the list manager
 */
Sosimplist.prototype.init = function(viewId, options) {
    try {
        var self_ = this;
        if (self_.view_ === null) {
            self_.viewId_ = viewId;

            //merge options
            if (options) {
                for (var opt in options) {
                    if (self_.options_[opt] !== undefined) {
                        self_.options_[opt] = options[opt];
                    }
                    else {
                        throw new Error('Option = ' + opt + ' options[opt] = ' + options[opt] + ', does not exist in this version!');
                    }
                }
            }

            // load data 
            var dataToUnserialize = null;
            var hrefArray = window.location.href.split('#');
            // Try with init input parameters
            if(self_.options_.data && self_.options_.data.length > 0){
                dataToUnserialize = JSON.stringify(self_.options_.data);
            }
            // Try with URI
            else if(hrefArray[1]){
                dataToUnserialize = atob(hrefArray[1]);
            }
            else{
                //Do nothing
            }
            self_.unserialize(dataToUnserialize);

            /// @TODO clear all elment in the view before adding ours
            //self_.view_

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
                    if (false && event.srcElement.classList.contains('sosimplist-list')) {
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
                    }
                    else {
                        //Do nothing
                    }
                },
                false
            );
            self_.listContainer_.addEventListener(
                'dragenter',
                function(event) {
                    event.preventDefault();
                    if (false && event.dataTransfer.getData('source') === 'list') {
                        var elementDragged = document.getElementById(event.dataTransfer.getData('elementId'));
                        if (elementDragged) {
                            var parentTarget = event.target.closest('.sosimplist-list');
                            var isContainInThisList = parentTarget.parentNode.contains(elementDragged);
                            if (isContainInThisList) {
                                elementDragged.nextSibling === parentTarget ?
                                elementDragged.parentNode.insertBefore(elementDragged, parentTarget.nextSibling) :
                                elementDragged.parentNode.insertBefore(elementDragged, parentTarget);
                            }
                            else {
                                //Do nothing
                            }
                        }
                        else {
                            //Do nothing
                        }
                    }
                    else {
                        //Do nothing
                    }
                },
                false
            );
             self_.listContainer_.addEventListener(
                'drop',
                function(event) {
                    if (false && event.dataTransfer.getData('source') === 'list') {
                        var elementDragged = document.getElementById(event.dataTransfer.getData('elementId'));
                        if (elementDragged) {
                            document.body.removeChild(document.getElementById('mask'));
                            elementDragged.style.boxShadow = '';
                            elementDragged.style.zIndex = '0';
                        }
                        else {
                            //Do nothing
                        }
                    }
                    else {
                        //Do nothing
                    }
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

            if (self_.options_.edit) {
                var buttonAddList = document.createElement('input');
                    buttonAddList.className = 'sosimplist-button';
                    buttonAddList.id = 'sosimplist-button-add-list';
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
                    buttonClear.id = 'sosimplist-button-clear';
                    buttonClear.type = 'button';
                    buttonClear.value = 'Clear';
                    buttonClear.addEventListener(
                        'click',
                        function() {self_.clearAll();},
                        false
                    );
                self_.view_.appendChild(buttonClear);
            }
            else {
                //Do nothing
            }
        }
        else {
            console.error('Sosimplist ID = ' + self_.viewId_ + ', View already builded !');
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 * @return {string} return content serialize in a JSON object
 */
Sosimplist.prototype.serialize = function() {
    var self_ = this;
    var content = [];
    for (var listId in self_.mapOfList_) {
        content.push(self_.mapOfList_[listId].serialize());
    }

    return JSON.stringify(content);
};

/**
 * @public
 * @param {string} str content serialized in a JSON object
 */
Sosimplist.prototype.unserialize = function(str) {
    try {
        var self_ = this;
        if(str){
            var content = JSON.parse(str);
            self_.mapOfList_ = {};
            for (var i = 0; i < content.length; i++) {
                var myList = new List(self_.options_);
                content[i].id_ = content[i].id_ ? content[i].id_ : myList.getId()+i ;
                myList.unserialize(content[i]);
                myList.buildView();
                self_.mapOfList_[myList.getId()] = myList;
            }
        } 
        else
        {
            //Cannot unserialize null data, throw error
            throw new Error('Cannot unserialize empty data'); 
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
        var myList = new List(self_.options_);
        myList.buildView();
        self_.listContainer_.appendChild(myList.getView());
        self_.mapOfList_[myList.getId()] = myList;
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
  * @public
  * @return {string} return view as Element object to be placed in the DOM
  */
 Sosimplist.prototype.getView = function() {
     return this.view_;
 };

/**
* @public
* @return {string} return Sosimplist id
*/
Sosimplist.prototype.getId = function() {
    return this.viewId_;
};

/**
 * @private
 * @param {string} viewId
 */
Sosimplist.prototype.updateLocation_ = function(viewId) {
    var self_ = this;
    if (E_SAVE_IN.URL === self_.options_.save) {
        window.location.href = window.location.href.split('#')[0] + '#' + btoa(self_.serialize());
    }
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



