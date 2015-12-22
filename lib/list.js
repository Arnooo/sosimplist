/**
 * List object
 */

 /**
  * @public
  * @constructor
  */
 function List() {
     try {
         var self_ = this;
         self_.id_ = 'sosimplist-list' + (new Date().getTime());
         self_.view_ = null;
         self_.title_ = '';
         self_.mapOfItem_ = {};
         self_.drag = {
            dragged: null
         };

         //add default item
         self_.addItem();
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
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

             var inputTitle = document.createElement('input');
             inputTitle.id = 'sosimplist-title' + self_.id_;
             inputTitle.type = 'text';
             inputTitle.placeholder = 'Title';
             inputTitle.addEventListener(
                 'keyup',
                 function() { self_.title_ = this.value;},
                 false
             );
             if (self_.title_ !== '') {
                inputTitle.value = this.title_;
             }else {}
             self_.view_.appendChild(inputTitle);

             self_.itemContainer_ = document.createElement('div');
             self_.itemContainer_.id = 'sosimplist-container-item';
             self_.itemContainer_.addEventListener(
                 'dragstart',
                 function(event) {
                    self_.drag.dragged = event.target;
                 },
                 false
             );
             self_.itemContainer_.addEventListener(
                 'dragenter',
                 function(event) {
                    //swap two elements when dragenter event is fire
                    self_.drag.dragged.nextSibling === event.target.parentNode ?
                    event.target.parentNode.parentNode.insertBefore(self_.drag.dragged, event.target.parentNode.nextSibling) :
                    event.target.parentNode.parentNode.insertBefore(self_.drag.dragged, event.target.parentNode);
                 },
                 false
             );
             self_.view_.appendChild(this.itemContainer_);

             var buttonAddItem = document.createElement('input');
             buttonAddItem.className = 'sosimplist-button';
             buttonAddItem.type = 'button';
             buttonAddItem.value = 'Add item';
             buttonAddItem.addEventListener(
                 'click',
                 function() { self_.addItem(); },
                 false
             );
             self_.view_.appendChild(buttonAddItem);

             self_.itemContainerChecked_ = document.createElement('div');
             self_.itemContainerChecked_.id = 'sosimplist-container-item-checked';
             self_.view_.appendChild(this.itemContainerChecked_);

             //Fill view view items
             for (var itemId in this.mapOfItem_) {
                if (self_.mapOfItem_[itemId].isChecked()) {
                    self_.itemContainerChecked_.appendChild(self_.mapOfItem_[itemId].getView());
                }
                else {
                    self_.itemContainer_.appendChild(self_.mapOfItem_[itemId].getView());
                }
             }
         }
         else {
            console.log('List ID = ' + self_.id_ + ', View already builded !');
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
        for (var i = 0; i < self_.itemContainerChecked_.children.length; i++) {
            content.arrayOfItem_.push(self_.mapOfItem_[self_.itemContainerChecked_.children[i].id].serialize());
        }
        return btoa(JSON.stringify(content));
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
        var content = JSON.parse(atob(str));
        self_.id_ = content.id_;
        self_.title_ = content.title_;
        self_.mapOfItem_ = {};
        for (var i = 0; i < content.arrayOfItem_.length; i++) {
            var myItem = new ItemSimple(self_);
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
List.prototype.getListId = function() {
    return this.id_;
};

/**
* @public
* Add item to this list
*/
List.prototype.addItem = function() {
    try {
        var self_ = this;
        var myItem = new ItemSimple(self_);
        myItem.buildView();
        self_.mapOfItem_[myItem.getId()] = myItem;
        if (self_.view_ !== null) {
            self_.itemContainer_.appendChild(myItem.getView());
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
        self_.mapOfItem_[item.getId()] = undefined;
        self_.itemContainer_.removeChild(document.getElementById(item.getId()));
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


