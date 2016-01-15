/**
 * List object
 */

 /**
  * @public
  * @constructor
  * @param {object} options is used to configure the list
  */
 sosimplist.List = function(options) {
     var self_ = this;
     self_.options_ = options;
     self_.id_ = 'sosimplist-list' + (new Date().getTime());
     self_.view_ = null;
     self_.title_ = '';
     self_.image_ = null;
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
sosimplist.List.prototype.buildView = function() {
    try {
        var self_ = this;
        if (self_.view_ === null) {
             self_.view_ = document.createElement('div');
             self_.view_.id = self_.id_;
             self_.view_.className = 'sosimplist-list';
             self_.view_.style.display = 'table';

             if (self_.options_.edit) {
                self_.view_.draggable = false; //drag list disabled
             }
             else {
                self_.view_.className += ' sosimplist-edit-false';
             }

             var listContent = document.createElement('div');
             listContent.className = 'sosimplist-list-content';
             listContent.style.display = 'table-cell';

             if(self_.image_){
                 var imgElement = sosimplist.elementfactory.create('image', {
                    position: self_.image_.position,
                    src: self_.image_.src
                 });
                 if(self_.image_.position === 'bottom' ||
                    self_.image_.position === 'right'){
                    self_.view_.appendChild(listContent);
                    self_.view_.appendChild(imgElement);
                 }
                 // Default image set to Top of the list
                 else{
                    self_.view_.appendChild(imgElement);
                    self_.view_.appendChild(listContent);
                 }
             }
             else {
                self_.view_.appendChild(listContent);
             }

             //Add text element, used for the list title, to the layout
            var inputTitle = sosimplist.elementfactory.create(
             'text',
             {
                id: 'sosimplist-title' + self_.id_,
                className: 'sosimplist-title',
                keyup: function(event) {
                    var inputThis = this;
                    sosimplist.EventStrategy.key.enter.stop(event);
                    sosimplist.EventStrategy.key.not.enter.do(event, function(){self_.title_ = inputThis.innerHTML;});
                },
                text: self_.title_,
                placeholder: sosimplist.translate('Title'),
                edit: self_.options_.edit
             });
             listContent.appendChild(inputTitle);

             self_.itemContainer_ = document.createElement('div');
             self_.itemContainer_.className = 'sosimplist-container-item';
             self_.itemContainer_.addEventListener(
                 'dragstart',
                 function(event) {
                    self_.dragData = sosimplist.EventStrategy.dragstart(event, {source: 'sosimplist-item', closest: '.sosimplist-item'});
                 },
                 false
             );
             self_.itemContainer_.addEventListener(
                 'dragenter',
                 function(event) {
                    sosimplist.EventStrategy.dragenter(event, self_.dragData, {source: 'sosimplist-item', closest: '.sosimplist-item'});
                 },
                 false
             );
             self_.itemContainer_.addEventListener(
                'drop',
                function(event) {
                    sosimplist.EventStrategy.drop(event, self_.dragData, {source: 'sosimplist-item'});
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
             listContent.appendChild(self_.itemContainer_);

             if (self_.options_.edit) {
                 var buttonAddItem = sosimplist.elementfactory.create('button', {
                    id: 'sosimplist-button-add-item',
                    value: sosimplist.translate('Add item'),
                    click: function() {self_.addItem();}
                 });
                 listContent.appendChild(buttonAddItem);
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
             pinLabel.innerHTML = sosimplist.translate('Selected items');
             dropdownList.appendChild(pinLabel);
             listContent.appendChild(dropdownList);

             self_.itemContainerChecked_ = document.createElement('div');
             self_.itemContainerChecked_.className = 'sosimplist-container-item-checked';
             listContent.appendChild(self_.itemContainerChecked_);

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
sosimplist.List.prototype.serialize = function() {
    try {
        var self_ = this;
        var content = {
            title: self_.title_,
            image: self_.image_,
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
sosimplist.List.prototype.unserialize = function(obj) {
    try {
        var self_ = this;
        self_.id_ = obj.id_;
        self_.title_ = obj.title;
        self_.image_ = obj.image;
        self_.mapOfItem_ = {};
        for (var i = 0; i < obj.items.length; i++) {
            var myItem = sosimplist.itemfactory.create('Item'+obj.items[i].type, self_, self_.options_);
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
sosimplist.List.prototype.getId = function() {
    return this.id_;
};

/**
* @public
* Add item to this list
* @param {object} itemElementCurrent used as index to create the new item element.
*/
sosimplist.List.prototype.addItem = function(itemElementCurrent) {
    try {
        var self_ = this;
        var myItem = sosimplist.itemfactory.create('ItemText', self_, self_.options_);
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
* Remove given item from this list
* @param {object} item
*/
sosimplist.List.prototype.removeItem = function(item) {
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
sosimplist.List.prototype.moveItem = function(item) {
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
sosimplist.List.prototype.insertItemAfter = function(item) {
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
sosimplist.List.prototype.dispatch = function(eventName, data) {
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
 sosimplist.List.prototype.getView = function() {
     return this.view_;
 };

 /**
  * @private
  */
 sosimplist.List.prototype.setVisibility_ = function() {
    try {
        var self_ = this;
         //hide/show list of item checked
        if (self_.checkedVisible_) {
            self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.display = '';
            setTimeout(function(){
                self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.opacity = '1';
               // self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.transform = 'translate(0, 0)';
            },10);
            self_.view_.getElementsByClassName('sosimplist-list-pin')[0].style.transform = 'rotate(90deg)';
        }
        else {
            self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.opacity = '0';
            //self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.transform = 'translate(0, -100%)';
            self_.view_.getElementsByClassName('sosimplist-container-item-checked')[0].style.display = 'none';
            self_.view_.getElementsByClassName('sosimplist-list-pin')[0].style.transform = '';
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


