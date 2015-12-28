/**
 * Item simple object
 */

 /**
  * @public
  * @constructor
  * @param {object} parent
  */
 function ItemSimple(parent) {
     var self_ = this;
     self_.parent_ = parent;
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

        var divSelector = document.createElement('div');
        divSelector.className = 'sosimplist-item-selector';
        self_.view_.appendChild(divSelector);

        var inputCheckbox = document.createElement('input');
        inputCheckbox.className = 'sosimplist-item-checkbox';
        inputCheckbox.type = 'checkbox';
        inputCheckbox.addEventListener(
            'change',
            function() {
                self_.check_(this.checked);

                if(self_.parent_){
                    //move item to the right container
                    self_.parent_.dispatch('moveItem', self_);
                }else{}
            },
            false
        );
        inputCheckbox.checked = self_.checked_;
        self_.view_.appendChild(inputCheckbox);

        var inputText = document.createElement('input');
        inputText.className = 'sosimplist-item-text';
        inputText.type = 'text';
        inputText.placeholder = 'write something';
        inputText.addEventListener(
            'keyup',
            function(event) { 
                self_.text_ = this.value;
            },
            false
        );
        if (self_.text_ !== '') {
            inputText.value = self_.text_;
        }else {}
        self_.view_.appendChild(inputText);

        var divDelete = document.createElement('div');
        divDelete.className = 'sosimplist-item-delete';
        divDelete.addEventListener(
            'click',
            function() { 
                if(self_.parent_){
                    self_.parent_.dispatch('removeItem', self_);
                }else{}
            },
            false
        );
        self_.view_.appendChild(divDelete);

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
        if(str) {
            var self_ = this;
            var content = JSON.parse(str);
            self_.id_ = content.id_;
            self_.checked_ = content.checked_;
            self_.text_ = content.text_;
        }
        else {
            throw new Error("Error str = "+str+", does not contain data to unserialize!");
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
* @private
* @param {bool} check item or not
*/
ItemSimple.prototype.check_ = function(check) {
    try {
        var self_ = this;

        if(check === true || check === false){
            self_.checked_ = check;

            //hide/show selector
            if(self_.view_ &&
               self_.view_.getElementsByClassName('sosimplist-item-selector') &&
               self_.view_.getElementsByClassName('sosimplist-item-selector')[0]){

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
                throw new Error("The view = "+self_.view_+" is not initialized correctly!");
            }
        }
        else{
            throw new Error("check = "+check+", cannot set this value!");
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
}
