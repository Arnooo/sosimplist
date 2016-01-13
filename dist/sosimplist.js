// Defining sosimplist namespace
var sosimplist = {};
 /**
  * @public
  * @constructor
  */
 sosimplist.ElementFactory = function() {
     var self_ = this;
 }
 
  
 /**
  * @public
  * @param {string} elementType is the type of the item to be created by the factory
  * @return {element} return the element asked
  */
 sosimplist.ElementFactory.prototype.create = function(elementType, options) {
     if(elementType === 'selector'){
        var divSelector = document.createElement('div');
        divSelector.className = 'sosimplist-item-selector';
        return divSelector;
     }
     else if(elementType === 'checkbox'){
        var inputCheckbox = document.createElement('input');
        inputCheckbox.className = 'sosimplist-item-checkbox';
        inputCheckbox.type = 'checkbox';
        inputCheckbox.checked = options.checked;
        inputCheckbox.addEventListener('change', options.change, false);
        return inputCheckbox;
     }
     else if(elementType === 'text'){
        var inputText = document.createElement('div');
        inputText.id = 'sosimplist-item-text' + options.id;
        inputText.className = 'sosimplist-item-text sosimplist-editable';
        //enable eddition
        if (options.edit) {
            inputText.contentEditable = true;
        }
        else {
            inputText.className += ' sosimplist-edit-false';
        }
        inputText.setAttribute('placeholder', options.placeholder);
        inputText.addEventListener('keyup', options.keyup, false);
        inputText.innerHTML = options.text;
        return inputText;
     }
     else if(elementType === 'delete'){
        var divDelete = document.createElement('div');
        divDelete.className = 'sosimplist-item-delete';
        divDelete.addEventListener('click',options.click,false);
        return divDelete;
     }
     else{
         console.error('Element type = ' + elementType + ' not supported yet !');
    }
 }

 /**
 * @private
 * @return {Object}
 */
function ElementFactory_create() {
    return new sosimplist.ElementFactory();
}

