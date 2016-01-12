/**
 * Item simple object
 */

 /**
  * @public
  * @constructor
  * @param {object} parent
  * @param {object} options is used to configure the item
  */
 function ItemBase(parent, options) {
    DEBUGCheckArgumentsAreValids(arguments, 2);
    var self_ = this;
    self_.parent_ = parent;
    self_.options_ = options;
    self_.id_ = 'sosimplist-item' + (new Date().getTime());
    self_.checked_ = false;
    self_.text_ = '';
    self_.view_ = null;
    console.log("ItemBase ", parent, options);
 }

 /**
 * @public
 */
ItemBase.prototype.buildView = function() {
    
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
* @return {object} return serialized object 
*/
ItemBase.prototype.serialize = function() {
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
ItemBase.prototype.unserialize = function(obj) {
    try {
        DEBUGCheckArgumentsAreValids(arguments, 1);
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
 ItemBase.prototype.getView = function() {
    return this.view_;
 };

 /**
  * @public
  * @return {string} return item id
  */
 ItemBase.prototype.getId = function() {
    return this.id_;
 };

  /**
  * @public
  * @return {bool} return if item is checked
  */
 ItemBase.prototype.isChecked = function() {
    return this.checked_;
 };

/**
  * @public
  */
 ItemBase.prototype.focus = function() {
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
ItemBase.prototype.check_ = function(check) {
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
