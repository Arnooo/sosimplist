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
         this.id_ = new Date().getTime();
         this.title_ = '';
         this.arrayOfItem_ = [];
         this.arrayOfItem_.push(new ItemSimple());

         //build view
         this.view_ = document.createElement("div");
         this.view_.id = 'list'+this.id_;

         var inputTitle = document.createElement("input");
         inputTitle.type = 'text';
         inputTitle.placeholder = 'Title';
         inputTitle.addEventListener(
             "keypress",
             function() { console.log(self_); },
             false
         );
         this.view_.appendChild(inputTitle);

         this.itemContainer_ = document.createElement("div");
         this.itemContainer_.id = 'container-item';
         this.view_.appendChild(this.itemContainer_);
         this.itemContainer_.appendChild(this.arrayOfItem_[0].getView());

         var buttonAddItem = document.createElement("input");
         buttonAddItem.type = 'button';
         buttonAddItem.placeholder = 'Title';
         buttonAddItem.value = 'Add item';
         buttonAddItem.addEventListener(
             "click",
             function() { self_.addItem(); },
             false
         );
         this.view_.appendChild(buttonAddItem);
    }
    catch (e) {
        console.error(e.name + ': ' + e.message);
    }
 }

/**
* @public
* @return {string} return content serialize in a base64 string
*/
List.prototype.serialize = function() {
    var content = {
        id_: this.id_,
        title_: this.title_,
        arrayOfItem_: this.arrayOfItem_
    };
    return btoa(JSON.stringify(content));
};

/**
 * @public
 * @param {string} str content serialized in a base64 string to decode
 */
List.prototype.unserialize = function(str) {
    try {
        var content = JSON.parse(atob(str));
        this.id_ = content.id_;
        this.title_ = content.title_;
        this.arrayOfItem_ = content.arrayOfItem_;
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
        var myItem = new ItemSimple();
        this.arrayOfItem_.push(myItem);
        this.itemContainer_.appendChild(myItem.getView());
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