sosimplist.elementfactory = ElementFactory_create();
/**
 * Event strategy object
 * This object synthetise events function do execute
 */
 sosimplist.EventStrategy = {
    key:{
        enter:{
            stop:function(event, done){
                if(event.keyCode === 13){
                    event.preventDefault();
                    event.stopPropagation();
                    if(done){done()};
                }
                else{
                    //Do nothing
                }
            }
        },
        not:{
            enter:{
                do:function(event, done){
                    if(event.keyCode !== 13 && done){
                        done();
                    }
                    else{
                        //Do nothing
                    }
                }
            }
        }
    }
};
/**
 * Item base object
 */

 /**
  * @public
  * @constructor
  * @param {object} parent
  * @param {object} options is used to configure the item
  */
 sosimplist.ItemBase = function(parent, options) {
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
sosimplist.ItemBase.prototype.buildBase = function() {
    
    var self_ = this;
    if (self_.view_ === null) {
        self_.view_ = document.createElement('div');
        self_.view_.id = self_.id_;
        self_.view_.className = 'sosimplist-item';

        //Initialize layout
        var layout = [];

        //Add checkbox to the layout
        var inputCheckbox = sosimplist.elementfactory.create(
         'checkbox',
         { 
            checked:self_.checked_,
            change:function() {
                self_.check_(this.checked);
                if (self_.parent_) {
                    //move item to the right container
                    self_.parent_.dispatch('moveItem', self_);
                }
                else {
                    //Do nothing
                }
            }
        });
        layout.push(inputCheckbox);

        //Add text element to the layout
        var inputText = sosimplist.elementfactory.create(
         'text',
         {
            id: self_.id_,
            keyup: function(event) {
                var inputThis = this;
                sosimplist.EventStrategy.key.not.enter.do(event, function(){self_.text_ = inputThis.innerHTML;});
            },
            text: self_.text_,
            placeholder:'write something',
            edit: self_.options_.edit
        });
        layout.push(inputText);

        //Add others element depending on edit option
        if (self_.options_.edit) {
            //Add selector at the begining of the layout
            layout.unshift(sosimplist.elementfactory.create('selector'));

            //Add delete tick at the end of the layout
            var divDelete = sosimplist.elementfactory.create(
            'delete',
            {
                click:function() {
                    if (self_.parent_) {
                        self_.parent_.dispatch('removeItem', self_);
                    }
                    else {
                        //Do nothing
                    }
                }
            });
            layout.push(divDelete);

            self_.view_.addEventListener(
                'keyup',
                function(event){
                    sosimplist.EventStrategy.key.enter.stop(event, function(){if(self_.parent_){self_.parent_.dispatch('insertItemAfter', self_);}});
                },
                false
            );
            self_.view_.addEventListener(
                'keydown',
                sosimplist.EventStrategy.key.enter.stop,
                false
            );
            self_.view_.addEventListener(
                'keypress',
                sosimplist.EventStrategy.key.enter.stop,
                false
            );
        }
        else {
            //Do nothing
        }

        for(var i = 0; i < layout.length; i++){
            self_.view_.appendChild(layout[i]);
        }

        //Customize view depending on private members
        self_.check_(self_.checked_);
    }
    else {
       console.error('Item base ID = ' + self_.id_ + ', View already builded !');
    }
};

 /**
* @public
* @return {object} return serialized object 
*/
sosimplist.ItemBase.prototype.serializeBase = function() {
    var self_ = this;
    var content = {
        checked: self_.checked_,
        text: self_.text_
    };
    return content;
};

/**
 * @public
 * @param {object} obj serialized to decode
 */
sosimplist.ItemBase.prototype.unserializeBase = function(obj) {
    try {
       //DEBUGCheckArgumentsAreValids(arguments, 1);
        if (obj) {
            var self_ = this;
            self_.id_ = obj.id_;
            self_.checked_ = obj.checked;
            self_.text_ = obj.text;
        }
        else {
            throw new Error('Input obj = ' + obj + ', does not contain data to unserialize!');
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
 sosimplist.ItemBase.prototype.getView = function() {
    return this.view_;
 };

 /**
  * @public
  * @return {string} return item id
  */
 sosimplist.ItemBase.prototype.getId = function() {
    return this.id_;
 };

  /**
  * @public
  * @return {bool} return if item is checked
  */
 sosimplist.ItemBase.prototype.isChecked = function() {
    return this.checked_;
 };

/**
  * @public
  */
 sosimplist.ItemBase.prototype.focus = function() {
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
sosimplist.ItemBase.prototype.check_ = function(check) {
    try {
       //DEBUGCheckArgumentsAreValids(arguments, 1);

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
  * @public
  * @constructor
  */
 sosimplist.ItemFactory = function() {
     var self_ = this;
 }
 
 
 /**
  * @public
  * @param {string} itemType is the type of the item to be created by the factory
  * @return {object} return the object asked
  */
 sosimplist.ItemFactory.prototype.create = function(itemType, parent, options) {
     if(itemType === 'ItemText'){
         return new sosimplist.ItemText(parent, options);
     }
     else if(itemType === 'ItemTextComment'){
         return new sosimplist.ItemTextComment(parent, options);
     }
     else{
         console.error('Item type = ' + itemType + ' not supported yet !');
    }
 }

 /**
 * @private
 * @return {Object}
 */
function ItemFactory_create() {
    return new sosimplist.ItemFactory();
}

sosimplist.itemfactory = ItemFactory_create();
/**
 * Item text object
 */

/**
 * @public
 * @constructor
 * @extends {ItemBase}
 * @param {object} parent
 * @param {object} options is used to configure the item
 */
sosimplist.ItemText = function(parent, options) {
    sosimplist.ItemBase.apply(this, arguments);
}

sosimplist.ItemText.prototype = new sosimplist.ItemBase();

/**
 * @public
 */
sosimplist.ItemText.prototype.buildView = function() {
    var self_ = this;
    self_.buildBase();
};

/**
 * @public
 * @return {object} return serialized object 
 */
sosimplist.ItemText.prototype.serialize = function() {
    var self_ = this;
    dataSerialized = self_.serializeBase();
    dataSerialized.type = 'Text';
    return dataSerialized;
};

/**
 * @public
 * @param {object} obj serialized to decode
 */
sosimplist.ItemText.prototype.unserialize = function(obj) {
    var self_ = this;
    self_.unserializeBase(obj);
};

/**
 * Item text+comment object
 */

/**
 * @public
 * @constructor
 * @extends {ItemBase}
 * @param {object} parent
 * @param {object} options is used to configure the item
 */
sosimplist.ItemTextComment = function(parent, options) {
    var self_ = this;
    sosimplist.ItemBase.apply(this, arguments);
    self_.comment_='';
}

sosimplist.ItemTextComment.prototype = new sosimplist.ItemBase();

/**
 * @public
 */
sosimplist.ItemTextComment.prototype.buildView = function() {
    var self_ = this;
    self_.buildBase();
    var itemBaseView = self_.view_;
    if (itemBaseView) {
        var inputComment = sosimplist.elementfactory.create(
         'text',
         {
            id: self_.id_,
            keyup: function(event) {
                var inputThis = this;
                sosimplist.EventStrategy.key.not.enter.do(event, function(){self_.comment_ = inputThis.innerHTML;});
            },
            text: self_.comment_,
            placeholder:'write a comment',
            edit: self_.options_.edit
        });
        itemBaseView.insertBefore(inputComment, itemBaseView.lastChild);
    }
    else {
       console.error('Item simple ID = ' + self_.id_ + ', View already builded !');
    }
};

/**
 * @public
 * @return {object} return serialized object 
 */
sosimplist.ItemTextComment.prototype.serialize = function() {
    var self_ = this;
    var dataSerialized = self_.serializeBase();
    dataSerialized.comment = self_.comment_;
    dataSerialized.type = 'TextComment';
    return dataSerialized;
};

/**
 * @public
 * @param {object} obj serialized to decode
 */
sosimplist.ItemTextComment.prototype.unserialize = function(obj) {
    try {
       //DEBUGCheckArgumentsAreValids(arguments, 1);
        if (obj) {
            var self_ = this;
            self_.unserializeBase(obj);
            self_.comment_ = obj.comment;
        }
        else {
            throw new Error('Input obj = ' + obj + ', does not contain data to unserialize!');
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
};

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
                    var inputThis = this;
                    sosimplist.EventStrategy.key.enter.stop(event);
                    sosimplist.EventStrategy.key.not.enter.do(event, function(){self_.title_ = inputThis.innerHTML;});
                 },
                 false
             );
             inputTitle.addEventListener(
                'keydown',
                sosimplist.EventStrategy.key.enter.stop,
                false
            );
             inputTitle.addEventListener(
                'keypress',
                sosimplist.EventStrategy.key.enter.stop,
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
sosimplist.List.prototype.serialize = function() {
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
sosimplist.List.prototype.unserialize = function(obj) {
    try {
        var self_ = this;
        self_.id_ = obj.id_;
        self_.title_ = obj.title;
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
sosimplist.Manager = function() {
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
sosimplist.Manager.prototype.init = function(viewId, options) {
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

            //build view
            self_.view_ = document.getElementById(this.viewId_);

            //Display warning on not empty view
            if(self_.view_ && self_.view_.children.length > 0){
                console.warning("Sosimplist will append all lists at the end of the element ID = '"+self_.viewId_+"'!");
            }
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
sosimplist.Manager.prototype.serialize = function() {
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
sosimplist.Manager.prototype.unserialize = function(str) {
    try {
        var self_ = this;
        if(str){
            var content = JSON.parse(str);
            self_.mapOfList_ = {};
            for (var i = 0; i < content.length; i++) {
                var myList = new sosimplist.List(self_.options_);
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
sosimplist.Manager.prototype.addList = function() {
    try {
        var self_ = this;
        var myList = new sosimplist.List(self_.options_);
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
sosimplist.Manager.prototype.clearAll = function() {
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
 sosimplist.Manager.prototype.getView = function() {
     return this.view_;
 };

/**
* @public
* @return {string} return Sosimplist id
*/
sosimplist.Manager.prototype.getId = function() {
    return this.viewId_;
};

/**
 * @private
 * @param {string} viewId
 */
sosimplist.Manager.prototype.updateLocation_ = function(viewId) {
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
    return new sosimplist.Manager();
}
/**
 * @private
 * Creating solsimplist manager
 */
sosimplist.mgr = Sosimplist_create(); 

/**
 * @public
 * @param {string} viewId is the element Id where to display the list manager
 * @param {object} options is used to configure the list manager
 */
sosimplist.init = function(viewId, options){
    var self_ = this;
    self_.mgr.init(viewId, options);
};



