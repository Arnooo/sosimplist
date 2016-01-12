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
* @return {object} return serialized object
*/
List.prototype.serialize = function() {
    try {
        var self_ = this;
        var content = {
            title: self_.title_,
            items: [] // parse element array to save item order
        };
        for (var i = 0; i < self_.itemContainer_.children.length; i++) {
            content.items.push(self_.mapOfItem_[self_.itemContainer_.children[i].id].serialize());
        }
        for (var j = 0; j < self_.itemContainerChecked_.children.length; j++) {
            content.items.push(self_.mapOfItem_[self_.itemContainerChecked_.children[j].id].serialize());
        }
        return content;
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

/**
 * @public
 * @param {object} obj content serialized to decode
 */
List.prototype.unserialize = function(obj) {
    try {
        var self_ = this;
        self_.id_ = obj.id_;
        self_.title_ = obj.title;
        self_.mapOfItem_ = {};
        for (var i = 0; i < obj.items.length; i++) {
            var myItem = itemfactory.create('Item'+obj.items[i].type, self_, self_.options_);
            obj.items[i].id_ = obj.items[i].id_ ? obj.items[i].id_ : myItem.getId()+i;
            myItem.unserialize(obj.items[i]);
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
        var myItem = itemfactory.create('ItemText', self_, self_.options_);
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


