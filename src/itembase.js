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
            id: 'sosimplist-item-text' + self_.id_,
            className: 'sosimplist-item-text',
            keyup: function(event) {
                var inputThis = this;
                sosimplist.EventStrategy.key.not.enter.do(event, function(){self_.text_ = inputThis.innerHTML;});
            },
            text: self_.text_,
            placeholder: sosimplist.translate('write something'),
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
 * @param {string} property of this object
 * @return {bool} return element property
 */
sosimplist.ItemBase.prototype.property = function(property) {
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
