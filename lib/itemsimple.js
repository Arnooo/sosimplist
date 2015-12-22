/**
 * Item simple object
 */

 /**
  * @public
  * @constructor
  * @param {object} parent
  */
 function ItemSimple(parent) {
    try {
         var self_ = this;
         self_.parent_ = parent;
         self_.id_ = 'sosimplist-item' + (new Date().getTime());
         self_.checked_ = false;
         self_.text_ = '';
         self_.view_ = null;
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
 }

 /**
 * @public
 */
ItemSimple.prototype.buildView = function() {
    try {
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
            inputCheckbox.placeholder = 'write something';
            inputCheckbox.addEventListener(
                'change',
                function() {
                    self_.check_(this.checked);

                    //move item to the right container
                    self_.parent_.moveItem(self_);
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
                function() { self_.text_ = this.value;},
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
                function() { self_.parent_.removeItem(self_);},
                false
            );
            self_.view_.appendChild(divDelete);

            //Customize view depending on private members
            self_.check_(self_.checked_);
        }
        else {
           console.log('Item simple ID = ' + self_.id_ + ', View already builded !');
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
        var self_ = this;
        var content = JSON.parse(str);
        self_.id_ = content.id_;
        self_.checked_ = content.checked_;
        self_.text_ = content.text_;
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
    var self_ = this;
    self_.checked_ = check;

    //Enable/disable dragndrop
    self_.view_.draggable = !self_.checked_;

    //hide/show selector
    if (self_.view_.draggable) {
        self_.view_.getElementsByClassName('sosimplist-item-selector')[0].style.visibility = 'visible';
    }
    else {
        self_.view_.getElementsByClassName('sosimplist-item-selector')[0].style.visibility = 'hidden';
    }
}
