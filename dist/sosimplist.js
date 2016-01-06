/**
 * Item simple object
 */

 /**
  * @public
  * @constructor
  * @param {object} parent
  * @param {object} options is used to configure the itemsimple
  */
 function ItemSimple(parent, options) {
    DEBUGCheckArgumentsAreValids(arguments, 2);
    var self_ = this;
    self_.parent_ = parent;
    self_.options_ = options;
    self_.id_ = 'sosimplist-item' + (new Date().getTime());
    self_.checked_ = false;
    self_.text_ = '';
    self_.view_ = null;
 }

 /**
 * @public
 */
ItemSimple.prototype.buildView = function() {
    var self_ = this;
    if (self_.view_ === null) {
        self_.view_ = document.createElement('div');
        self_.view_.id = self_.id_;
        self_.view_.className = 'sosimplist-item';

        if (self_.options_.edit) {
            var divSelector = document.createElement('div');
            divSelector.className = 'sosimplist-item-selector';
            self_.view_.appendChild(divSelector);
        }
        else {
            //Do nothing
        }

        var inputCheckbox = document.createElement('input');
        inputCheckbox.className = 'sosimplist-item-checkbox';
        inputCheckbox.type = 'checkbox';
        inputCheckbox.addEventListener(
            'change',
            function() {
                self_.check_(this.checked);

                if (self_.parent_) {
                    //move item to the right container
                    self_.parent_.dispatch('moveItem', self_);
                }
                else {
                    //Do nothing
                }
            },
            false
        );
        inputCheckbox.checked = self_.checked_;
        self_.view_.appendChild(inputCheckbox);

        var inputText = document.createElement('div');
        inputText.id = 'sosimplist-item-text' + self_.id_;
        inputText.className = 'sosimplist-item-text sosimplist-editable';
        //enable eddition
        if (self_.options_.edit) {
            inputText.contentEditable = true;
        }
        else {
            inputText.className += ' sosimplist-edit-false';
        }
        inputText.setAttribute('placeholder', 'write something');
        inputText.addEventListener(
            'keyup',
            function(event) {
                if (event.keyCode === 13 && self_.parent_) {
                    event.preventDefault();
                    event.stopPropagation();
                    self_.parent_.dispatch('insertItemAfter', self_);
                }
                else {
                    self_.text_ = this.innerHTML;
                }
            },
            false
        );
        inputText.addEventListener(
            'keydown',
            function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                else {
                    //Do nothing
                }
            },
            false
        );
         inputText.addEventListener(
            'keypress',
            function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                else {
                    //Do nothing
                }
            },
            false
        );
        if (self_.text_ !== '') {
            inputText.innerHTML = self_.text_;
        }else {}
        self_.view_.appendChild(inputText);

        if (self_.options_.edit) {
            var divDelete = document.createElement('div');
            divDelete.className = 'sosimplist-item-delete';
            divDelete.addEventListener(
                'click',
                function() {
                    if (self_.parent_) {
                        self_.parent_.dispatch('removeItem', self_);
                    }
                    else {
                        //Do nothing
                    }
                },
                false
            );
            self_.view_.appendChild(divDelete);
        }
        else {
            //Do nothing
        }

        //Customize view depending on private members
        self_.check_(self_.checked_);
    }
    else {
       console.error('Item simple ID = ' + self_.id_ + ', View already builded !');
    }
};

 /**
* @public
* @return {string} return content serialize in a base64 string
*/
ItemSimple.prototype.serialize = function() {
    var self_ = this;
    var content = {
        id_: self_.id_,
        checked_: self_.checked_,
        text_: self_.text_
    };
    return JSON.stringify(content);
};

/**
 * @public
 * @param {string} str content serialized in a base64 string to decode
 */
