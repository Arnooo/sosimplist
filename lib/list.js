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
         self_.checkedVisible_ = false;
         self_.dropdownButtonVisible_ = false;

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
             self_.view_.draggable = true;

             var inputTitle = document.createElement('input');
             inputTitle.id = 'sosimplist-title' + self_.id_;
             inputTitle.className = 'sosimplist-title';
             inputTitle.type = 'text';
             inputTitle.placeholder = 'Title';
             inputTitle.addEventListener(
                 'keyup',
                 function() { self_.title_ = this.value;},
                 false
             );
             if (self_.title_ !== '') {
                inputTitle.value = self_.title_;
             }else {}
             self_.view_.appendChild(inputTitle);

             self_.itemContainer_ = document.createElement('div');
             self_.itemContainer_.id = 'sosimplist-container-item';
             self_.itemContainer_.addEventListener(
                 'dragstart',
                 function(event) {
                    if(event.srcElement.classList.contains('sosimplist-item')){
                        var parentToDrag = event.target.closest('.sosimplist-item');
                        parentToDrag.style.zIndex = 1;
                        parentToDrag.style.boxShadow = '3px 3px 3px grey';
                        event.dataTransfer.setData('elementId', parentToDrag.id);
                        event.dataTransfer.setData('source', 'item');
                       
                        var mask = document.createElement('div');
                        mask.id = 'mask';
                        mask.style.backgroundColor = 'red'; //To check if opacity is working 
                        mask.style.opacity = 0; // Should be not visible with opacity = 0
                        mask.style.width = parentToDrag.clientWidth;
                        mask.style.height = parentToDrag.clientHeight;
                        mask.style.cursor = 'move';
                        document.body.appendChild(mask);
                        event.dataTransfer.setDragImage(mask, 0, 0);
                    }else{}
                 },
                 false
             );
             self_.itemContainer_.addEventListener(
                 'dragenter',
                 function(event) {
                    event.preventDefault();

                    if(event.dataTransfer.getData('source') === 'item'){
                        var elementDragged = document.getElementById(event.dataTransfer.getData('elementId'));
                        if(elementDragged){
                            var parentTarget = event.target.closest('.sosimplist-item');
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
             self_.itemContainer_.addEventListener(
                'drop',
                function(event) {
                    if(event.dataTransfer.getData('source') === 'item'){
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
             self_.itemContainer_.addEventListener(
                'dragover',
                function(event) {
                    event.preventDefault();
                },
                false
             );
             self_.view_.appendChild(self_.itemContainer_);

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
        if(self_.itemContainer_.contains(document.getElementById(item.getId()))){
            self_.itemContainer_.removeChild(document.getElementById(item.getId()));
        }
        else{
            self_.itemContainerChecked_.removeChild(document.getElementById(item.getId()));
        }
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


