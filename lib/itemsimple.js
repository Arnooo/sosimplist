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
         this.parent_ = parent;
         this.id_ = 'sosimplist-item'+(new Date().getTime());
         this.checked_ = false;
         this.text_ = '';
         this.view_ = null;
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
        if(this.view_ === null){
            var self_ = this;
            this.view_ = document.createElement("div");
            this.view_.id = this.id_;
            this.view_.className = 'sosimplist-item';
            this.view_.draggable = true;

            var divSelector = document.createElement("div");
            divSelector.className = 'sosimplist-item-selector';
            this.view_.appendChild(divSelector);

            var inputCheckbox = document.createElement("input");
            inputCheckbox.className = 'sosimplist-item-checkbox';
            inputCheckbox.type = 'checkbox';
            inputCheckbox.placeholder = 'write something';
            inputCheckbox.addEventListener(
                "change",
                function() { self_.checked_ = this.checked; },
                false
            );
            inputCheckbox.checked = self_.checked_;
            this.view_.appendChild(inputCheckbox);

            var inputText = document.createElement("input");
            inputText.className = 'sosimplist-item-text';
            inputText.type = 'text';
            inputText.placeholder = 'write something';
            inputText.addEventListener(
                "keyup",
                function() { self_.text_ = this.value;},
                false
            );
            if(this.text_ !== ''){
                inputText.value = this.text_;
            }else{}
            this.view_.appendChild(inputText);

            var divDelete = document.createElement("div");
            divDelete.className = 'sosimplist-item-delete';
            divDelete.addEventListener(
                "click",
                function() { self_.parent_.removeItem(self_);},
                false
            );
            this.view_.appendChild(divDelete);
        }
        else{
           console.log('Item simple ID = '+this.id_+', View already builded !');
        }
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
}

 /**
* @public
* @return {string} return content serialize in a base64 string
*/
ItemSimple.prototype.serialize = function() {
    var content = {
        id_ : this.id_,
        checked_ : this.checked_,
        text_ : this.text_
    };
    return JSON.stringify(content);
};

/**
 * @public
 * @param {string} str content serialized in a base64 string to decode
 */
ItemSimple.prototype.unserialize = function(str) {
    try {
        var content = JSON.parse(str);
        this.id_ = content.id_;
        this.checked_ = content.checked_;
        this.text_ = content.text_;
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
 }

 /**
  * @public
  * @return {string} return item id
  */
 ItemSimple.prototype.getId = function() {
    return this.id_;
 }