ItemSimple.prototype.unserialize = function(str) {
    try {
        DEBUGCheckArgumentsAreValids(arguments, 1);
        if (str) {
            var self_ = this;
            var content = JSON.parse(str);
            self_.id_ = content.id_;
            self_.checked_ = content.checked_;
            self_.text_ = content.text_;
        }
        else {
            throw new Error('Input str = ' + str + ', does not contain data to unserialize!');
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
  * @public
  * @return {element} return view as Element object to be placed in the view
  */
 ItemSimple.prototype.getView = function() {
    return this.view_;
 };

 /**
  * @public
  * @return {string} return item id
  */
 ItemSimple.prototype.getId = function() {
    return this.id_;
 };

  /**
  * @public
  * @return {bool} return if item is checked
  */
 ItemSimple.prototype.isChecked = function() {
    return this.checked_;
 };

/**
  * @public
  */
 ItemSimple.prototype.focus = function() {
    try {
        var self_ = this;
        var el = document.getElementById('sosimplist-item-text' + self_.id_);
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(el, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        el.focus();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
 };

/**
* @private
* @param {bool} check item or not
*/
ItemSimple.prototype.check_ = function(check) {
    try {
        DEBUGCheckArgumentsAreValids(arguments, 1);

        var self_ = this;

        if (check === true || check === false) {
            self_.checked_ = check;

            if (self_.options_.edit) {
                //hide/show selector
                if (self_.view_ &&
                   self_.view_.getElementsByClassName('sosimplist-item-selector') &&
                   self_.view_.getElementsByClassName('sosimplist-item-selector')[0]) {

                    //Enable/disable dragndrop
                    self_.view_.draggable = !self_.checked_;

                    if (self_.view_.draggable) {
                        self_.view_.getElementsByClassName('sosimplist-item-selector')[0].style.visibility = 'visible';
                    }
                    else {
                        self_.view_.getElementsByClassName('sosimplist-item-selector')[0].style.visibility = 'hidden';
                    }
                }
                else {
                    throw new Error('The view = ' + self_.view_ + ' is not initialized correctly!');
                }
            }
        }
        else {
            throw new Error('check = ' + check + ', cannot set this value!');
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
}

/**
 * List object
 */

 /**
  * @public
  * @constructor
  * @param {object} options is used to configure the list
  */
 function List(options) {
     var self_ = this;
     self_.options_ = options;
     self_.id_ = 'sosimplist-list' + (new Date().getTime());
     self_.view_ = null;
     self_.title_ = '';
     self_.mapOfItem_ = {};
     self_.checkedVisible_ = false;
     self_.dropdownButtonVisible_ = false;
     self_.dragData = null;

     //add default item
     self_.addItem();
 }

 /**
 * @public
 */
List.prototype.buildView = function() {
    try {
        var self_ = this;
        if (self_.view_ === null) {
             self_.view_ = document.createElement('div');
             self_.view_.id = self_.id_;
             self_.view_.className = 'sosimplist-list';

             if (self_.options_.edit) {
                self_.view_.draggable = true;
             }
             else {
                self_.view_.className += ' sosimplist-edit-false';
             }

             var inputTitle = document.createElement('div');
             inputTitle.id = 'sosimplist-title' + self_.id_;
             inputTitle.className = 'sosimplist-title sosimplist-editable';
             //enable eddition
             if (self_.options_.edit) {
                inputTitle.contentEditable = true;
             }
             else {
                inputTitle.className += ' sosimplist-edit-false';
             }
             inputTitle.type = 'text';
             inputTitle.setAttribute('placeholder', 'Title');
             inputTitle.addEventListener(
                 'keyup',
                 function() { 
                     if (event.keyCode === 13) {
                         event.preventDefault();
                         event.stopPropagation();
                     }
                     else {
                        self_.title_ = this.innerHTML;
                     }
                 },
                 false
             );
             inputTitle.addEventListener(
                'keydown',
                function(event) {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    else {
                        //Do nothing
                    }
                },
                false
            );
             inputTitle.addEventListener(
                'keypress',
                function(event) {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    else {
                        //Do nothing
                    }
                },
                false
            );
             if (self_.title_ !== '') {
                inputTitle.innerHTML = self_.title_;
             }
             else {
                //Do nothing
             }
             self_.view_.appendChild(inputTitle);

             self_.itemContainer_ = document.createElement('div');
             self_.itemContainer_.className = 'sosimplist-container-item';
             self_.itemContainer_.addEventListener(
                 'dragstart',
                 function(event) {
                    if (event.target.classList.contains('sosimplist-item')) {
                        var parentToDrag = event.target.closest('.sosimplist-item');
                        parentToDrag.style.zIndex = 1;
                        parentToDrag.style.boxShadow = '3px 3px 3px grey';
                        self_.dragData = {
                            elementId: parentToDrag.id,
                            source: 'item'
                        };

                        var mask = document.createElement('div');
                        mask.id = 'mask';
                        mask.style.backgroundColor = 'red'; //To check if opacity is working
                        mask.style.opacity = 0; // Should be not visible with opacity = 0
                        mask.style.width = parentToDrag.clientWidth;
                        mask.style.height = parentToDrag.clientHeight;
                        mask.style.cursor = 'move';
                        document.body.appendChild(mask);
                        event.dataTransfer.setDragImage(mask, 0, 0);
                    }
                    else {
                        //Do nothing
                    }
                 },
                 false
             );
             self_.itemContainer_.addEventListener(
                 'dragenter',
                 function(event) {
                    event.preventDefault();

                    if (self_.dragData && self_.dragData.source === 'item') {
                        var elementDragged = document.getElementById(self_.dragData.elementId);
                        if (elementDragged) {
                            var parentTarget = event.target.closest('.sosimplist-item');
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
             self_.itemContainer_.addEventListener(
                'drop',
                function(event) {
                    if (self_.dragData && self_.dragData.source === 'item') {
                        var elementDragged = document.getElementById(self_.dragData.elementId);
                        if (elementDragged) {
                            document.body.removeChild(document.getElementById('mask'));
                            elementDragged.style.boxShadow = '';
                            elementDragged.style.zIndex = '0';
                            self_.dragData = null;
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
             self_.itemContainer_.addEventListener(
                'dragover',
                function(event) {
                    event.preventDefault();
                },
                false
             );
             self_.view_.appendChild(self_.itemContainer_);

             if (self_.options_.edit) {
                 var buttonAddItem = document.createElement('input');
                 buttonAddItem.id = 'sosimplist-button-add-item';
                 buttonAddItem.className = 'sosimplist-button';
                 buttonAddItem.type = 'button';
                 buttonAddItem.value = 'Add item';
                 buttonAddItem.addEventListener(
                     'click',
                     function() { self_.addItem(); },
                     false
                 );
                 self_.view_.appendChild(buttonAddItem);
             }
             else {
                //Do nothing
             }


             var dropdownList = document.createElement('div');
             dropdownList.className = 'sosimplist-list-dropdown-checked';
             dropdownList.value = 'click';
             dropdownList.addEventListener(
                 'click',
                 function() {
                    self_.checkedVisible_ = !self_.checkedVisible_;
                    self_.setVisibility_();
                 },
                 false
             );
             var pin = document.createElement('div');
             pin.className = 'sosimplist-list-pin';
             dropdownList.appendChild(pin);
             var pinLabel = document.createElement('label');
             pinLabel.className = 'sosimplist-list-pin-label';
             pinLabel.innerHTML = 'Selected items';
             dropdownList.appendChild(pinLabel);
             self_.view_.appendChild(dropdownList);

             self_.itemContainerChecked_ = document.createElement('div');
             self_.itemContainerChecked_.className = 'sosimplist-container-item-checked';
             self_.view_.appendChild(self_.itemContainerChecked_);


             //Fill view view items
             for (var itemId in self_.mapOfItem_) {
                if (self_.mapOfItem_[itemId].isChecked()) {
                    self_.itemContainerChecked_.appendChild(self_.mapOfItem_[itemId].getView());
                }
                else {
                    self_.itemContainer_.appendChild(self_.mapOfItem_[itemId].getView());
                }
             }

             //Customize view depending on private members
             self_.setVisibility_();
         }
         else {
            console.error('List ID = ' + self_.id_ + ', View already builded !');
         }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
* @public
* @return {string} return content serialize in a base64 string
*/
List.prototype.serialize = function() {
    try {
        var self_ = this;
        var content = {
            id_: self_.id_,
            title_: self_.title_,
            arrayOfItem_: [] // parse element array to save item order
        };
        for (var i = 0; i < self_.itemContainer_.children.length; i++) {
            content.arrayOfItem_.push(self_.mapOfItem_[self_.itemContainer_.children[i].id].serialize());
        }
        for (var j = 0; j < self_.itemContainerChecked_.children.length; j++) {
            content.arrayOfItem_.push(self_.mapOfItem_[self_.itemContainerChecked_.children[j].id].serialize());
        }
        return JSON.stringify(content);
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 * @param {string} str content serialized in a base64 string to decode
 */
List.prototype.unserialize = function(str) {
    try {
        var self_ = this;
        var content = JSON.parse(str);
        self_.id_ = content.id_;
        self_.title_ = content.title_;
        self_.mapOfItem_ = {};
        for (var i = 0; i < content.arrayOfItem_.length; i++) {
            var myItem = new ItemSimple(self_, self_.options_);
            myItem.unserialize(content.arrayOfItem_[i]);
            myItem.buildView();
            self_.mapOfItem_[myItem.getId()] = myItem;
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
* @public
* @return {string} return list id
*/
List.prototype.getId = function() {
    return this.id_;
};

/**
* @public
* Add item to this list
* @param {object} itemElementCurrent used as index to create the new item element.
*/
List.prototype.addItem = function(itemElementCurrent) {
    try {
        var self_ = this;
        var myItem = new ItemSimple(self_, self_.options_);
        myItem.buildView();
        self_.mapOfItem_[myItem.getId()] = myItem;
        if (self_.view_ !== null) {
            if (itemElementCurrent) {
                self_.itemContainer_.insertBefore(myItem.getView(), itemElementCurrent.nextSibling);
            }
            else {
                self_.itemContainer_.appendChild(myItem.getView());
            }
            myItem.focus();
        }else {}
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
* @public
* Remove given item from this list
* @param {object} item
*/
List.prototype.removeItem = function(item) {
    try {
        var self_ = this;
        if (self_.itemContainer_.contains(document.getElementById(item.getId()))) {
            self_.itemContainer_.removeChild(document.getElementById(item.getId()));
        }
        else {
            self_.itemContainerChecked_.removeChild(document.getElementById(item.getId()));
        }
        self_.mapOfItem_[item.getId()] = undefined;
        delete self_.mapOfItem_[item.getId()];
        self_.setVisibility_();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
* @public
* Move given item to the right list container (checked container or default container)
* @param {object} item
*/
List.prototype.moveItem = function(item) {
    try {
        var self_ = this;
        if (item.isChecked()) {
            self_.itemContainerChecked_.appendChild(document.getElementById(item.getId()));
        }
        else {
            self_.itemContainer_.appendChild(document.getElementById(item.getId()));
        }
        self_.setVisibility_();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
* @public
* Insert new item after item given into parameter
* @param {object} item used as reference to insert new item after.
*/
List.prototype.insertItemAfter = function(item) {
    try {
        var self_ = this;
        self_.addItem(document.getElementById(item.getId()));
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
* @public
* Dispatch event received to the right method
* @param {string} eventName
* @param {object} data
*/
List.prototype.dispatch = function(eventName, data) {
    try {
        var self_ = this;
        if (eventName === 'moveItem') {
            self_.moveItem(data);
        }
        else if (eventName === 'removeItem') {
            self_.removeItem(data);
        }
        else if (eventName === 'insertItemAfter') {
            self_.insertItemAfter(data);
        }
        else {
            //Do nothing
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

 /**
  * @public
  * @return {string} return view as Element object to be placed in the view
  */
 List.prototype.getView = function() {
     return this.view_;
 };

 /**
  * @private
  */
 List.prototype.setVisibility_ = function() {
    try {
        var self_ = this;
         //hide/show list of item checked
        if (self_.checkedVisible_) {
            self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.display = '';
        }
        else {
            self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.display = 'none';
        }

        self_.dropdownButtonVisible_ = self_.itemContainerChecked_.hasChildNodes();
        if (self_.dropdownButtonVisible_) {
            self_.view_.getElementsByClassName('sosimplist-list-dropdown-checked')[0].style.display = '';
        }
        else {
            self_.view_.getElementsByClassName('sosimplist-list-dropdown-checked')[0].style.display = 'none';
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
 };



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

            //load data from URI
            var hrefArray = window.location.href.split('#');
            if (hrefArray[1]) {
                self_.unserialize(hrefArray[1]);
            }
            else {
                //Do nothing
            }

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
            var myList = new List(self_.options_);
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
        window.location.href = window.location.href.split('#')[0] + '#' + self_.serialize();
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



